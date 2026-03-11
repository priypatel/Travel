Project Overview

The project is an AI-assisted travel recommendation web application built using the MERN stack.
Users can explore destinations, generate AI-based travel itineraries, and visualize travel routes on an interactive map.

The system combines:

traditional backend APIs

AI recommendation services

geographic visualization

to create a modern travel planning experience.

High Level Architecture
Client (React + Map UI)
        |
        v
Node.js / Express API Layer
        |
        +-----------------------+
        |                       |
        v                       v
MongoDB Database          AI Recommendation Service
        |                       |
        v                       v
Destination Data         Gemini / LLM API
Core Components
Frontend (React)

Responsibilities:

user interface

destination browsing

itinerary visualization

map route rendering

user authentication

Key libraries:

React

TailwindCSS

Mapbox GL JS

Backend (Node.js + Express)

Responsibilities:

REST APIs

user authentication

AI itinerary generation

destination management

caching logic

Key modules:

controllers/
routes/
models/
services/
middleware/
Database (MongoDB)

Stores:

users

travel destinations

reviews

AI generated itineraries

cached queries

Example structure:

users
destinations
reviews
itineraries
AI Recommendation Service

Uses an LLM to generate travel recommendations based on:

budget

trip duration

user interests

destination preferences

Example prompt:

Suggest a 3 day travel itinerary in Goa
Budget: ₹15000
Interest: beaches
Return JSON.
Map Visualization

Uses Mapbox to display:

destination markers

travel routes

itinerary locations

Deployment Architecture
Frontend → Vercel
Backend → Render / Railway
Database → MongoDB Atlas
AI API → Gemini Free Tier