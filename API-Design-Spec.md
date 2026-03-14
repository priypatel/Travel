# API Design Specification

Base URL: `/api`

---

## Auth APIs

```
POST /auth/register    — validated by Yup schema middleware
POST /auth/login       — validated by Yup schema middleware
POST /auth/refresh     — issue new accessToken from refreshToken cookie
POST /auth/logout      — clear auth cookies
GET  /auth/me          — protected, return current user
```

---

## Destination APIs

```
GET /destinations              — list all, optional ?month= filter
GET /destinations/:id          — single destination (404 if not found)
```

---

## Destination Sub-Entity APIs

```
GET /destinations/:id/places                            — all places for destination
GET /destinations/:id/restaurants                       — all restaurants (destinationId match)
GET /destinations/:id/stays                             — all stays (destinationId match)
GET /destinations/:id/places/:placeId/restaurants       — restaurants near a specific place
GET /destinations/:id/places/:placeId/stays             — stays near a specific place
```

---

## Wishlist APIs (auth required)

```
POST   /wishlist/add      — body: { destinationId }
GET    /wishlist          — return user's saved destinations (populated)
DELETE /wishlist/:id      — remove from wishlist
```

---

## AI Recommendation API

### POST /ai/recommend

**Request body** (Yup validated):
```json
{
  "location": "string (required)",
  "budget": "string (required, enum: budget | mid-range | luxury)",
  "days": "number (required, min: 1)",
  "travelStyle": "string (required)",
  "interests": ["string"]
}
```

**Response body** (full destination with itinerary plans):
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
      {
        "planName": "Classic Kashmir - 4 Days",
        "days": 4,
        "placeIds": ["ObjectId", "ObjectId"]
      },
      {
        "planName": "Extended Kashmir - 6 Days",
        "days": 6,
        "placeIds": ["ObjectId", "ObjectId", "ObjectId"]
      }
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
            { "name": "...", "cuisine": "...", "priceLevel": "mid-range", "rating": 4.5 },
            { "name": "...", "cuisine": "...", "priceLevel": "budget", "rating": 4.2 }
          ],
          "stays": [
            { "name": "...", "priceRange": "mid-range", "rating": 4.6, "location": "Dal Lake" },
            { "name": "...", "priceRange": "budget", "rating": 4.0, "location": "City Centre" }
          ]
        }
      ]
    }
  ],
  "source": "cache | db | ai"
}
```

---

## AI Destination Lookup

```
GET /ai/destination/:slug    — return stored AI destination by slug (checks Redis → DB)
```

---

## Standardized Error Response Format

```json
{
  "status": "error",
  "message": "Human-readable error description",
  "errors": [
    { "field": "email", "message": "Email is required" }
  ]
}
```

| Code | Meaning |
|------|---------|
| 400  | Validation errors (Yup schema failures) |
| 401  | Unauthorized (missing or invalid JWT) |
| 403  | Forbidden (insufficient role) |
| 404  | Resource not found |
| 409  | Conflict (e.g., duplicate email) |
| 502  | AI service error (Gemini parse failure) |
| 500  | Internal server error |
