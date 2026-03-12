# Engineering Scope Definition

## 1. In Scope (MVP)

### 1.1 Frontend (React + Mapbox)
*   Implementation of the updated UI Wireframes (Home, Destination Detail, Advanced Search, Wishlist, Login, Register).
*   Dynamic rendering of Destination Cards, Top 5 Places, Top 5 Restaurants, and Top 5 Property Stays.
*   Advanced AI Search Form capturing location, budget, travel days, travel style, and interests.
*   Authenticatable Wishlist interaction (Save/Remove buttons).
*   Month filtering logic for the Destinations grid.
*   Mapbox integration for visual route plotting on the Destination Detail page.
*   JWT-based auth state handling.
*   **Formik + Yup** for all form state management and schema-based validation (Login, Register, AI Search).
*   **Reusable component library**: `FormField` (label + input + error), `LoadingButton` (submit with spinner), `Toast` (notification popup).
*   **Custom hooks**: `useAuth` (login, register, logout, user state), `useApi` (generic data-fetching with loading/error).
*   **Axios interceptors**: Request interceptor (auto-attach JWT), response interceptor (global 401 handling — clear session, redirect to login).
*   **Yup validation schemas** (`client/src/validators/`) shared across form pages.

### 1.2 Backend (Node.js + Express)
*   JWT-based stateless authentication (`/auth/login`, `/auth/register`) with strict role enforcement (always default to "user").
*   Creation of a database seed script to manually provision "admin" accounts and populate the database with the core ~20+ Top India & World destinations (along with their places, restaurants, and stays).
*   CRUD routes mapping to the complex `travel_ai_db` relational collections: Destinations, Places, Restaurants, PropertyStays, Wishlists.
*   API integration with Google Gemini Free Tier for prompt completion (`/ai/recommend`).
*   JSON parsing and validation of Gemini responses to extract `{ recommendedDestination, reason }`.
*   **Centralized error-handling middleware**: 
    *   `AppError` custom error class (`utils/AppError.js`) with `statusCode` and `isOperational`.
    *   `asyncHandler` middleware (`middleware/asyncHandler.js`) wrapping all async controllers — eliminates `try/catch` boilerplate.
    *   `errorHandler` global middleware (`middleware/errorHandler.js`) as the last Express middleware, formatting all errors into a consistent `{ status, message, errors }` JSON shape.
    *   `validate` middleware (`middleware/validate.js`) that validates `req.body` against Yup schemas before the request reaches the controller.
*   **Yup validation schemas** (`validators/`) for all POST/PUT request bodies (auth, wishlist, AI recommend).

### 1.3 Database & DevOps
*   MongoDB Atlas Setup configuring 6 distinct collections.
*   Index creation on `bestTime`, `rating`, and reference keys (`destinationId`, `userId`) to optimize load times.

## 2. Out of Scope (Post-MVP / Future Phases)
*   Booking integrations (e.g., direct booking of the Top 5 Property Stays).
*   Live GPS tracking, turn-by-turn routing, and real-time transit APIs.
*   User-generated content (e.g., custom reviews, photos uploads).
*   Payment gateways and premium subscriptions.
*   Multi-city hopping AI algorithms (Current MVP scope is pointing to a single recommended destination).
