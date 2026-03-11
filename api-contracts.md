# API Contracts

## Base Setup
*   **Base URL**: `/api`
*   **Authentication mechanism**: JSON Web Tokens (JWT) passed via `Authorization: Bearer <token>` header.

## 1. Auth APIs
*   `POST /auth/register` - Creates a new user. Always assigns `role="user"`. Any `role` field passed in the request body is actively ignored by the server to prevent privilege escalation. Returns JWT and user object.
*   `POST /auth/login` - Authenticates user. Returns JWT.

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
    *   Adds destination to logged-in user's wishlist.
*   `GET /wishlist`
    *   Returns populated destination cards saved by the user.
*   `DELETE /wishlist/:id`
    *   Removes the item from the wishlist.

## 5. AI Recommendation Engine API
*   `POST /ai/recommend`
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
