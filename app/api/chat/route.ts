import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse, extractInquiryData, isInquiryQualified } from '@/lib/ai/client';
import { databases, ID, Query } from '@/lib/appwrite/client';
import { findMatchingProperties, MatchedProperty } from '@/lib/appwrite/properties';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const INQUIRIES_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_INQUIRIES_COLLECTION!;
const CONVERSATIONS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_CONVERSATIONS_COLLECTION!;


export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, leadId, sourcePage, shownPropertyIds, history: clientHistory } = await request.json();
    const lastShownPropertyIds: string[] = Array.isArray(shownPropertyIds) ? shownPropertyIds : [];

    console.log('📨 Received message:', message);
    console.log('📋 Session ID:', sessionId);
    console.log('📋 Lead ID:', leadId);

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const currentSessionId = sessionId || ID.unique();
    let currentLeadId = leadId;

    // Conversation history now comes from the client (no messages are persisted to the DB —
    // only the extracted lead info gets saved once the customer actually provides it)
    let history: Array<{ role: string; content: string }> = Array.isArray(clientHistory)
      ? clientHistory.filter((m: any) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
      : [];

    console.log('📚 History length (from client):', history.length);

    history.push({ role: 'user', content: message });

    // Get AI response
    console.log('🧠 Calling AI...');
    const aiResponse = await getAIResponse(message, history);
    console.log('🤖 AI Response:', aiResponse);

    // Save AI response
    // (not persisted to DB — kept only in-memory for this request/response cycle)

    history.push({ role: 'assistant', content: aiResponse });

    // Extract inquiry data
    const historyBeforeThisTurn = history.slice(0, -2); // exclude this turn's user msg + AI reply
    const knownBefore = extractInquiryData(historyBeforeThisTurn);
    const extractedInquiry = extractInquiryData(history);
    let qualified = false;
    let inquiry = null;

    // Only search + attach properties when useful new criteria appeared this turn,
    // OR the user explicitly asks for more/other options
    let matchedProperties: MatchedProperty[] = [];
    const gainedNewCriteria =
      (!!extractedInquiry.location_preference && !knownBefore.location_preference) ||
      (!!extractedInquiry.property_type_preference && !knownBefore.property_type_preference) ||
      (!!extractedInquiry.budget_max && !knownBefore.budget_max);

    const askedForMore = /\bmore\b|\banother\b|\bother\b|\bdifferent\b|show me|see more|anymore/i.test(message);

    const hasEnoughToSearch =
      !!extractedInquiry.budget_max && (!!extractedInquiry.location_preference || !!extractedInquiry.property_type_preference);

    if ((gainedNewCriteria || askedForMore) && hasEnoughToSearch) {
      matchedProperties = await findMatchingProperties({
        location: extractedInquiry.location_preference,
        propertyType: extractedInquiry.property_type_preference,
        budgetMaxLakhs: extractedInquiry.budget_max,
        excludeIds: askedForMore ? lastShownPropertyIds : [],
      });
      console.log('🏠 Matched properties:', matchedProperties.length);
    }

    if (extractedInquiry.phone && isInquiryQualified(extractedInquiry)) {
      qualified = true;

      let existingInquiry = null;
      try {
        const inquiries = await databases.listDocuments(
          DATABASE_ID,
          INQUIRIES_COLLECTION,
          [Query.equal('phone', extractedInquiry.phone)]
        );
        if (inquiries.documents.length > 0) {
          existingInquiry = inquiries.documents[0];
        }
      } catch (e) {
        console.error('❌ Failed to check existing inquiry:', e);
      }

      if (existingInquiry) {
        inquiry = await databases.updateDocument(
          DATABASE_ID,
          INQUIRIES_COLLECTION,
          existingInquiry.$id!,
          {
            ...extractedInquiry,
            qualification_status: 'qualified',
          }
        );
        currentLeadId = existingInquiry.$id!;
      } else {
        inquiry = await databases.createDocument(
          DATABASE_ID,
          INQUIRIES_COLLECTION,
          ID.unique(),
          {
            ...extractedInquiry,
            qualification_status: 'qualified',
            source_page: sourcePage || 'chat',
          }
        );
        currentLeadId = inquiry.$id!;
        console.log('🔔 New lead qualified!');
      }
    }

    return NextResponse.json({
      response: aiResponse,
      sessionId: currentSessionId,
      leadId: currentLeadId,
      qualified,
      inquiry,
      properties: matchedProperties,
    });

  } catch (error) {
    console.error('❌ Chat API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat',
        response: "I'm here to help! Could you share your name and phone number so I can assist you better?"
      },
      { status: 500 }
    );
  }
}