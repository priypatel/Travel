# Travel AI Platform — Project Checklist

> Complete task tracker divided by phase. Check off items as they are completed.

---

## Phase 1 — Foundation (Auth + Infrastructure)

### Backend — Project Setup

- [x] Monorepo root `package.json` with `concurrently` to run both apps
- [x] Express server skeleton (`src/index.js`, `src/app.js`)
- [x] MongoDB connection via Mongoose
- [x] `.env` with `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GEMINI_API_KEY`
- [x] Health check endpoint `GET /api/health`

### Backend — Error Handling Infrastructure

- [x] `AppError` utility class (statusCode, status, isOperational)
- [x] `asyncHandler` middleware (wraps async controllers, forwards errors)
- [x] `validate` middleware (Yup schema validation, `abortEarly: false`, `stripUnknown: true`)
- [x] Global `errorHandler` middleware (Mongoose errors, JWT errors, AppError, unknown errors)

### Backend — Auth

- [x] `User` model (name, email, password, role enum `user|admin`, timestamps)
- [x] Yup `registerSchema` + `loginSchema` in `server/src/validators/auth.validator.js`
- [x] `POST /api/auth/register` — hash password, create user, set HttpOnly cookies
- [x] `POST /api/auth/login` — verify credentials, set HttpOnly cookies
- [x] `POST /api/auth/refresh` — verify refreshToken cookie, issue new accessToken
- [x] `POST /api/auth/logout` — clear both cookies
- [x] `GET /api/auth/me` — protected, return current user
- [x] `protect` middleware — reads `accessToken` cookie, verifies JWT, attaches `req.user`
- [x] Access token: 15 min expiry | Refresh token: 7 day expiry
- [x] Role injection prevention (stripUnknown in validate middleware)
- [x] CORS configured with `credentials: true` and `CLIENT_URL` origin
- [x] `cookie-parser` middleware

### Frontend — Project Setup

- [x] Vite + React + TailwindCSS v4
- [x] Inter font loaded via Google Fonts in `index.css`
- [x] `react-router-dom` with `BrowserRouter`
- [x] Redux Toolkit store configured (`client/src/store/index.js`)
- [x] `Provider` + `BrowserRouter` wrapping `App` in `main.jsx`
- [x] `.env` with `VITE_API_BASE_URL`, `VITE_MAPBOX_TOKEN`

### Frontend — Auth Infrastructure

- [x] `client/src/api/authApi.js` — Axios instance with `withCredentials: true`
- [x] Response interceptor — 401 → silent refresh → retry original request (with queue for concurrent requests)
- [x] `authSlice.js` — `register`, `login`, `logout`, `getMe` thunks
- [x] Redux state: `{ user, loading, error, sessionChecked }`
- [x] No token in JS — browser sends HttpOnly cookie automatically
- [x] `getMe()` called on app mount to restore session
- [x] Routes guarded by `user` state; `sessionChecked` prevents flash of login page

### Frontend — Form Infrastructure

- [x] `client/src/validators/auth.validator.js` — Yup schemas for login + register
- [x] `FormField` reusable component — label, input, inline error on blur, red border on invalid
- [x] `formik` + `yup` integrated (validate on blur, show per-field errors)

### Frontend — Auth Pages

- [x] `LoginPage` — Formik form, error banner for API errors, loading state on button
- [x] `RegisterPage` — Formik form with confirm password, Yup `oneOf` validation
- [x] Redirect to `/` after successful login/register
- [x] Redirect to `/login` if unauthenticated
- [x] Design: indigo/cyan background blobs, white card, Inter font, correct color tokens

---

## Phase 2 — Core Data + Content Pages

### Backend — Data Models

- [x] `Destination` model (name, country, description, bestTime, heroImage, tags, coordinates `{lat, lng}`)
- [x] `Place` model (destinationId ref, name, description, category, image)
- [x] `Restaurant` model (destinationId ref, name, cuisine, priceLevel, rating)
- [x] `PropertyStay` model (destinationId ref, name, priceRange, rating, location)

### Backend — Destination API

- [x] `GET /api/destinations` — list all, optional `?month=` filter (RegExp on `bestTime`)
- [x] `GET /api/destinations/:id` — single destination (404 if not found)
- [x] `GET /api/destinations/:id/places` — top places for destination
- [x] `GET /api/destinations/:id/restaurants` — top restaurants for destination
- [x] `GET /api/destinations/:id/stays` — top property stays for destination
- [x] Yup validators for any query params
- [x] All routes wired in `app.js`

### Backend — Seed Script

