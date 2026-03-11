# API Design Specification

Base URL

http://localhost:5000/api

---

## Authentication

POST /auth/register

Request

{
 "name": "User",
 "email": "user@example.com",
 "password": "password"
}

Response

{
 "success": true,
 "token": "jwt_token"
}

---

POST /auth/login

Request

{
 "email": "user@example.com",
 "password": "password"
}

Response

{
 "token": "jwt_token"
}

---

## Destinations

GET /destinations

GET /destinations/:id

POST /destinations

Example Response

{
 "name": "Baga Beach",
 "city": "Goa",
 "rating": 4.6,
 "lat": 15.5553,
 "lng": 73.7517
}

---

## AI Itinerary

POST /ai/itinerary

Request

{
 "city": "Goa",
 "days": 3,
 "budget": 15000,
 "interest": ["beach"]
}

Response

{
 "day1": ["Baga Beach","Fort Aguada"],
 "day2": ["Anjuna Beach","Chapora Fort"]
}