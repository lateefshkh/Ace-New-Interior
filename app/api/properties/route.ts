import { NextRequest, NextResponse } from 'next/server';
import { databases, ID, storage } from '@/lib/appwrite/client';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PROPERTIES_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_COLLECTION!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

// GET: Fetch all properties
export async function GET() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PROPERTIES_COLLECTION
    );

    return NextResponse.json({
      success: true,
      properties: response.documents,
    });
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// Shared helper: parse a FormData payload (used by both POST and PUT)
async function parsePropertyFormData(request: NextRequest) {
  const formData = await request.formData();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priceRaw = formData.get('price') as string;
  const location = formData.get('location') as string;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const property_type = formData.get('property_type') as string;
  const bedroomsRaw = formData.get('bedrooms') as string;
  const bathroomsRaw = formData.get('bathrooms') as string;
  const areaRaw = formData.get('area_sqft') as string;
  const status = formData.get('status') as string;
  const image = formData.get('image') as File | null;
  const imageUrl = formData.get('imageUrl') as string;

  const propertyData: any = {};

  if (title) propertyData.title = title;
  if (description !== null && description !== undefined) propertyData.description = description;
  if (priceRaw) propertyData.price = parseInt(priceRaw);
  if (location) propertyData.location = location;
  if (city !== null && city !== undefined) propertyData.city = city;
  if (state !== null && state !== undefined) propertyData.state = state;
  if (property_type) propertyData.property_type = property_type;
  if (bedroomsRaw) propertyData.bedrooms = parseInt(bedroomsRaw) || 0;
  if (bathroomsRaw) propertyData.bathrooms = parseInt(bathroomsRaw) || 0;
  if (areaRaw) propertyData.area_sqft = parseInt(areaRaw) || 0;
  if (status) propertyData.status = status;

  // Handle image: new file upload takes priority, then explicit imageUrl
  if (image && image.size > 0) {
    try {
      const file = await storage.createFile(BUCKET_ID, ID.unique(), image);
      const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
      propertyData.images = fileUrl;
    } catch (storageError) {
      console.error('Storage upload error:', storageError);
      if (imageUrl) propertyData.images = imageUrl;
    }
  } else if (imageUrl) {
    propertyData.images = imageUrl;
  }

  return propertyData;
}

// POST: Create a new property
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let propertyData: any = {};

    if (contentType.includes('multipart/form-data')) {
      propertyData = await parsePropertyFormData(request);
      // Ensure defaults for a brand-new property
      propertyData.description = propertyData.description || '';
      propertyData.city = propertyData.city || '';
      propertyData.state = propertyData.state || '';
      propertyData.property_type = propertyData.property_type || 'Apartment';
      propertyData.bedrooms = propertyData.bedrooms || 0;
      propertyData.bathrooms = propertyData.bathrooms || 0;
      propertyData.area_sqft = propertyData.area_sqft || 0;
      propertyData.status = propertyData.status || 'available';
    } else {
      const body = await request.json();
      propertyData = {
        title: body.title,
        description: body.description || '',
        price: parseInt(body.price),
        location: body.location,
        city: body.city || '',
        state: body.state || '',
        property_type: body.property_type || 'Apartment',
        bedrooms: parseInt(body.bedrooms) || 0,
        bathrooms: parseInt(body.bathrooms) || 0,
        area_sqft: parseInt(body.area_sqft) || 0,
        status: body.status || 'available',
        images: body.imageUrl || '',
      };
    }

    if (!propertyData.title || !propertyData.location || !propertyData.price) {
      return NextResponse.json(
        { error: 'Title, location, and price are required' },
        { status: 400 }
      );
    }

    const property = await databases.createDocument(
      DATABASE_ID,
      PROPERTIES_COLLECTION,
      ID.unique(),
      propertyData
    );

    return NextResponse.json({
      success: true,
      property,
    });
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create property' },
      { status: 500 }
    );
  }
}

// PUT: Update a property — accepts FormData (multipart) since the admin form
// always submits FormData for both add and edit, or JSON as a fallback
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idFromQuery = searchParams.get('id');

    const contentType = request.headers.get('content-type') || '';
    let id = idFromQuery;
    let data: any = {};

    if (contentType.includes('multipart/form-data')) {
      data = await parsePropertyFormData(request);
    } else {
      const body = await request.json();
      id = id || body.id;
      const { id: _omit, ...rest } = body;
      data = rest;
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Remove empty/undefined values so we don't overwrite existing fields with blanks
    Object.keys(data).forEach(key => {
      if (data[key] === undefined || data[key] === null || data[key] === '') {
        delete data[key];
      }
    });

    const property = await databases.updateDocument(
      DATABASE_ID,
      PROPERTIES_COLLECTION,
      id,
      data
    );

    return NextResponse.json({
      success: true,
      property,
    });
  } catch (error: any) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update property' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a property
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    await databases.deleteDocument(
      DATABASE_ID,
      PROPERTIES_COLLECTION,
      id
    );

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete property' },
      { status: 500 }
    );
  }
}