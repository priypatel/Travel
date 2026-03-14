# Development Phases

## Phase 1: Foundation Setup (Weeks 1-2) ✅ COMPLETE
*   Initialize monorepo, MongoDB Atlas, JWT auth (HttpOnly cookies, 15min/7day tokens).
*   Centralized error handling: `AppError`, `asyncHandler`, `errorHandler`, `validate` middleware.
*   Frontend form infrastructure: Formik + Yup, `FormField`, `LoadingButton`.
*   Axios with `withCredentials: true`, 401 → silent refresh → retry.

## Phase 2: Core Data Models & Content Pages (Weeks 3-4) ✅ COMPLETE
*   Mongoose schemas for Destination, Place, Restaurant, PropertyStay.
*   Seed script: 20+ destinations with 5+ places/restaurants/stays each.
*   GET endpoints for destinations and sub-entities.
*   Home page (month filter, card grid) + Destination Detail page.

## Phase 3: AI Engine + Map + Redis (Weeks 5-6) — IN PROGRESS
*   **Completed**:
    *   Gemini integration (model: `gemini-2.5-flash`) with 2-phase prompting.
    *   Basic AI Search form (Formik + Yup) + result card.
    *   Leaflet + OpenStreetMap map with POI markers (places/restaurants/stays).
*   **In Progress / Planned**:
    *   Upstash Redis caching layer (`ai:dest:{slug}`, `ai:search:{hash}`).
    *   Updated Gemini prompt returning full itinerary JSON (2 plans, places per day, budget-matched restaurants/stays per place).
    *   DB persistence for AI-generated destinations (Destination + Place + Restaurant + PropertyStay).
    *   Updated schema: Place gets `coordinates` + `dayIndex`; Restaurant/Stay get optional `placeId`.
    *   AI Search result card shows 4-5 place preview cards.
    *   New AI Destination Detail page (`/ai-destination?name={slug}`) with 2 plan tabs, per-place restaurants/stays.
    *   New sub-entity endpoints: `GET /destinations/:id/places/:placeId/restaurants|stays`.

## Phase 4: Wishlist + Polish + Deployment (Weeks 7-8)
*   Wishlist schema, protected API routes, Redux slice, heart button on destination cards.
*   Toast notification component.
*   Framer Motion transitions.
*   End-to-end testing (Cypress), visual QA, mobile responsiveness.
*   Deploy: React → Vercel, Node → Render/Railway, MongoDB Atlas, Upstash Redis.
