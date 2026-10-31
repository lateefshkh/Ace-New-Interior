# Ace New Interior

Website for **Ace New Interior** — an architectural interior design studio serving Mangalore, Udupi, Bangalore, and Goa. Includes property listings, an AI chat assistant for lead capture, and an admin portal for managing inquiries and inventory.

## Features

- Marketing site (home, about, philosophy, services, process, projects)
- Property listings with search and filters
- AI chat widget (Google Gemini) for design and property inquiries
- Admin portal for inquiries dashboard and property management
- Appwrite backend for data and file storage

## Setup

1. Copy environment variables:

```sh
cp .env.example .env.local
```

2. Fill in Appwrite, Gemini, and dashboard credentials in `.env.local`.

3. Bootstrap Appwrite collections and storage:

```sh
npm run setup:appwrite
```

4. Start the dev server:

```sh
npm i
npm run dev
```

## Environment Variables

See `.env.example` for the full list. Required:

- `NEXT_PUBLIC_APPWRITE_*` — Appwrite project and collection IDs
- `APPWRITE_API_KEY` — Server-side Appwrite API key
- `GEMINI_API_KEY` — Google Gemini API key (optional; chat falls back to rule-based replies)
- `DASHBOARD_PASSWORD` — Password for `/account`, `/dashboard`, and property admin writes

## Admin Access

1. Go to `/account` and sign in with `DASHBOARD_PASSWORD`
2. Open the **Client Inquiries Dashboard** or **Property Admin Manager**

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run setup:appwrite` | Create Appwrite database, collections, and storage |
