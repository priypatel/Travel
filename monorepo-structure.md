# Monorepo Project Structure

```text
travel-ai-app/
│
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormField.jsx
│   │   │   ├── LoadingButton.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── DestinationCard.jsx
│   │   │   ├── TopPlaceCard.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── DestinationDetailPage.jsx      # Seeded destinations
│   │   │   ├── AISearchPage.jsx               # Form + 4-5 place preview cards
│   │   │   ├── AIDestinationDetailPage.jsx    # 2 plan tabs, per-place res/stays
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useApi.js
│   │   ├── validators/
│   │   │   ├── loginSchema.js
│   │   │   ├── registerSchema.js
│   │   │   └── aiSearchSchema.js
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── destinationSlice.js
│   │   │       └── aiSlice.js                 # AI search + detail state
│   │   ├── api/
│   │   │   ├── axiosInstance.js               # withCredentials + 401 refresh
│   │   │   ├── authApi.js
│   │   │   └── destinationsApi.js
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── destination.controller.js
│   │   │   ├── wishlist.controller.js
│   │   │   └── ai.controller.js              # Cache → DB → Gemini flow
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── destination.routes.js         # Includes /:id/places/:placeId/restaurants|stays
│   │   │   ├── wishlist.routes.js
│   │   │   └── ai.routes.js
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   ├── Destination.model.js          # +slug, +aiGenerated, +travelPlans[]
│   │   │   ├── Place.model.js                # +coordinates, +dayIndex
│   │   │   ├── Restaurant.model.js           # +placeId (optional)
│   │   │   ├── PropertyStay.model.js         # +placeId (optional)
│   │   │   └── Wishlist.model.js
│   │   ├── services/
│   │   │   ├── gemini.service.js             # 2-phase prompting, model: gemini-2.5-flash
│   │   │   └── redis.service.js              # Upstash Redis get/set/del helpers
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── validate.js
│   │   │   └── protect.js                   # JWT cookie auth guard
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   ├── wishlist.validator.js
│   │   │   └── ai.validator.js              # budget enum: budget|mid-range|luxury
│   │   ├── utils/
│   │   │   └── AppError.js
│   │   ├── seed.js
│   │   └── app.js
│   └── package.json
│
├── package.json
└── README.md
```

## Implementation Notes
*   **`redis.service.js`**: Wraps `@upstash/redis` with `get(key)`, `set(key, value, ttl)`, `del(key)` helpers. Returns `null` on miss/error so controllers degrade gracefully without Redis.
*   **`ai.controller.js`**: Implements the 5-step flow: hash params → Redis search cache → Gemini Phase 1 → Redis dest cache → MongoDB → Gemini Phase 2 → DB persist → Redis cache → return.
*   **`gemini.service.js`**: Exports `getDestinationName(params)` (Phase 1) and `getFullItinerary(destinationName, params)` (Phase 2). Both use `gemini-2.5-flash`.
*   **`aiSlice.js`**: Redux slice managing `{ result, loading, error }` for AI search and `{ destinationDetail, detailLoading }` for the AI detail page.
*   **New route**: `GET /destinations/:id/places/:placeId/restaurants` and `stays` — queries Restaurant/PropertyStay by both `destinationId` AND `placeId`.
