import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/appwrite/server';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const INQUIRIES_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_INQUIRIES_COLLECTION!;

export async function GET() {
  try {
    console.log('📊 Fetching inquiries...');
    
    // Use server client with API key
    const { databases } = createServerClient();
    
    // Get all documents (no queries)
    const response = await databases.listDocuments(
      DATABASE_ID,
      INQUIRIES_COLLECTION
    );
    
    console.log('✅ Found:', response.documents.length, 'documents');
    
    return NextResponse.json({
      success: true,
      documents: response.documents,
      total: response.documents.length,
    });
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    return NextResponse.json(
      { 
        error: error.message,
        documents: [],
        total: 0
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const { databases } = createServerClient();

    const inquiry = await databases.createDocument(
      DATABASE_ID,
      INQUIRIES_COLLECTION,
      'unique()',
      {
        name,
        email,
        phone: phone || '',
        conversation_summary: message || '',
        intent: 'browse',
        qualification_status: 'new',
        source_page: 'inquiry_form',
      }
    );

    console.log('✅ Inquiry created:', inquiry.$id);

    return NextResponse.json({
      success: true,
      inquiry,
      message: 'Inquiry submitted successfully!',
    });

  } catch (error: any) {
    console.error('❌ Inquiry API Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
