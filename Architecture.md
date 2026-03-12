# Architecture

## High Level Architecture

Client (React)
        |
        v
Node.js Express API
        |
        +------------------------+
        |                        |
        v                        v
MongoDB Database           AI Recommendation API
        |
        v
Mapbox Route Service

---

## Components

Frontend
React
TailwindCSS
Mapbox GL JS
Formik (form state management)
Yup (schema-based validation)
Axios (HTTP client with interceptors)

Backend
Node.js
Express
Centralized error-handling middleware (AppError + asyncHandler)
Request validation middleware (Yup schemas)

Database
MongoDB Atlas

AI Engine
Gemini API

Authentication
JWT

---

## Reusable Patterns

Frontend
- Shared form components (FormField, LoadingButton)
- Custom hooks (useAuth, useApi)
- Axios interceptors for JWT token injection and 401 handling

Backend
- asyncHandler wraps every async controller (no manual try/catch)
- AppError class for operational errors with status codes
- validate middleware to validate request bodies against Yup schemas
- Global errorHandler as the final Express middleware

---

## Data Flow

User searches destination
       |
Frontend request (Axios + JWT interceptor)
       |
Backend API (validate middleware → controller → asyncHandler)
       |
MongoDB query or AI service
       |
Response returned to client (or error caught by errorHandler)