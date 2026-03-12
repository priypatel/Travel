# MVP Technical Document

## Goal

Build a Minimum Viable Product for an AI-powered travel planning system.

---

## Core Features

User authentication

Destination browsing

AI itinerary generation

Interactive map visualization

Admin destination management

---

## Technology Stack

Frontend
React
Tailwind CSS
Mapbox
Formik (form state management)
Yup (declarative schema-based validation)
Axios (HTTP client with interceptors for JWT and error handling)

Backend
Node.js
Express
Centralized error-handling middleware (errorHandler)
Custom AppError class for operational errors
asyncHandler utility (wraps controllers, eliminates try/catch)
validate middleware (validates req.body against Yup schemas)

Database
MongoDB

AI
Gemini API

---

## Folder Structure

project-root

client
server

server
controllers (wrapped by asyncHandler — no manual try/catch)
routes
models
services
middleware (errorHandler, asyncHandler, validate, verifyToken)
utils (AppError class)
validators (Yup schemas for request body validation)

client
components (FormField, LoadingButton, Toast — reusable shared components)
pages
hooks (useAuth, useApi — custom reusable hooks)
validators (Yup schemas for form validation)
api (Axios instance with JWT and 401 interceptors)
store (Redux slices)
utils

---

## Key APIs

POST /api/auth/register (validated by Yup schema middleware)

POST /api/auth/login (validated by Yup schema middleware)

GET /api/destinations

GET /api/destinations/:id

POST /api/ai/itinerary (validated by Yup schema middleware)