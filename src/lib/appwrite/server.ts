// This file is for server-side usage only
// Use 'node-appwrite' for server-side
import { Client, Databases, Storage } from 'node-appwrite';

export function createServerClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

  return {
    databases: new Databases(client),
    storage: new Storage(client),
  };
}
