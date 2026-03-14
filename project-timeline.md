# Project Implementation Timeline & AI Prompts

Steps 1–5 (Foundation, Auth, Data APIs, Home, Destination Detail) are COMPLETE.

---

## Step 6: Backend AI Recommendation Engine (ENHANCED) ✅ Partially Done
*   **Work Done**: Gemini integration, basic `/ai/recommend` endpoint, `gemini-2.5-flash` model.
*   **Remaining**: Two-phase prompting, Redis caching, DB persistence, per-place restaurants/stays.
*   **AI Generation Prompt**:
    > "Overhaul the `/api/ai/recommend` Express controller. The updated flow is:
    > 1. Hash request params → check Upstash Redis key `ai:search:{hash}`.
    > 2. On miss: call Gemini Phase 1 (returns only `destinationName`) → normalize to slug.
    > 3. Check Redis `ai:dest:{slug}` → then check MongoDB `Destination.findOne({ slug })`.
    > 4. On DB hit with `travelPlans`: cache in Redis, return `{ destination, plans, source: 'db' }`.
    > 5. On miss: call Gemini Phase 2 (full itinerary JSON — 2 plans, days-aware, per-place restaurants/stays budget-matched).
    > 6. Parse JSON → save to MongoDB (Destination + Place + Restaurant + PropertyStay docs with placeId refs).
    > 7. Cache in Redis. Return `{ destination, plans, source: 'ai' }`.
    > Create `server/src/services/redis.service.js` using `@upstash/redis` with `get/set/del` helpers.
    > All Gemini calls use model `gemini-2.5-flash`."

---

## Step 7: Frontend Advanced AI Search UI (ENHANCED) ✅ Partially Done
*   **Work Done**: Basic form, result card with destination name + reason.
*   **Remaining**: Place preview cards (4–5), "View Full Itinerary" button, AI Detail page redesign.
*   **AI Generation Prompt**:
    > "Update the AI Search React page. After API response, display:
    > - 4–5 place preview cards (day number badge, place name, category chip) in a horizontal scroll.
    > - 'View Full Itinerary →' button linking to `/ai-destination?name={slug}`.
    > - 'New Search' button to reset.
    > Build the new `AIDestinationDetailPage` at `/ai-destination?name={slug}`:
    > - Fetch from `GET /api/ai/destination/:slug` or use Redux state from previous search.
    > - Show gradient hero with destination name.
    > - Two tab buttons for Plan 1 and Plan 2.
    > - Active tab: numbered place cards (Day 1, Day 2...), each showing 2 restaurants and 2 stays (budget-closest first).
    > - Leaflet map with all place/restaurant/stay markers."

---

## Step 8: Map Integration (Leaflet + OpenStreetMap) ✅ COMPLETE
*   Leaflet map on both Destination Detail and AI Detail pages.
*   Colour-coded POI markers with Nominatim geocoding + fallback scatter.
*   Legend below map.

---

## Step 9: Wishlist System & Final Polish
*   **Work Done**: None yet.
*   **AI Generation Prompt**:
    > "Write Wishlist Mongoose schema (userId ref, destinationId ref, createdAt). Write protected routes: `POST /api/wishlist/add` (Yup validated, no duplicates), `GET /api/wishlist` (populated), `DELETE /api/wishlist/:id`. All wrapped by `asyncHandler` and protected by `protect` middleware. On the frontend: wishlistSlice with fetchWishlist/addToWishlist/removeFromWishlist thunks. Heart toggle button on DestinationCard (logged-in only). `/wishlist` page with grid of saved cards. Toast on add/remove. Empty state message."
