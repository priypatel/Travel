# Testing Strategy

## 1. Scope
Covers custom logic, relational DB fetching, secured routes, AI integration, Redis caching, map, error handling, and form validation.

## 2. Testing Frameworks
*   **Backend**: Jest + Supertest.
*   **Frontend**: React Testing Library + Jest.
*   **E2E**: Cypress.

## 3. High-Priority Backend Tests

### 3.1 Authentication & Security
*   `/auth/register` strips `role` from body, defaults to `"user"`.
*   `/wishlist/add` rejects requests without valid auth cookie (401).
*   Tokens decode to valid `userId` and `role`.

### 3.2 Centralized Error Handling
*   `asyncHandler` catches rejected promises and forwards to `errorHandler`.
*   `AppError` instances produce correct `statusCode` and `message`.
*   `validate` middleware returns 400 with field-level errors on Yup failure.
*   Unknown errors return generic 500 without leaking stack traces.

### 3.3 Request Validation (Yup Schemas)
*   `/auth/register` rejects missing name/email/password with 400 + field errors.
*   `/ai/recommend` rejects invalid `budget` values (not in `budget|mid-range|luxury`).
*   `/ai/recommend` rejects `days < 1` and empty `interests`.

### 3.4 AI Controller — Cache/DB/Gemini Flow
*   On Redis cache hit: returns `source: "cache"`, Gemini NOT called.
*   On DB hit (Redis miss): returns `source: "db"`, Gemini NOT called.
*   On both misses: calls Gemini Phase 1 (name), then Phase 2 (full JSON).
*   On Gemini parse failure: throws `AppError(502)` without crashing server.
*   AI-generated destination is saved to MongoDB after fresh Gemini call.
*   Mock Gemini with `jest.mock()` — test controller logic independently of LLM.

### 3.5 Redis Service
*   `get(key)` returns `null` on miss, not an error.
*   If Redis is unavailable, controller degrades gracefully (falls through to MongoDB).

### 3.6 Relational Sub-Entity APIs
*   `GET /destinations/:id/places` retrieves only places for that destination.
*   `GET /destinations/:id/places/:placeId/restaurants` retrieves only restaurants linked to that place.
*   `GET /destinations/:id/places/:placeId/stays` retrieves only stays linked to that place.

## 4. High-Priority Frontend Tests

### 4.1 Form Validation (Formik + Yup)
*   Login shows inline errors for empty email and password on submit.
*   Register shows "Passwords do not match" on mismatch.
*   AI Search shows error for budget not in allowed values.
*   AI Search form validates all 5 fields.

### 4.2 Reusable Components
*   `FormField` renders label, input, inline error.
*   `LoadingButton` shows spinner when `isLoading={true}` and disables click.
*   `Toast` displays success/error/info variants.

### 4.3 AI Search Result
*   On success, 4–5 place preview cards are rendered.
*   "View Full Itinerary" button links to `/ai-destination?name={slug}`.
*   "New Search" button resets the form and clears results.

### 4.4 AI Detail Page
*   Two plan tabs render; clicking a tab switches the active plan.
*   Each place card shows its restaurants and stays.
*   Budget-closest options appear first.

## 5. End-to-End (E2E) Journeys
1.  **AI Search Flow**: Fill form → submit → see LoadingButton spinner → see 4–5 place cards → click "View Full Itinerary" → see AI detail page with 2 plan tabs → switch tabs → see per-place restaurants/stays.
2.  **Cache Hit Flow**: Run same search twice → second response returns faster (source: "cache").
3.  **Wishlist Flow**: Login → browse destinations → save to wishlist → navigate to `/wishlist` → see saved card → remove → card disappears.
4.  **Validation Flow**: Submit empty login → inline errors appear → correct fields → successful login.
