// @ts-nocheck
import { Client, Databases, Storage, Permission, Role } from 'node-appwrite';

// Configuration
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';

// Collection names - USING INQUIRIES INSTEAD OF LEADS
const COLLECTIONS = {
  INQUIRIES: 'inquiries',  // ← Changed from 'leads'
  PROPERTIES: 'properties',
  CONVERSATIONS: 'conversations',
  BOOKINGS: 'bookings',
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function setupAppwrite() {
  console.log('🚀 Starting Appwrite Setup...\n');

  if (!APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    console.error('❌ Missing environment variables!');
    console.log('Please set in .env.local:');
    console.log('  NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id');
    console.log('  APPWRITE_API_KEY=your-api-key');
    process.exit(1);
  }

  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  const databases = new Databases(client);
  const storage = new Storage(client);

  const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ace-real-estate';

  // ============================================================
  // ENSURE DATABASE EXISTS
  // ============================================================
  console.log('🗄️  Checking database...');
  try {
    await databases.get({ databaseId: DATABASE_ID });
    console.log('⚠️  Database already exists, skipping...');
  } catch {
    await databases.create({ databaseId: DATABASE_ID, name: 'ACE Real Estate' });
    console.log(`✅ Database created: ${DATABASE_ID}`);
  }

  // ============================================================
  // COLLECTION 1: INQUIRIES (instead of LEADS)
  // ============================================================
  console.log('\n📋 Creating INQUIRIES collection...');
  try {
    try {
      await databases.getCollection({ databaseId: DATABASE_ID, collectionId: COLLECTIONS.INQUIRIES });
      console.log('⚠️  INQUIRIES collection already exists, skipping...');
    } catch {
      const inquiriesCollection = await databases.createCollection({
        databaseId: DATABASE_ID,
        collectionId: COLLECTIONS.INQUIRIES,
        name: 'Inquiries Collection',
        permissions: [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
        ],
      });
      console.log(`✅ Collection created: ${inquiriesCollection.$id}`);

      console.log('  Adding attributes...');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'name', 
        size: 255, 
        required: false 
      });
      console.log('    ✅ name');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'phone', 
        size: 20, 
        required: true 
      });
      console.log('    ✅ phone');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'email', 
        size: 255, 
        required: false 
      });
      console.log('    ✅ email');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'intent', 
        size: 50, 
        required: false 
      });
      console.log('    ✅ intent');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'property_type_preference', 
        size: 100, 
        required: false 
      });
      console.log('    ✅ property_type_preference');

      await databases.createIntegerAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'budget_min', 
        required: false 
      });
      console.log('    ✅ budget_min');

      await databases.createIntegerAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'budget_max', 
        required: false 
      });
      console.log('    ✅ budget_max');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'location_preference', 
        size: 255, 
        required: false 
      });
      console.log('    ✅ location_preference');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'timeline', 
        size: 50, 
        required: false 
      });
      console.log('    ✅ timeline');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'qualification_status', 
        size: 50, 
        required: false, 
        xdefault: 'new' 
      });
      console.log('    ✅ qualification_status');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'conversation_summary', 
        size: 1000, 
        required: false 
      });
      console.log('    ✅ conversation_summary');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'source_page', 
        size: 255, 
        required: false 
      });
      console.log('    ✅ source_page');

      console.log('  Waiting for attributes to finish processing...');
      await sleep(3000);

      console.log('  Creating indexes...');

      await databases.createIndex({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'idx_phone', 
        type: 'key', 
        attributes: ['phone'], 
        orders: ['ASC'] 
      });
      console.log('    ✅ idx_phone');

      await databases.createIndex({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'idx_status', 
        type: 'key', 
        attributes: ['qualification_status'], 
        orders: ['ASC'] 
      });
      console.log('    ✅ idx_status');

      await databases.createIndex({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.INQUIRIES, 
        key: 'idx_created_at', 
        type: 'key', 
        attributes: ['$createdAt'], 
        orders: ['DESC'] 
      });
      console.log('    ✅ idx_created_at');

      console.log('✅ INQUIRIES collection setup complete!');
    }
  } catch (error: any) {
    console.error('❌ Failed to setup INQUIRIES collection:', error.message);
  }

  // ============================================================
  // COLLECTION 2: PROPERTIES
  // ============================================================
  console.log('\n📋 Creating PROPERTIES collection...');
  try {
    try {
      await databases.getCollection({ databaseId: DATABASE_ID, collectionId: COLLECTIONS.PROPERTIES });
      console.log('⚠️  PROPERTIES collection already exists, skipping...');
    } catch {
      const propertiesCollection = await databases.createCollection({
        databaseId: DATABASE_ID,
        collectionId: COLLECTIONS.PROPERTIES,
        name: 'Properties Collection',
        permissions: [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
        ],
      });
      console.log(`✅ Collection created: ${propertiesCollection.$id}`);

      console.log('  Adding attributes...');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'title', 
        size: 255, 
        required: true 
      });
      console.log('    ✅ title');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'description', 
        size: 2000, 
        required: false 
      });
      console.log('    ✅ description');

      await databases.createIntegerAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'price', 
        required: true 
      });
      console.log('    ✅ price');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'location', 
        size: 255, 
        required: true 
      });
      console.log('    ✅ location');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'city', 
        size: 100, 
        required: false 
      });
      console.log('    ✅ city');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'state', 
        size: 100, 
        required: false 
      });
      console.log('    ✅ state');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'property_type', 
        size: 50, 
        required: false 
      });
      console.log('    ✅ property_type');

      await databases.createIntegerAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'bedrooms', 
        required: false 
      });
      console.log('    ✅ bedrooms');

      await databases.createIntegerAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'bathrooms', 
        required: false 
      });
      console.log('    ✅ bathrooms');

      await databases.createIntegerAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'area_sqft', 
        required: false 
      });
      console.log('    ✅ area_sqft');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'status', 
        size: 50, 
        required: false, 
        xdefault: 'available' 
      });
      console.log('    ✅ status');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'images', 
        size: 1000, 
        required: false 
      });
      console.log('    ✅ images');

      await databases.createFloatAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'latitude', 
        required: false 
      });
      console.log('    ✅ latitude');

      await databases.createFloatAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'longitude', 
        required: false 
      });
      console.log('    ✅ longitude');

      console.log('  Waiting for attributes to finish processing...');
      await sleep(3000);

      console.log('  Creating indexes...');

      await databases.createIndex({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'idx_status', 
        type: 'key', 
        attributes: ['status'], 
        orders: ['ASC'] 
      });
      console.log('    ✅ idx_status');

      await databases.createIndex({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'idx_city', 
        type: 'key', 
        attributes: ['city'], 
        orders: ['ASC'] 
      });
      console.log('    ✅ idx_city');

      await databases.createIndex({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.PROPERTIES, 
        key: 'idx_type', 
        type: 'key', 
        attributes: ['property_type'], 
        orders: ['ASC'] 
      });
      console.log('    ✅ idx_type');

      console.log('✅ PROPERTIES collection setup complete!');
    }
  } catch (error: any) {
    console.error('❌ Failed to setup PROPERTIES collection:', error.message);
  }

  // ============================================================
  // COLLECTION 3: CONVERSATIONS
  // ============================================================
  console.log('\n📋 Creating CONVERSATIONS collection...');
  try {
    try {
      await databases.getCollection({ databaseId: DATABASE_ID, collectionId: COLLECTIONS.CONVERSATIONS });
      console.log('⚠️  CONVERSATIONS collection already exists, skipping...');
    } catch {
      const conversationsCollection = await databases.createCollection({
        databaseId: DATABASE_ID,
        collectionId: COLLECTIONS.CONVERSATIONS,
        name: 'Conversations Collection',
        permissions: [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
        ],
      });
      console.log(`✅ Collection created: ${conversationsCollection.$id}`);

      console.log('  Adding attributes...');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.CONVERSATIONS, 
        key: 'lead_id', 
        size: 255, 
        required: true 
      });
      console.log('    ✅ lead_id');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.CONVERSATIONS, 
        key: 'session_id', 
        size: 255, 
        required: true 
      });
      console.log('    ✅ session_id');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.CONVERSATIONS, 
        key: 'role', 
        size: 50, 
        required: true 
      });
      console.log('    ✅ role');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.CONVERSATIONS, 
        key: 'message', 
        size: 2000, 
        required: true 
      });
      console.log('    ✅ message');

      console.log('  Waiting for attributes to finish processing...');
      await sleep(3000);

      console.log('  Creating indexes...');

      await databases.createIndex({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.CONVERSATIONS, 
        key: 'idx_lead_id', 
        type: 'key', 
        attributes: ['lead_id'], 
        orders: ['ASC'] 
      });
      console.log('    ✅ idx_lead_id');

      await databases.createIndex({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.CONVERSATIONS, 
        key: 'idx_session_id', 
        type: 'key', 
        attributes: ['session_id'], 
        orders: ['ASC'] 
      });
      console.log('    ✅ idx_session_id');

      await databases.createIndex({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.CONVERSATIONS, 
        key: 'idx_created_at', 
        type: 'key', 
        attributes: ['$createdAt'], 
        orders: ['DESC'] 
      });
      console.log('    ✅ idx_created_at');

      console.log('✅ CONVERSATIONS collection setup complete!');
    }
  } catch (error: any) {
    console.error('❌ Failed to setup CONVERSATIONS collection:', error.message);
  }

  // ============================================================
  // COLLECTION 4: BOOKINGS
  // ============================================================
  console.log('\n📋 Creating BOOKINGS collection...');
  try {
    try {
      await databases.getCollection({ databaseId: DATABASE_ID, collectionId: COLLECTIONS.BOOKINGS });
      console.log('⚠️  BOOKINGS collection already exists, skipping...');
    } catch {
      const bookingsCollection = await databases.createCollection({
        databaseId: DATABASE_ID,
        collectionId: COLLECTIONS.BOOKINGS,
        name: 'Bookings Collection',
        permissions: [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
        ],
      });
      console.log(`✅ Collection created: ${bookingsCollection.$id}`);

      console.log('  Adding attributes...');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.BOOKINGS, 
        key: 'lead_id', 
        size: 255, 
        required: true 
      });
      console.log('    ✅ lead_id');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.BOOKINGS, 
        key: 'property_id', 
        size: 255, 
        required: false 
      });
      console.log('    ✅ property_id');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.BOOKINGS, 
        key: 'preferred_date', 
        size: 50, 
        required: true 
      });
      console.log('    ✅ preferred_date');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.BOOKINGS, 
        key: 'preferred_time', 
        size: 50, 
        required: false 
      });
      console.log('    ✅ preferred_time');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.BOOKINGS, 
        key: 'status', 
        size: 50, 
        required: false, 
        xdefault: 'pending' 
      });
      console.log('    ✅ status');

      await databases.createStringAttribute({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.BOOKINGS, 
        key: 'notes', 
        size: 1000, 
        required: false 
      });
      console.log('    ✅ notes');

      console.log('  Waiting for attributes to finish processing...');
      await sleep(3000);

      console.log('  Creating indexes...');

      await databases.createIndex({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.BOOKINGS, 
        key: 'idx_lead_id', 
        type: 'key', 
        attributes: ['lead_id'], 
        orders: ['ASC'] 
      });
      console.log('    ✅ idx_lead_id');

      await databases.createIndex({ 
        databaseId: DATABASE_ID, 
        collectionId: COLLECTIONS.BOOKINGS, 
        key: 'idx_status', 
        type: 'key', 
        attributes: ['status'], 
        orders: ['ASC'] 
      });
      console.log('    ✅ idx_status');

      console.log('✅ BOOKINGS collection setup complete!');
    }
  } catch (error: any) {
    console.error('❌ Failed to setup BOOKINGS collection:', error.message);
  }

  // ============================================================
  // STORAGE BUCKET: Property Images
  // ============================================================
  console.log('\n📁 Creating storage bucket for property images...');
  try {
    try {
      await storage.getBucket({ bucketId: 'images' });
      console.log('⚠️  Storage bucket already exists, skipping...');
    } catch {
      const bucket = await storage.createBucket({
        bucketId: 'images',
        name: 'Property Images',
        permissions: [Permission.read(Role.any()), Permission.write(Role.any())],
        fileSecurity: true,
        enabled: true,
        maximumFileSize: 5 * 1024 * 1024,
        allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      });
      console.log(`✅ Storage bucket created: ${bucket.$id}`);
    }
  } catch (error: any) {
    console.error('❌ Failed to create storage bucket:', error.message);
  }

  console.log('\n🎉 Appwrite setup complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Copy these to your .env.local:');
  console.log(`   NEXT_PUBLIC_APPWRITE_DATABASE_ID="${DATABASE_ID}"`);
  console.log(`   NEXT_PUBLIC_APPWRITE_INQUIRIES_COLLECTION="${COLLECTIONS.INQUIRIES}"`);
  console.log(`   NEXT_PUBLIC_APPWRITE_PROPERTIES_COLLECTION="${COLLECTIONS.PROPERTIES}"`);
  console.log(`   NEXT_PUBLIC_APPWRITE_CONVERSATIONS_COLLECTION="${COLLECTIONS.CONVERSATIONS}"`);
  console.log(`   NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION="${COLLECTIONS.BOOKINGS}"`);
  console.log('\n2. Run your app: npm run dev');
}

setupAppwrite().catch(console.error);