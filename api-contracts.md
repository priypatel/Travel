# API Contracts

## Base Setup
*   **Base URL**: `/api`
*   **Authentication mechanism**: JSON Web Tokens (JWT) passed via `Authorization: Bearer <token>` header.
*   **Request Validation**: All POST/PUT endpoints use a `validate` middleware that checks `req.body` against a Yup schema before the controller runs. Invalid requests receive a standardized 400 response with field-level error details.
*   **Error Handling**: All controllers are wrapped in `asyncHandler`. Errors are caught and formatted by the centralized `errorHandler` middleware.

## Standardized Error Response
All error responses follow this shape:
```json
{
  "status": "error",
  "message": "Human-readable summary",
  "errors": [
    { "field": "email", "message": "Email is required" },
    { "field": "password", "message": "Password must be at least 6 characters" }
  ]
}
```
*   The `errors` array is present only for validation (400) errors with field-level details.
*   For non-validation errors (401, 403, 404, 409, 500), only `status` and `message` are returned.

## 1. Auth APIs
*   `POST /auth/register` - Creates a new user. Always assigns `role="user"`. Any `role` field passed in the request body is actively ignored by the server to prevent privilege escalation. Returns JWT and user object.
    *   **Yup Validation Schema**: `name` (string, required, trimmed), `email` (string, required, valid email format), `password` (string, required, min 6 characters).
*   `POST /auth/login` - Authenticates user. Returns JWT.
    *   **Yup Validation Schema**: `email` (string, required, valid email format), `password` (string, required).

## 2. Destination Discovery APIs
*   `GET /destinations` - Returns an array of Destination summary objects. Supports query params (e.g., `?month=october`).
*   `GET /destinations/:id` - Returns detailed data for a singular Destination object.

## 3. Destination Sub-Entity APIs
These endpoints are decoupled from the main Destination endpoint to allow for lazy-loading on the client side if necessary.
*   `GET /destinations/:id/places` - Returns an array of 'Top 5 Places' associated with the destination.
*   `GET /destinations/:id/restaurants` - Returns an array of 'Top 5 Restaurants'.
*   `GET /destinations/:id/stays` - Returns an array of 'Top 5 Property Stays'.

## 4. Wishlist APIs (Requires Authorization Header)
*   `POST /wishlist/add`
    *   Body: `{ "destinationId": "ObjectId..." }`
    *   **Yup Validation Schema**: `destinationId` (string, required, valid MongoDB ObjectId format).
    *   Adds destination to logged-in user's wishlist.
*   `GET /wishlist`
    *   Returns populated destination cards saved by the user.
*   `DELETE /wishlist/:id`
    *   Removes the item from the wishlist.

## 5. AI Recommendation Engine API
*   `POST /ai/recommend`
    *   **Yup Validation Schema**: `location` (string, required), `budget` (string, required, oneOf: Low/Medium/High), `days` (number, required, min 1), `travelStyle` (string, required), `interests` (array of strings, required, min 1 item).
    *   **Request Body**:
        ```json
        {
          "location": "Europe",
          "budget": "High",
          "days": 7,
          "travelStyle": "Relaxing",
          "interests": ["beaches", "wine"]
        }
        ```
    *   **Response Body**:
        ```json
        {
          "recommendedDestination": "Santorini, Greece",
          "reason": "Based on your high budget and 7-day relaxing travel style seeking beaches and wine, Santorini offers the best combination of luxurious stays, coastal vineyards, and beautiful calderas..."
        }
        ```
