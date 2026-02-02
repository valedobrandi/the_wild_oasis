# The Wild Oasis Website

A Next.js application for managing a hotel. This project uses Next.js App Router, Supabase for data, NextAuth for authentication, and Tailwind CSS for styling.

## Key features

- Cabin listing and detail pages
- Reservation creation, update and deletion flows
- Authentication via Google (NextAuth)
- Supabase client for database and API calls
- Calendar/date picker UI using `react-day-picker`

## Tech stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Supabase (via `@supabase/supabase-js`)
- NextAuth (Google provider)
- TypeScript

## Getting started

Prerequisites

- Node.js 18 or newer
- npm (or yarn / pnpm)

1) Install dependencies

```bash
npm install
```

2) Create a local `.env` file in the project root (see required variables below).

3) Run the development server

```bash
npm run dev
# open http://localhost:3000
```

Available npm scripts (from `package.json`)

- `dev` — start Next.js in development mode
- `build` — build the app for production
- `start` — run the production server
- `lint` — run ESLint

## Environment variables

Create a `.env` file in the project root and set these variables (names used in the codebase):

- `SUPERBASE_URL` — your Supabase project URL
- `SUPERBASE_KEY` — your Supabase anon/service key
- `AUTH_GOOGLE_CLIENT_ID` — Google OAuth client ID used by NextAuth
- `AUTH_GOOGLE_SECRET` — Google OAuth client secret

Notes

- Keep secret keys out of source control. Use your provider's secret management for production (Vercel, Netlify, etc.).

## How authentication works

This project uses NextAuth with the Google provider. The auth configuration references `AUTH_GOOGLE_CLIENT_ID` and `AUTH_GOOGLE_SECRET`. Protected pages check for an authenticated session before showing reservation/account pages.

## Project structure (important files)

- `app/` — Next.js App Router pages and layout
	- `app/_components/` — shared React components (Header, CabinCard, ReservationForm, etc.)
	- `app/_lib/` — helpers and clients (Supabase client, auth helpers)
- `public/` — static assets
- `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs` — project config

## Deployment

Recommended: Vercel (native Next.js support). Add the environment variables to Vercel dashboard and deploy. The `build` and `start` scripts in `package.json` are compatible with standard Next.js deployments.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Open a pull request with a clear description of changes

If you add or change env variables, update this README accordingly.

## Troubleshooting

- If the app complains about missing env variables, double-check your `.env` or deployment provider settings.
- For TypeScript/ESLint errors, run `npm run lint` and address reported issues.

## License & contact

This project doesn't include a license file — add one if you plan to publish or share the code. For questions, open an issue in the repository or contact the maintainer.

---

## Using the Supabase GraphQL API (gql helper)

This project includes a small GraphQL helper, `gql`, located at `app/_lib/superbase.tsx`. The helper posts GraphQL queries and mutations directly to your Supabase GraphQL endpoint (the value of `SUPERBASE_URL`) and returns `data` from the GraphQL response. It is used throughout the codebase (for example `app/_lib/apiCabins.tsx`) to fetch cabins, bookings, guests and to run mutations such as creating/updating bookings.

How it works (summary)

- The helper sends a POST request to `SUPERBASE_URL` with headers:
	- `Content-Type: application/json`
	- `apikey: <SUPERBASE_KEY>`
	- `Authorization: Bearer <SUPERBASE_KEY>`
- The helper parses the JSON response, logs and throws when GraphQL `errors` are present, and returns `json.data` when successful.

Basic query example

```ts
import { gql } from './app/_lib/superbase';

const data = await gql<{
	cabinsCollection: { edges: { node: { id: string; name: string } }[] };
}>(`
	query {
		cabinsCollection {
			edges {
				node {
					id
					name
				}
			}
		}
	}
`);

console.log(data.cabinsCollection);
```

Using variables and mutations

The helper accepts an optional `variables` object. Example mutation (see `createBooking` in `app/_lib/apiCabins.tsx` for a real example):

```ts
const result = await gql(`
	mutation CreateBooking($booking: bookings_insert_input!) {
		insert_bookings_one(object: $booking) { id startDate endDate status }
	}
`, { booking: newBooking });

// `result` will contain the `data` field returned by GraphQL
```

TypeScript helpers

- The `gql` helper is generic, so you can annotate the return shape to get typed responses in your code (see examples above).

Security notes and best practices

- Do NOT expose service keys on the client. The code in `app/_lib/superbase.tsx` reads `SUPERBASE_KEY` from environment variables; make sure you use server-only environment variables for service/admin keys and keep them out of client bundles.
- Prefer using Supabase's anon key for client-side operations with restricted row-level security (RLS) policies, and use a server-side key for admin operations performed from server components or API routes.
- Rotate Supabase/Google keys immediately if they were accidentally committed to a public repo.

When to use the Supabase client vs GraphQL

- The project exports a Supabase client (via `createClient`) for convenience (`supabase`) — use it when you prefer the JavaScript API (REST/PostgREST) for simple inserts/updates/selects. Use the GraphQL `gql` helper when you want to run GraphQL queries or reuse complex GraphQL queries that join related tables.

