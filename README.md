# nestFind

A full-stack real estate listing platform. Users browse and post property listings, message sellers in real time, and get their listings verified by a moderation team before they go live.

## Tech stack

**Frontend** (`nest-find/`) — Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Base UI, Socket.IO client, Leaflet (maps), GSAP/Motion (animation).

**Backend** (`Backend/`) — Node.js, Express 5, MongoDB/Mongoose, Socket.IO, JWT auth (httpOnly cookies), bcrypt, Cloudinary (image storage), Nodemailer (Gmail SMTP).

## Features

- **Auth** — registration with email verification, login/logout, password reset, JWT access + refresh tokens in httpOnly cookies, rate-limited auth endpoints.
- **Account settings** — in-app username, password, and email change (email change requires re-confirmation via a link sent to the new address).
- **Listings** — create/edit/browse listings with Cloudinary-hosted images, filtering by search/property type/price/currency, saved listings.
- **Listing verification** — sellers can submit a verification document; moderators review and approve/reject, surfaced as a "Verified" badge on listings.
- **Reports** — users can report a listing; moderators triage reports from a dedicated queue.
- **Real-time messaging** — Socket.IO-backed chat between buyers and sellers, per-conversation unread tracking, live unread badge in the navbar.
- **Roles** — user, moderator, and admin dashboards with role-specific views and route protection.

## Project structure

```
Backend/            Express API
  controllers/       route handlers
  routes/            route definitions
  models/            Mongoose schemas (user, listing, conversation, message, report)
  middleware/         auth (JWT verify) + rate limiting
  config/             Cloudinary/multer setup
  utils/               email templates + password validation
  server.js           app entry point (HTTP + Socket.IO server)

nest-find/           Next.js frontend
  app/                 route groups: (auth), (user), (admin), (moderator)
  components/          shared UI components
  context/             AuthContext (session + real-time unread state)
  lib/                  API client, feature-specific fetch helpers
```

## Getting started

### Prerequisites

- Node.js 20+
- A MongoDB database (e.g. MongoDB Atlas)
- A Cloudinary account (image uploads)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) (transactional email)

### 1. Backend

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
NODE_ENV=development

# JWT secrets - use long, random strings
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
EMAIL_VERIFICATION_SECRET=
PASSWORD_RESET_SECRET=

# Frontend origin (used for CORS + links in emails)
FRONTEND_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Gmail SMTP
GMAIL_USER=
GMAIL_APP_PASSWORD=
```

```bash
npm run dev
```

### 2. Frontend

```bash
cd nest-find
npm install
```

Create `nest-find/.env`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
ACCESS_TOKEN_SECRET=          # same value as the backend's, used to verify JWTs in Next.js middleware
```

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`, backend at `http://localhost:5000`.

## Deployment notes

- The backend must run on a **persistent-process host** (e.g. Render, Railway, Fly.io) rather than a serverless platform — Socket.IO needs a long-lived connection that serverless functions don't support.
- In production, set `NODE_ENV=production` so auth cookies are issued with `Secure` + `SameSite=None` (required for cross-site cookies once frontend and backend live on different domains).
- Restrict MongoDB Atlas network access to your hosting provider's IP range instead of allowing all traffic.
