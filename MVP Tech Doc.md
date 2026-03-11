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

Backend
Node.js
Express

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
controllers
routes
models
services

client
components
pages
utils

---

## Key APIs

POST /api/auth/register

POST /api/auth/login

GET /api/destinations

GET /api/destinations/:id

POST /api/ai/itinerary