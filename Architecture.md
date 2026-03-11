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

Backend
Node.js
Express

Database
MongoDB Atlas

AI Engine
Gemini API

Authentication
JWT

---

## Data Flow

User searches destination
       |
Frontend request
       |
Backend API
       |
MongoDB query or AI service
       |
Response returned to client