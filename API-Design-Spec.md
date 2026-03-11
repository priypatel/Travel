# API Design Specification

Base URL
/api

---

Auth APIs

POST /auth/register
POST /auth/login

---

Destination APIs

GET /destinations
GET /destinations/:id

---

Places APIs

GET /destinations/:id/places

---

Restaurant APIs

GET /destinations/:id/restaurants

---

Property APIs

GET /destinations/:id/stays

---

Wishlist APIs

POST /wishlist/add
GET /wishlist
DELETE /wishlist/:id

Authentication required

---

AI Recommendation

POST /ai/recommend

Request

{
 location
 budget
 days
 travelStyle
 interests
}

Response

{
 recommendedDestination
 reason
}