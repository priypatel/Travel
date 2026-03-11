# Engineering Scope Definition

## 1. In Scope (MVP)

### 1.1 Frontend (React + Mapbox)
*   Implementation of the updated UI Wireframes (Home, Destination Detail, Advanced Search, Wishlist).
*   Dynamic rendering of Destination Cards, Top 5 Places, Top 5 Restaurants, and Top 5 Property Stays.
*   Advanced AI Search Form capturing location, budget, travel days, travel style, and interests.
*   Authenticatable Wishlist interaction (Save/Remove buttons).
*   Month filtering logic for the Destinations grid.
*   Mapbox integration for visual route plotting on the Destination Detail page.
*   JWT-based auth state handling.

### 1.2 Backend (Node.js + Express)
*   JWT-based stateless authentication (`/auth/login`, `/auth/register`) with strict role enforcement (always default to "user").
*   Creation of a database seed script to manually provision "admin" accounts and populate the database with the core ~20+ Top India & World destinations (along with their places, restaurants, and stays).
*   CRUD routes mapping to the complex `travel_ai_db` relational collections: Destinations, Places, Restaurants, PropertyStays, Wishlists.
*   API integration with Google Gemini Free Tier for prompt completion (`/ai/recommend`).
*   JSON parsing and validation of Gemini responses to extract `{ recommendedDestination, reason }`.

### 1.3 Database & DevOps
*   MongoDB Atlas Setup configuring 6 distinct collections.
*   Index creation on `bestTime`, `rating`, and reference keys (`destinationId`, `userId`) to optimize load times.

## 2. Out of Scope (Post-MVP / Future Phases)
*   Booking integrations (e.g., direct booking of the Top 5 Property Stays).
*   Live GPS tracking, turn-by-turn routing, and real-time transit APIs.
*   User-generated content (e.g., custom reviews, photos uploads).
*   Payment gateways and premium subscriptions.
*   Multi-city hopping AI algorithms (Current MVP scope is pointing to a single recommended destination).