- [x] `server/src/seed.js` — seeds 20+ destinations with varied countries/regions
- [x] Each destination has 5+ places, 5+ restaurants, 5+ stays
- [x] Seed script clears existing data before seeding
- [x] Run via `npm run seed`

### Frontend — Redux

- [x] `destinationSlice.js` — `fetchDestinations`, `fetchDestinationById` thunks
- [x] `destinationsApi.js` — Axios calls using shared `API` instance
- [x] Store updated to include `destinations` reducer

### Frontend — Navbar

- [x] Logo + brand name linking to `/`
- [x] Nav links: Home, AI Search (`/ai-search`)
- [x] Wishlist link (`/wishlist`) — visible only when logged in
- [x] Right side: Login button (guest) / user name + Sign out button (authenticated)
- [x] Responsive: mobile hamburger menu
- [x] Active link highlight using `NavLink`

### Frontend — Home Page (`/`)

- [x] Hero section — headline, sub-headline, CTA button linking to `/ai-search`
- [x] Month filter bar — Jan–Dec buttons, active state styling
- [x] Destination card grid — image, name, country, bestTime badge
- [x] Cards link to `/destinations/:id`
- [x] Loading skeleton while fetching
- [x] Empty state if no destinations match filter
- [x] `useEffect` fetches destinations on mount (with optional month param)

### Frontend — Destination Detail Page (`/destinations/:id`)

- [x] Hero image with destination name + country overlay
- [x] "Top Places" section — horizontal card row (name, category, image)
- [x] "Top Restaurants" section — horizontal card row (name, cuisine, priceLevel, rating)
- [x] "Where to Stay" section — horizontal card row (name, priceRange, rating)
- [x] Loading state while sub-entity data loads
- [x] 404 / error state if destination not found
- [x] Back button to home

### Frontend — App.jsx Updates

- [x] Add routes for `/`, `/destinations/:id`
- [x] Remove placeholder home page content
- [x] `Navbar` rendered on all pages except `/login` and `/register`

---

## Phase 3 — AI Engine + Redis + Smart Itinerary

### Backend — AI Recommendation (Basic) ✅

- [x] `Gemini` service (`server/src/services/gemini.service.js`) — model `gemini-2.5-flash`
- [x] Basic prompt template → returns `{ recommendedDestination, reason }`
- [x] `POST /api/ai/recommend` — Yup validated 5 fields, wired in `app.js`
- [x] Gemini response parsed and validated

### Backend — AI Recommendation (Enhanced) 🔲

- [ ] `server/src/services/redis.service.js` — Upstash Redis `get/set/del` helpers (`@upstash/redis`)
- [ ] `REDIS_URL` + `REDIS_TOKEN` added to `server/.env`
- [ ] Updated `Destination` model: `slug` (unique), `aiGenerated`, `travelPlans[]`
- [ ] Updated `Place` model: `coordinates {lat,lng}`, `dayIndex`
- [ ] Updated `Restaurant` model: optional `placeId` ref
- [ ] Updated `PropertyStay` model: optional `placeId` ref
- [ ] Two-phase Gemini prompting: Phase 1 (name only) → Phase 2 (full itinerary JSON)
- [ ] Phase 2 prompt: 2 travel plans, days-aware place count, budget-matched restaurants/stays per place
- [ ] AI controller: Redis search cache check → Redis dest cache → MongoDB slug lookup → Gemini
- [ ] AI-generated destination persisted to MongoDB (Destination + Places + Restaurants + Stays)
- [ ] Cache full result in Redis (`ai:dest:{slug}` TTL 7d, `ai:search:{hash}` TTL 1d)
- [ ] Response includes `source: "cache" | "db" | "ai"`
- [ ] `GET /api/ai/destination/:slug` endpoint — Redis → MongoDB lookup
- [ ] `GET /destinations/:id/places/:placeId/restaurants` — restaurants near specific place
- [ ] `GET /destinations/:id/places/:placeId/stays` — stays near specific place

### Frontend — AI Search Page (`/ai-search`) (Basic) ✅

- [x] Form: location, budget (budget/mid-range/luxury), days, travelStyle, interests
- [x] Formik + Yup validation on all 5 fields
- [x] `LoadingButton` with spinner
- [x] Result card — destination name + reason paragraph
- [x] Error state if Gemini fails

### Frontend — AI Search Page (Enhanced) 🔲

- [ ] Result card shows 4–5 place preview cards (day badge, name, category chip)
- [ ] "View Full Itinerary →" button → `/ai-destination?name={slug}`
- [ ] "New Search" button resets form and clears result

