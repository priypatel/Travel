# System Design

## Layers

Presentation Layer
React UI components
Formik for form state management
Yup for schema-based validation
Reusable components (FormField, LoadingButton, Toast)
Custom hooks (useAuth, useApi)
Leaflet + OpenStreetMap for map visualization

Application Layer
Express REST APIs
Centralized errorHandler middleware
asyncHandler utility (no manual try/catch)
AppError custom error class
validate middleware for request body validation

Cache Layer (NEW)
Upstash Redis (serverless REST-based)
Keys: ai:dest:{slug} (TTL 7d), ai:search:{hash} (TTL 1d)
Eliminates repeated Gemini API calls for same destinations

Data Layer
MongoDB Atlas
Collections: Users, Destinations, Places, Restaurants, PropertyStays, Wishlists
New fields: Destination.slug, Destination.travelPlans[], Place.coordinates, Place.dayIndex
Restaurant.placeId (optional), PropertyStay.placeId (optional)

AI Layer
Gemini 2.5 Flash (free tier via Google AI Studio personal account)
Phase 1 prompt: quick destination name lookup
Phase 2 prompt: full itinerary JSON (2 plans, days-aware, budget-matched places)

---

## Request Flow — AI Search

User fills form (location, budget, days, style, interests)
 |
Formik validates (Yup schema) → Axios POST /api/ai/recommend
 |
Backend hashes params → check Redis ai:search:{hash}
 |
Cache miss → Gemini Phase 1 prompt → get destination name → normalize to slug
 |
Check Redis ai:dest:{slug} → check MongoDB by slug
 |
DB miss → Gemini Phase 2 prompt → parse full JSON
 |
Save to MongoDB (Destination + Places + Restaurants + Stays)
 |
Cache in Redis (ai:dest:{slug} + ai:search:{hash})
 |
Return { destination, plans, source } to client
 |
Frontend shows place preview cards → "View Full Itinerary →" button

---

## Error Handling Strategy

Frontend
- Yup validates all form inputs before submission
- Axios response interceptors: 401 → silent token refresh → retry original request
- Toast component displays server errors

Backend
- AppError class carries statusCode and isOperational flag
- asyncHandler wraps all controllers — no try/catch boilerplate
- validate middleware rejects invalid bodies with field-level errors
- Global errorHandler formats all errors consistently
- Gemini parse failures → AppError(502)

---

## Scalability

Current
- Upstash Redis caching (serverless, free tier)
- MongoDB Atlas indexes on slug, destinationId, userId

Future
- CDN for destination hero images
- API rate limiting (express-rate-limit)
- Load balanced backend (Railway autoscaling)
