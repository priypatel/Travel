# API Contracts

## Base Setup
*   **Base URL**: `/api`
*   **Authentication**: HttpOnly cookies (`accessToken` + `refreshToken`). Axios uses `withCredentials: true`.
*   **Request Validation**: All POST/PUT endpoints use `validate` middleware with Yup schema before controller runs.
*   **Error Handling**: All controllers wrapped in `asyncHandler`. Errors formatted by centralized `errorHandler`.

## Standardized Error Response
```json
{
  "status": "error",
  "message": "Human-readable summary",
  "errors": [
    { "field": "email", "message": "Email is required" }
  ]
}
```
*   `errors` array present only for 400 validation errors.
*   All other errors (401, 403, 404, 409, 502, 500): only `status` and `message`.

---

## 1. Auth APIs
*   `POST /auth/register` — Creates user with `role="user"` (role stripped). Sets cookies.
    *   **Yup**: `name` (required, trimmed), `email` (required, valid), `password` (required, min 6).
*   `POST /auth/login` — Authenticates, sets `accessToken` + `refreshToken` HttpOnly cookies.
    *   **Yup**: `email` (required, valid), `password` (required).
*   `POST /auth/refresh` — Reads `refreshToken` cookie, issues new `accessToken`.
*   `POST /auth/logout` — Clears both cookies.
*   `GET /auth/me` — Protected. Returns `{ _id, name, email, role }`.

---

## 2. Destination Discovery APIs
*   `GET /destinations` — Array of Destinations. Supports `?month=october` (RegExp on `bestTime`).
*   `GET /destinations/:id` — Full Destination document. 404 AppError if not found.

---

## 3. Destination Sub-Entity APIs
*   `GET /destinations/:id/places` — All Places (sorted by `dayIndex`).
*   `GET /destinations/:id/restaurants` — All Restaurants for destination.
*   `GET /destinations/:id/stays` — All PropertyStays for destination.
*   `GET /destinations/:id/places/:placeId/restaurants` — Restaurants near a specific Place.
*   `GET /destinations/:id/places/:placeId/stays` — Stays near a specific Place.

---

## 4. Wishlist APIs (Requires Auth Cookie)
*   `POST /wishlist/add` — Body: `{ "destinationId": "ObjectId" }`. No duplicates.
    *   **Yup**: `destinationId` (required, valid ObjectId).
*   `GET /wishlist` — Returns populated destination cards for user.
*   `DELETE /wishlist/:id` — Removes wishlist item.

---

## 5. AI Recommendation API

### `POST /ai/recommend`
**Yup**: `location` (required), `budget` (required, enum: `budget|mid-range|luxury`), `days` (required, min 1), `travelStyle` (required), `interests` (required array, min 1).

**Request**:
```json
{
  "location": "India",
  "budget": "mid-range",
  "days": 4,
  "travelStyle": "Adventure",
  "interests": ["nature", "photography"]
}
```

**Response** (full destination + itinerary plans):
```json
{
  "destination": {
    "_id": "ObjectId",
    "name": "Kashmir",
    "slug": "kashmir-india",
    "country": "India",
    "description": "...",
    "bestTime": "March to October",
    "heroImage": "URL",
    "coordinates": { "lat": 34.08, "lng": 74.79 },
    "aiGenerated": true,
    "travelPlans": [
      { "planName": "Classic Kashmir - 4 Days", "days": 4, "placeIds": ["..."] },
      { "planName": "Extended Kashmir - 6 Days", "days": 6, "placeIds": ["..."] }
    ]
  },
  "plans": [
    {
      "planName": "Classic Kashmir - 4 Days",
      "days": 4,
      "places": [
        {
          "_id": "ObjectId",
          "name": "Srinagar",
          "description": "...",
          "category": "City",
          "coordinates": { "lat": 34.08, "lng": 74.79 },
          "restaurants": [
            { "name": "Ahdoos", "cuisine": "Kashmiri", "priceLevel": "mid-range", "rating": 4.5 },
            { "name": "Chai Jaai", "cuisine": "Cafe", "priceLevel": "budget", "rating": 4.2 }
          ],
          "stays": [
            { "name": "The Lalit Grand Palace", "priceRange": "mid-range", "rating": 4.7, "location": "Dal Lake" },
            { "name": "Hotel Broadway", "priceRange": "budget", "rating": 4.1, "location": "City Centre" }
          ]
        }
      ]
    }
  ],
  "source": "cache | db | ai"
}
```

### `GET /ai/destination/:slug`
Returns stored AI destination (Redis → MongoDB). 404 if not found.

---

## 6. Cache Behaviour
*   `ai:dest:{slug}` (TTL 7 days) — Full destination + plans JSON.
*   `ai:search:{sha256-hash}` (TTL 1 day) — Maps search params → destination slug.
*   `source` field in response: `"cache"` | `"db"` | `"ai"`.
