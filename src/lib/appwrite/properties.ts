import { databases, Query } from '@/lib/appwrite/client';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PROPERTIES_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_COLLECTION!;

export interface MatchedProperty {
  $id: string;
  title: string;
  price: number;
  location: string;
  city?: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  images?: string[];
}

interface MatchFilters {
  location?: string;
  propertyType?: string; // e.g. "2BHK", "Villa", "Apartment"
  budgetMaxLakhs?: number; // budget in lakhs, e.g. 200 for 2 crore
  excludeIds?: string[]; // properties already shown to this user
}

function parseImages(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [raw];
  } catch {
    return [raw];
  }
}

export async function findMatchingProperties(filters: MatchFilters): Promise<MatchedProperty[]> {
  try {
    const queries = [Query.equal('status', 'available'), Query.orderDesc('$createdAt'), Query.limit(20)];

    if (filters.budgetMaxLakhs) {
      // 15% buffer so we don't exclude close matches
      const maxRupees = Math.round(filters.budgetMaxLakhs * 100000 * 1.15);
      queries.push(Query.lessThanEqual('price', maxRupees));
    }

    const res = await databases.listDocuments(DATABASE_ID, PROPERTIES_COLLECTION, queries);
    let docs = res.documents;

    if (filters.excludeIds && filters.excludeIds.length > 0) {
      const exclude = new Set(filters.excludeIds);
      docs = docs.filter((d: any) => !exclude.has(d.$id));
    }

    // Client-side filtering (case-insensitive, tolerant of data entry variance)
    if (filters.propertyType) {
      const pt = filters.propertyType.toLowerCase().replace('bhk', '').trim();
      const typeFiltered = docs.filter((d: any) => {
        const dType = (d.property_type || '').toLowerCase();
        return dType.includes(pt) || pt.includes(dType) || dType === filters.propertyType?.toLowerCase();
      });
      if (typeFiltered.length > 0) docs = typeFiltered;
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      const locFiltered = docs.filter((d: any) => {
        return (d.location || '').toLowerCase().includes(loc) || (d.city || '').toLowerCase().includes(loc);
      });
      if (locFiltered.length > 0) docs = locFiltered;
    }

    return docs.slice(0, 3).map((d: any) => ({
      $id: d.$id,
      title: d.title,
      price: d.price,
      location: d.location,
      city: d.city,
      property_type: d.property_type,
      bedrooms: d.bedrooms,
      bathrooms: d.bathrooms,
      area_sqft: d.area_sqft,
      images: parseImages(d.images),
    }));
  } catch (error) {
    console.error('❌ Property matching failed:', error);
    return [];
  }
}