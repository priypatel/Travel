# Engineering Scope Definition

## 1. In Scope (MVP)

### 1.1 Frontend (React + Leaflet)
*   Implementation of UI Wireframes (Home, Destination Detail, AI Search, AI Detail, Wishlist, Login, Register).
*   Dynamic rendering of Destination Cards, Places, Restaurants, and Property Stays.
*   **AI Search result** showing 4–5 place preview cards + "View Full Itinerary" button.
*   **AI Destination Detail page** with two plan tabs, per-place restaurants and stays (budget-matched).
*   Leaflet + OpenStreetMap integration for map on Destination Detail and AI Detail pages.
*   Nominatim geocoding for POI markers with deterministic fallback scatter.
*   Authenticatable Wishlist interaction.
*   Month filtering for the Destinations grid.
*   Formik + Yup for all form validation (Login, Register, AI Search).
*   Reusable components: `FormField`, `LoadingButton`, `Toast`.
*   Custom hooks: `useAuth`, `useApi`.
*   Axios with `withCredentials: true`, 401 → silent token refresh → retry.

### 1.2 Backend (Node.js + Express)
*   JWT auth via HttpOnly cookies (access 15min + refresh 7day).
*   Seed script: 20+ destinations with places, restaurants, stays.
*   **Updated AI endpoint** (`POST /api/ai/recommend`):
    *   Check Upstash Redis → check MongoDB by slug → call Gemini 2.5 Flash.
    *   Two-phase Gemini prompting (Phase 1: name, Phase 2: full itinerary JSON).
    *   Days-aware places (N days = N places in Plan 1).
    *   Budget-matched restaurants and stays per place (2 options closest to user budget).
    *   2 travel plans per destination (standard + extended).
    *   Persist AI result to MongoDB (Destination + Places + Restaurants + Stays).
    *   Cache in Upstash Redis (`ai:dest:{slug}` TTL 7d, `ai:search:{hash}` TTL 1d).
*   **New sub-entity endpoints**: `GET /destinations/:id/places/:placeId/restaurants|stays`.
*   Centralized error handling: `AppError`, `asyncHandler`, `errorHandler`, `validate`.
*   Yup schemas for all POST/PUT bodies.

### 1.3 Database & Cache
*   MongoDB Atlas: 6 collections. New fields: `Destination.slug`, `Destination.travelPlans[]`, `Place.coordinates`, `Place.dayIndex`, `Restaurant.placeId`, `PropertyStay.placeId`.
*   Upstash Redis: serverless caching, free tier, no local installation.
*   MongoDB indexes on `slug` (unique), `destinationId`, `placeId`, `userId`.

## 2. Out of Scope (Post-MVP)
*   Booking integrations (direct booking of stays).
*   Live GPS or turn-by-turn routing.
*   User-generated content (reviews, photo uploads).
*   Payment gateways or premium subscriptions.
*   Real-time availability from hotels/restaurants.
