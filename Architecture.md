# Architecture

## High Level Architecture

Client (React)
        |
        v
Node.js Express API
        |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v
MongoDB Atlas      Upstash Redis        Gemini AI API
                   (Cache Layer)

Client (React)
        |
        v
Leaflet + OpenStreetMap   (map tiles, free)
        |
        v
Nominatim Geocoding API   (POI coordinates, free)

---

## Components

Frontend
React + TailwindCSS
Leaflet + OpenStreetMap (replaced Mapbox — free, no API key)
Formik (form state management)
Yup (schema-based validation)
Axios (HTTP client with withCredentials + 401 interceptors)

Backend
Node.js + Express
@upstash/redis (serverless Redis client)
@google/generative-ai (Gemini SDK)
Centralized error-handling (AppError + asyncHandler + errorHandler)
Request validation middleware (Yup schemas)

Database
MongoDB Atlas (travel_ai_db)

Cache
Upstash Redis (serverless, REST-based, free tier)

AI Engine
Gemini 2.5 Flash (free tier, personal Google account)

Authentication
JWT via HttpOnly cookies (accessToken 15min + refreshToken 7day)

---

## Reusable Patterns

Frontend
- FormField, LoadingButton, Toast shared components
- useAuth, useApi custom hooks
- Axios withCredentials + 401 → silent refresh interceptor

Backend
- asyncHandler wraps every async controller (no try/catch)
- AppError class for operational errors
- validate middleware for Yup schema validation
- Global errorHandler as final Express middleware
- Redis service module for cache read/write

---

## Data Flow

User submits AI search form
       |
Axios POST /api/ai/recommend (withCredentials)
       |
validate middleware (Yup) → asyncHandler → ai.controller
       |
Redis cache check → MongoDB check → Gemini API
       |
Save to DB + cache in Redis
       |
JSON response → frontend renders place cards + itinerary
