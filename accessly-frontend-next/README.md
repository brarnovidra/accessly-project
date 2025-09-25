# Membership Frontend (Next.js + TypeScript + Tailwind)

This frontend is a separate Next.js application that consumes your existing backend API.
- Expects API base URL in `NEXT_PUBLIC_API_BASE` env variable (e.g. http://localhost:3000/api)
- Uses short-lived access token + refresh token flow.

Quick start:
1. copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE`
2. npm install
3. npm run dev (runs on port 3001)

Files:
- app/ -> Next.js app routes (login, register, dashboard)
- services/ -> api and auth services (handle refresh token)
