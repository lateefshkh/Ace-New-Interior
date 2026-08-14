import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(API_KEY);

const MODEL_NAME = 'gemini-3.5-flash-lite';

const SYSTEM_PROMPT = `
You are Ace, a friendly real estate agent having a natural conversation with a potential client.

**Conversation Rules:**
1. Be warm and natural, like talking to a friend
2. NEVER repeat the same question or the same message you already sent
3. Keep responses to 1-2 sentences
4. Ask ONE question at a time
5. Build on what they've told you — acknowledge their last answer specifically before moving on
6. If a field is already marked ✅ below, do NOT ask about it again

**Your Goal:**
Have a natural conversation to understand what they're looking for.

**What you need to learn (in this order):**
1. Are they buying, renting, or exploring?
2. What type of property? (2BHK, 3BHK, Villa, etc.)
3. What location/area?
4. What budget?
5. Their name and phone number

**IMPORTANT: If they resist giving info, back off and be helpful.**
`;

export async function getAIResponse(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  console.log('🤖 Generating AI response...');
  console.log('📝 User message:', userMessage);
  console.log('📚 History length:', conversationHistory.length);

  const userMsg = userMessage.toLowerCase().trim();

  // Use the same extraction logic everywhere so "what do we know" is consistent
  const known = extractInquiryData(conversationHistory);
  const hasIntent = !!known.intent && known.intent !== 'browse' ? true : /buy|rent|sell|exploring|browsing|looking/i.test(
    conversationHistory.map(m => m.content).join(' ')
  );
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

  // --- Quick deterministic replies for simple inputs ---

  if (userMsg === 'ok' || userMsg === 'okay' || userMsg === 'sure') {
    if (!hasIntent) return "Great! Are you looking to buy, rent, or just exploring what's out there?";
    if (!hasPropertyType) return "What kind of property are you interested in? Apartment, villa, or something else?";
    if (!hasLocation) return "Which areas are you most interested in?";
    if (!hasBudget) return "What's your budget range? That'll help me find the best options for you.";
  }

  if (userMsg === 'why' || userMsg === 'why?') {
    return "I just want to make sure I find the perfect properties for you! 😊 If you're not comfortable sharing yet, that's totally fine. Just let me know what kind of properties you're curious about.";
  }
  if (userMsg === 'no' || userMsg === 'not now') {
    return "No problem at all! 🏠 Take your time exploring. Feel free to ask me anything about properties, neighborhoods, or the market. What would you like to know?";
  }

  if (userMsg === 'hi' || userMsg === 'hello' || userMsg === 'hey' || userMsg === '') {
    return "Hi there! 👋 I'm Ace, your local real estate expert. What brings you here today? Looking to buy, rent, or just exploring?";
  }

  // --- Try Gemini for natural, context-aware responses ---
  try {
    console.log('🚀 Calling Gemini API...');

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
    prompt += `Do not repeat your last message. Acknowledge what the client just said, then ask about the next ❌ item above (or if all are ✅, ask about specific features/preferences).\n\n`;
    prompt += `**Your response (warm, natural, ONE question max):**\n`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const cleanResponse = response
      .replace(/^Ace:/, '')
      .replace(/^Agent:/, '')
      .replace(/^Client:/, '')
      .trim();

    if (cleanResponse && !isRepeat(cleanResponse)) {
      console.log('✅ AI responded:', cleanResponse);
      return cleanResponse;
    }

    console.log('⚠️ Gemini repeated itself, falling back to deterministic reply');
    throw new Error('Repeat detected');

  } catch (error: any) {
    console.error('❌ Gemini API Error or repeat:', error.message);

    // --- Deterministic fallback based on what we know ---
    if (!hasIntent) return "Hi! 👋 Are you looking to buy, rent, or just exploring the market?";
    if (!hasPropertyType) return "What kind of property are you thinking about - apartment, villa, or something else?";
    if (!hasLocation) return "Which areas are you most interested in? I know some great properties!";
    if (!hasBudget) return "What's your budget range? That'll help me find the perfect options!";
    if (!hasName) return "By the way, what's your name? I'd love to personalize these suggestions!";
    if (!hasPhone) return "What's the best number to reach you on? I'd like to share some exclusive details!";
    return "Perfect, I have everything I need! Our agent will reach out shortly with matching options. Anything specific you'd like — balconies, floor preference, amenities?";
  }
}

export function extractInquiryData(messages: Array<{ role: string; content: string }>) {
  const inquiry: any = {};
  const fullText = messages.map(m => m.content).join(' ');
  const lowerText = fullText.toLowerCase();

  // --- Phone: strip all non-digits, find a 10-13 digit run, keep last 10 ---
  const digitsOnly = fullText.replace(/\D/g, '');
  const phoneRun = digitsOnly.match(/\d{10,13}/);
  if (phoneRun) {
    inquiry.phone = phoneRun[0].slice(-10);
  }

  // --- Email ---
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) inquiry.email = emailMatch[0];

  // --- Context-aware slot filling: look at what was asked right before each user reply ---
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

  // --- Intent ---
  if (/\bbuy\b|\bpurchase\b/.test(lowerText)) inquiry.intent = 'buy';
  else if (/\brent\b|\brental\b/.test(lowerText)) inquiry.intent = 'rent';
  else if (/\bsell\b/.test(lowerText)) inquiry.intent = 'sell';
  else inquiry.intent = 'browse';

  // --- Budget: handles "2crore", "2 crore", "50 lakhs", "1.5cr" ---
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

  // --- Property type ---
  if (/2\s*bhk/.test(lowerText)) inquiry.property_type_preference = '2BHK';
  else if (/3\s*bhk/.test(lowerText)) inquiry.property_type_preference = '3BHK';
  else if (/villa/.test(lowerText)) inquiry.property_type_preference = 'Villa';
  else if (/\bflat\b|\bapartment\b/.test(lowerText)) inquiry.property_type_preference = 'Apartment';
  else if (/\bplot\b/.test(lowerText)) inquiry.property_type_preference = 'Plot';

  return inquiry;
}

export function isInquiryQualified(inquiry: any): boolean {
  // Phone is the hard requirement — everything else is a bonus for lead quality
  return !!inquiry.phone;
}