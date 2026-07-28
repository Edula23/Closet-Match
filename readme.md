# ClosetMatch 👗👔

ClosetMatch is a full-stack wardrobe management app that helps you organize the clothes you own and put together outfits — either manually or with AI-powered suggestions.

## Features

- **Digital Closet** — Upload and organize your clothing items in one place
- **AI Outfit Matching** — Get outfit suggestions powered by Google Gemini based on the items in your closet
- **Manual Outfit Builder** — Mix and match your own pieces to create custom outfit combinations
- **Polaroid-Scatter Display** — Outfits are shown in a scattered, polaroid-style layout for a personal, tactile feel
- **Google Sign-In** — Quick and secure authentication via Google OAuth
- **Starter Closet** — New users get a seeded set of starter clothes and outfits to explore the app immediately

## Tech Stack

**Frontend**
- React + TypeScript
- Vite
- Deployed on Vercel

**Backend**
- Node.js + Express
- Prisma ORM
- Deployed on Render

**Database & Storage**
- Supabase (PostgreSQL)
- Clothing images stored as raw `Bytes` in Postgres, converted to base64 for AI processing

**AI**
- Google Gemini for AI-powered outfit matching

**Auth**
- Google OAuth (`useGoogleLogin`, `flow: "auth-code"`)
- JWT-based session management with cookie auth and token versioning

## Design

ClosetMatch uses a dark red (`#661218`) and gold (`#E8A33D`) color palette, paired with a scattered polaroid aesthetic for displaying outfits — designed to feel more like flipping through a personal lookbook than browsing a typical app grid.

## Project Structure

```
closetmatch/
├── frontend/     # React + TypeScript + Vite app
└── backend/      # Node.js + Express API
```

Each folder has its own `package.json` and is deployed independently (frontend on Vercel, backend on Render), with Vercel rewrites proxying `/api/*` requests to the Render backend.

## Getting Started

### Prerequisites
- Node.js
- A Supabase (PostgreSQL) project
- A Google Cloud project with OAuth credentials
- A Google Gemini API key

### Setup

1. Clone the repo
   ```bash
   git clone https://github.com/your-username/closetmatch.git
   cd closetmatch
   ```

2. Install dependencies in both folders
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Set up environment variables (see `.env.example` in each folder) — includes your Supabase database URL, Google OAuth client credentials, JWT secret, and Gemini API key

4. Run Prisma migrations
   ```bash
   cd backend
   npx prisma migrate dev
   ```

5. Start the dev servers
   ```bash
   # backend
   npm run dev

   # frontend (in a separate terminal)
   cd ../frontend
   npm run dev
   ```

## Roadmap

- [ ] Fix cross-site mobile upload issue on Android Chrome (cookie/`SameSite` handling)
- [ ] Expand AI suggestion logic
- [ ] Add outfit sharing/export

## License

MIT
