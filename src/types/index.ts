export interface Inquiry {
  $id?: string;
  name?: string;
  phone: string;
  email?: string;
  intent?: 'buy' | 'rent' | 'sell' | 'browse';
  property_type_preference?: string;
  budget_min?: number;
  budget_max?: number;
  location_preference?: string;
  timeline?: 'immediate' | '1-3-months' | 'exploring';
  qualification_status?: 'new' | 'qualified' | 'contacted' | 'converted' | 'dead';
  conversation_summary?: string;
  source_page?: string;
  created_at?: string;
}

export interface Property {
  $id?: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  city?: string;
  state?: string;
  property_type?: 'apartment' | 'villa' | 'plot' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  status?: 'available' | 'sold' | 'rented';
  images?: string[];
  latitude?: number;
  longitude?: number;
}

export interface ConversationMessage {
  $id?: string;
  lead_id: string;
  role: 'user' | 'assistant';
  message: string;
  session_id: string;
  created_at?: string;
}

export interface Booking {
  $id?: string;
  lead_id: string;
  property_id?: string;
  preferred_date: string;
  preferred_time?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}