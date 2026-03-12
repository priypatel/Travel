# API Design Specification

Base URL
/api

---

Auth APIs

POST /auth/register
POST /auth/login

Request body validated via Yup schema middleware before reaching the controller.

---

Destination APIs

GET /destinations
GET /destinations/:id

---

Places APIs

GET /destinations/:id/places

---

Restaurant APIs

GET /destinations/:id/restaurants

---

Property APIs

GET /destinations/:id/stays

---

Wishlist APIs

POST /wishlist/add
GET /wishlist
DELETE /wishlist/:id

Authentication required (verifyToken middleware)

---

AI Recommendation

POST /ai/recommend

Request body validated via Yup schema middleware.

Request

{
 location
 budget
 days
 travelStyle
 interests
}

Response

{
 recommendedDestination
 reason
}

---

## Standardized Error Response Format

All API errors are returned in a consistent shape by the centralized `errorHandler` middleware:

```json
{
  "status": "error",
  "message": "Human-readable error description",
  "errors": [
    { "field": "email", "message": "Email is required" }
  ]
}
```

*   **400** — Validation errors (missing/invalid fields, Yup schema failures)
*   **401** — Unauthorized (missing or invalid JWT)
*   **403** — Forbidden (insufficient role permissions)
*   **404** — Resource not found
*   **409** — Conflict (e.g., duplicate email on registration)
*   **500** — Internal server error (unexpected failures)