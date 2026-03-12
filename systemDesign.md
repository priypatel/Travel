# System Design

## Layers

Presentation Layer
React UI components
Formik for form state management
Yup for schema-based validation
Reusable components (FormField, LoadingButton, Toast)
Custom hooks (useAuth, useApi)

Application Layer
Express REST APIs
Centralized errorHandler middleware
asyncHandler utility (no manual try/catch)
AppError custom error class
validate middleware for request body validation

Data Layer
MongoDB database

AI Layer
Gemini AI recommendation engine

Map Layer
Mapbox route visualization

---

## Request Flow

User
 |
React Frontend (Formik form → Yup validation → Axios with JWT interceptor)
 |
Express API (validate middleware → asyncHandler → controller)
 |
MongoDB / AI Service
 |
Response to UI (success JSON or standardized error via errorHandler)

---

## Error Handling Strategy

Frontend
- Yup schemas validate all form inputs before submission
- Axios response interceptors catch 401s globally and redirect to login
- Toast component displays server error messages to users

Backend
- AppError class carries statusCode and isOperational flag
- asyncHandler wraps controllers — eliminates try/catch boilerplate
- validate middleware rejects invalid request bodies with field-level errors
- Global errorHandler formats all errors into a consistent JSON shape

---

## Scalability

Future enhancements

Redis caching
CDN for images
API rate limiting
Load balanced backend