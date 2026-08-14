// This file is for browser/client-side usage
import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

// Note: Use 'appwrite' (not 'node-appwrite') for client-side
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };

export default client;