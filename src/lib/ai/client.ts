import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const SYSTEM_PROMPT = `
You are Ace, a consultant at Ace New Interior — an architectural interior design studio serving Mangalore, Udupi, Bangalore, and Goa.

You help clients with:
- Interior design consultations (residential and commercial)
- Property search (buy or rent) in the regions above
- Turnkey design for properties they are purchasing

**Conversation Rules:**
1. Be warm and professional, not salesy
2. NEVER repeat the same question or message you already sent
3. Keep responses to 1-2 sentences
4. Ask ONE question at a time
5. Build on what they've told you — acknowledge their last answer before moving on
6. If a field is already marked ✅ below, do NOT ask about it again

**What you need to learn (in this order):**
1. Are they looking for interior design, a property, or both?
2. If property: buy, rent, or exploring?
3. Property type (2BHK, 3BHK, Villa, etc.) and preferred area
4. Budget range (in lakhs or crore)
5. Their name and phone number

**If they resist giving info, back off and offer general help about design or the local market.**
`;

export async function getAIResponse(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  const userMsg = userMessage.toLowerCase().trim();
  const known = extractInquiryData(conversationHistory);
  const hasIntent = !!known.intent && known.intent !== 'browse';
  const hasPropertyType = !!known.property_type_preference;
  const hasLocation = !!known.location_preference;
  const hasBudget = !!known.budget_min;
  const hasName = !!known.name;
  const hasPhone = !!known.phone;

  const lastAssistantMsg = [...conversationHistory].reverse().find(m => m.role === 'assistant')?.content || '';

  const isRepeat = (candidate: string) => {
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
    return lastAssistantMsg && norm(candidate) === norm(lastAssistantMsg);
  };

  if (userMsg === 'ok' || userMsg === 'okay' || userMsg === 'sure') {
    if (!hasIntent) return "Great! Are you looking for interior design, a property, or both?";
    if (!hasPropertyType) return "What kind of space are you thinking — apartment, villa, or a commercial project?";
    if (!hasLocation) return "Which area works best — Mangalore, Udupi, Bangalore, or Goa?";
    if (!hasBudget) return "What's your budget range? That helps me suggest the right options.";
  }

  if (userMsg === 'why' || userMsg === 'why?') {
    return "I want to match you with the right design approach or properties. If you'd rather browse first, tell me what caught your eye on the site.";
  }
  if (userMsg === 'no' || userMsg === 'not now') {
    return "No problem. Feel free to ask about our design process, past projects, or property listings whenever you're ready.";
  }

  if (userMsg === 'hi' || userMsg === 'hello' || userMsg === 'hey' || userMsg === '') {
    return "Hi! I'm Ace from Ace New Interior. Are you looking for interior design help, a property, or both?";
  }

  if (!API_KEY) {
    if (!hasIntent) return "Hi! Are you interested in interior design, property search, or both?";
    if (!hasPhone) return "What's the best number to reach you? Our team will follow up shortly.";
    return "Thanks — our team will be in touch soon. Anything else you'd like to know about our work?";
  }

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 500,
      },
    });

    let prompt = SYSTEM_PROMPT + '\n\n';
    prompt += `**What we already know (do NOT ask about these again):**\n`;
    prompt += `- Intent: ${hasIntent ? '✅ ' + known.intent : '❌'}\n`;
    prompt += `- Property Type: ${hasPropertyType ? '✅ ' + known.property_type_preference : '❌'}\n`;
    prompt += `- Location: ${hasLocation ? '✅ ' + known.location_preference : '❌'}\n`;
    prompt += `- Budget: ${hasBudget ? '✅ ' + known.budget_min + ' lakhs' : '❌'}\n`;
    prompt += `- Name: ${hasName ? '✅ ' + known.name : '❌'}\n`;
    prompt += `- Phone: ${hasPhone ? '✅ (have it)' : '❌'}\n\n`;

    prompt += `**Conversation so far:**\n`;
    conversationHistory.slice(-8).forEach(m => {
      prompt += `${m.role === 'user' ? 'Client' : 'Ace'}: ${m.content}\n`;
    });

    prompt += `\n**Client just said:** "${userMessage}"\n\n`;
    prompt += `**Your last message was:** "${lastAssistantMsg}"\n`;
    prompt += `Do not repeat your last message. Acknowledge what the client just said, then ask about the next ❌ item above.\n\n`;
    prompt += `**Your response (warm, natural, ONE question max):**\n`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const cleanResponse = response
      .replace(/^Ace:/, '')
      .replace(/^Agent:/, '')
      .replace(/^Client:/, '')
      .trim();

    if (cleanResponse && !isRepeat(cleanResponse)) {
      return cleanResponse;
    }

    throw new Error('Repeat detected');
  } catch {
    if (!hasIntent) return "Are you looking for interior design, a property, or both?";
    if (!hasPropertyType) return "What kind of space — apartment, villa, or commercial?";
    if (!hasLocation) return "Which area — Mangalore, Udupi, Bangalore, or Goa?";
    if (!hasBudget) return "What's your budget range in lakhs or crore?";
    if (!hasName) return "What's your name?";
    if (!hasPhone) return "What's the best number to reach you on?";
    return "Perfect — our team will follow up with matching options. Any specific preferences on layout or style?";
  }
}

