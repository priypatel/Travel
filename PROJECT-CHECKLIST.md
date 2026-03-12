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
- [ ] `Destination` model (name, country, description, bestTime, heroImage, tags, coordinates `{lat, lng}`)
- [ ] `Place` model (destinationId ref, name, description, category, image)
- [ ] `Restaurant` model (destinationId ref, name, cuisine, priceLevel, rating)
- [ ] `PropertyStay` model (destinationId ref, name, priceRange, rating, location)

### Backend — Destination API
- [ ] `GET /api/destinations` — list all, optional `?month=` filter (RegExp on `bestTime`)
- [ ] `GET /api/destinations/:id` — single destination (404 if not found)
- [ ] `GET /api/destinations/:id/places` — top places for destination
- [ ] `GET /api/destinations/:id/restaurants` — top restaurants for destination
- [ ] `GET /api/destinations/:id/stays` — top property stays for destination
- [ ] Yup validators for any query params
- [ ] All routes wired in `app.js`

### Backend — Seed Script
- [ ] `server/src/seed.js` — seeds 20+ destinations with varied countries/regions
- [ ] Each destination has 5+ places, 5+ restaurants, 5+ stays
- [ ] Seed script clears existing data before seeding
- [ ] Run via `npm run seed`

### Frontend — Redux
- [ ] `destinationSlice.js` — `fetchDestinations`, `fetchDestinationById` thunks
- [ ] `destinationsApi.js` — Axios calls using shared `API` instance
- [ ] Store updated to include `destinations` reducer

### Frontend — Navbar
- [ ] Logo + brand name linking to `/`
- [ ] Nav links: Home, AI Search (`/ai-search`)
- [ ] Wishlist link (`/wishlist`) — visible only when logged in
- [ ] Right side: Login button (guest) / user name + Sign out button (authenticated)
- [ ] Responsive: mobile hamburger menu
- [ ] Active link highlight using `NavLink`

### Frontend — Home Page (`/`)
- [ ] Hero section — headline, sub-headline, CTA button linking to `/ai-search`
- [ ] Month filter bar — Jan–Dec buttons, active state styling
- [ ] Destination card grid — image, name, country, bestTime badge
- [ ] Cards link to `/destinations/:id`
- [ ] Loading skeleton while fetching
- [ ] Empty state if no destinations match filter
- [ ] `useEffect` fetches destinations on mount (with optional month param)

### Frontend — Destination Detail Page (`/destinations/:id`)
- [ ] Hero image with destination name + country overlay
- [ ] "Top Places" section — horizontal card row (name, category, image)
- [ ] "Top Restaurants" section — horizontal card row (name, cuisine, priceLevel, rating)
- [ ] "Where to Stay" section — horizontal card row (name, priceRange, rating)
- [ ] Mapbox GL JS map centered on destination coordinates
- [ ] Map marker/pin at destination location
- [ ] Loading state while sub-entity data loads
- [ ] 404 / error state if destination not found
- [ ] Back button to home

### Frontend — App.jsx Updates
- [ ] Add routes for `/`, `/destinations/:id`
- [ ] Remove placeholder home page content
- [ ] `Navbar` rendered on all pages except `/login` and `/register`

---

## Phase 3 — AI Engine + Mapbox

### Backend — AI Recommendation
- [ ] `Gemini` service (`server/src/services/gemini.service.js`) — initialise `@google/generative-ai`
- [ ] Strict prompt template (location, budget, days, travelStyle, interests → JSON response)
- [ ] `POST /api/ai/recommend` — validate 5 fields with Yup, call Gemini, return `{ recommendedDestination, reason }`
- [ ] Gemini response parsed and validated (prevent hallucinations)
- [ ] AI route wired in `app.js`

### Frontend — AI Search Page (`/ai-search`)
- [ ] Form: location (text), budget (select: budget/mid-range/luxury), days (number), travelStyle (select), interests (multi-select or text)
- [ ] Formik + Yup validation on all 5 fields
- [ ] `LoadingButton` with spinner while AI processes
- [ ] Result card — destination name + reason paragraph
- [ ] Link from result card to `/destinations/:id` (if destination exists in DB)
- [ ] Error state if Gemini fails

### Frontend — Mapbox Integration (Destination Detail)
- [ ] Install `mapbox-gl`
- [ ] `VITE_MAPBOX_TOKEN` used to initialise map
- [ ] Map renders in Destination Detail page with correct coordinates
- [ ] Custom marker styled with brand colour
- [ ] Map cleanup on component unmount

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

| Phase | Total | Done |
|-------|-------|------|
| Phase 1 — Foundation | 35 | 35 |
| Phase 2 — Core Data + Pages | 30 | 0 |
| Phase 3 — AI + Mapbox | 10 | 0 |
| Phase 4 — Wishlist + Polish + Deploy | 28 | 0 |
| **Total** | **103** | **35** |