### Frontend — AI Destination Detail Page (`/ai-destination`) 🔲

- [ ] Fetches data from Redux state (from search) or `GET /api/ai/destination/:slug`
- [ ] Gradient hero with destination name, country, description, best time
- [ ] Two plan tabs (Plan 1 / Plan 2)
- [ ] Active plan shows numbered place cards (Day 1, Day 2…)
- [ ] Each place shows 2 restaurants (budget-matched) and 2 stays (budget-matched)
- [ ] Map with all place/restaurant/stay markers
- [ ] `source` badge: "AI Generated" or "From Database"
- [ ] Loading skeleton while fetching

### Frontend — Map Integration (Destination Detail) ✅

- [x] Install `leaflet` + OpenStreetMap (free, no API key)
- [x] Map renders in Destination Detail page with correct coordinates
- [x] Custom marker styled with brand colour (#4F46E5)
- [x] Map cleanup on component unmount
- [x] Map centered on destination coordinates
- [x] Map marker/pin at destination location with popup
- [x] POI markers for Places (green), Restaurants (cyan), Stays (purple) on map
- [x] Each POI marker has popup with name and type
- [x] Nominatim geocoding for POI coordinates with fallback scatter

---

## Phase 4 — Wishlist + Polish + Deployment

### Backend — Wishlist

- [ ] `Wishlist` model (userId ref, destinationId ref, createdAt)
- [ ] `POST /api/wishlist/add` — protected, add destination to wishlist (no duplicates)
- [ ] `GET /api/wishlist` — protected, return user's saved destinations (populated)
- [ ] `DELETE /api/wishlist/:id` — protected, remove from wishlist
- [ ] Wishlist routes wired in `app.js`

### Frontend — Wishlist

- [ ] `wishlistSlice.js` — `fetchWishlist`, `addToWishlist`, `removeFromWishlist` thunks
- [ ] `wishlistApi.js` — Axios calls
- [ ] Heart/bookmark button on destination cards — toggles wishlist state
- [ ] `WishlistPage` (`/wishlist`) — grid of saved destination cards
- [ ] Protected route — redirect to `/login` if unauthenticated
- [ ] Empty state message if wishlist is empty

### Frontend — Reusable Components Polish

- [ ] `LoadingButton` component — spinner + disabled state
- [ ] `Toast` notification component — success/error messages
- [ ] `DestinationCard` reusable component used across Home + Wishlist
- [ ] Error boundary or fallback UI for failed page loads

### Custom Hooks

- [ ] `useAuth` hook — returns `{ user, loading, logout }` from Redux
- [ ] `useApi` hook — generic data fetching with `loading` / `error` / `data` states

### Testing — Backend

- [ ] Auth tests: register, login, duplicate email, role stripping, missing fields (Jest + Supertest)
- [ ] Protect middleware tests: no token, expired token, valid token
- [ ] Destination API tests: list, filter by month, single by id, 404 case
- [ ] Wishlist tests: add, get, delete, duplicate prevention, unauthenticated access
- [ ] AI controller test: mocked Gemini response

### Testing — Frontend

- [ ] `FormField` component renders label, input, error on blur
- [ ] `LoginPage` shows error banner on failed login
- [ ] `RegisterPage` validates confirm password mismatch
- [ ] Destination card renders name, country, bestTime

### Testing — E2E (Cypress)

- [ ] Full register → login → browse destinations flow
- [ ] AI search form → submit → result card displayed
- [ ] Add to wishlist → view wishlist → remove

### Deployment

- [ ] `client/.env.production` with production `VITE_API_BASE_URL` + `VITE_MAPBOX_TOKEN`
- [ ] `server/.env.production` with `MONGO_URI` (Atlas), `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GEMINI_API_KEY`
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render / Railway
- [ ] CORS `CLIENT_URL` updated to production Vercel URL
- [ ] `NODE_ENV=production` set on server (enables `secure` flag on cookies)
- [ ] MongoDB Atlas network access configured

---

## Progress Summary

| Phase                                     | Total   | Done   |
| ----------------------------------------- | ------- | ------ |
| Phase 1 — Foundation                      | 35      | 35     |
| Phase 2 — Core Data + Pages               | 28      | 28     |
| Phase 3 — AI Basic                        | 12      | 12     |
| Phase 3 — AI Enhanced (Redis + Itinerary) | 17      | 0      |
| Phase 4 — Wishlist + Polish + Deploy      | 28      | 0      |
| **Total**                                 | **120** | **75** |