export interface InquiryData {
  name?: string;
  phone?: string;
  email?: string;
  intent?: string;
  location_preference?: string;
  property_type_preference?: string;
  budget_min?: number;
  budget_max?: number;
}

export function extractInquiryData(messages: Array<{ role: string; content: string }>): InquiryData {
  const inquiry: InquiryData = {};
  const fullText = messages.map(m => m.content).join(' ');
  const lowerText = fullText.toLowerCase();

  const digitsOnly = fullText.replace(/\D/g, '');
  const phoneRun = digitsOnly.match(/\d{10,13}/);
  if (phoneRun) {
    inquiry.phone = phoneRun[0].slice(-10);
  }

  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) inquiry.email = emailMatch[0];

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (m.role !== 'user') continue;
    const prev = messages[i - 1];
    const prevWasAssistant = prev && prev.role === 'assistant';
    const askedName = prevWasAssistant && /name/i.test(prev.content);
    const askedLocation = prevWasAssistant && /(area|location|where)/i.test(prev.content);
    const trimmed = m.content.trim();
    const looksLikePlainText = /^[a-zA-Z\s]{2,40}$/.test(trimmed);

    if (!inquiry.name) {
      const nameMatch = trimmed.match(/(?:my name is|i am|i'm|call me|this is)\s+([a-zA-Z]+(?:\s[a-zA-Z]+)?)/i);
      if (nameMatch) {
        inquiry.name = nameMatch[1].trim();
      } else if (askedName && looksLikePlainText) {
        inquiry.name = trimmed;
      }
    }

    if (!inquiry.location_preference) {
      const locMatch = trimmed.match(/\b(?:in|near|around|at)\s+([a-zA-Z\s]+)/i);
      if (locMatch) {
        inquiry.location_preference = locMatch[1].trim();
      } else if (askedLocation && looksLikePlainText) {
        inquiry.location_preference = trimmed;
      }
    }
  }

  if (/\binterior\b|\bdesign\b|\brenovat/.test(lowerText)) inquiry.intent = 'design';
  else if (/\bbuy\b|\bpurchase\b/.test(lowerText)) inquiry.intent = 'buy';
  else if (/\brent\b|\brental\b/.test(lowerText)) inquiry.intent = 'rent';
  else if (/\bsell\b/.test(lowerText)) inquiry.intent = 'sell';
  else inquiry.intent = 'browse';

  const budgetMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(lakhs?|lac|crores?|cr)\b/i);
  if (budgetMatch) {
    const amount = parseFloat(budgetMatch[1]);
    const unit = budgetMatch[2].toLowerCase();
    if (unit.startsWith('cr')) {
      inquiry.budget_min = Math.round(amount * 100);
      inquiry.budget_max = Math.round(amount * 100);
    } else {
      inquiry.budget_min = Math.round(amount);
      inquiry.budget_max = Math.round(amount);
    }
  }

  if (/2\s*bhk/.test(lowerText)) inquiry.property_type_preference = '2BHK';
  else if (/3\s*bhk/.test(lowerText)) inquiry.property_type_preference = '3BHK';
  else if (/villa/.test(lowerText)) inquiry.property_type_preference = 'Villa';
  else if (/\bflat\b|\bapartment\b/.test(lowerText)) inquiry.property_type_preference = 'Apartment';
  else if (/\bplot\b/.test(lowerText)) inquiry.property_type_preference = 'Plot';

  return inquiry;
}

export function isInquiryQualified(inquiry: InquiryData): boolean {
  return !!inquiry.phone;
}
