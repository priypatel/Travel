# Database Schema

## Overview
The platform utilizes a structured NoSQL approach with MongoDB (`travel_ai_db`). Collections use `ObjectId` referencing for associated entities. AI-generated destinations are persisted alongside manually seeded destinations, identified by the `aiGenerated` flag.

## 1. Users Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (Unique)",
  "password": "String (Hashed)",
  "role": "String (either 'user' or 'admin', default is 'user')",
  "createdAt": "Date"
}
```
*Note: Admins cannot be created via the frontend UI. A manual seed script is required.*

## 2. Destinations Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "slug": "String (Unique, lowercase-hyphen, e.g. 'kashmir-india')",
  "country": "String",
  "description": "String",
  "bestTime": "String (e.g., 'March-October')",
  "heroImage": "String (URL)",
  "tags": ["String"],
  "coordinates": {
    "lat": "Number",
    "lng": "Number"
  },
  "aiGenerated": "Boolean (default: false)",
  "travelPlans": [
    {
      "planName": "String (e.g., 'Classic Kashmir - 4 Days')",
      "days": "Number",
      "placeIds": ["ObjectId (ref: Places)"]
    }
  ],
  "createdAt": "Date"
}
```
*Note: `travelPlans` is populated for AI-generated destinations. Manually seeded destinations may have an empty array.*

## 3. Places Collection
```json
{
  "_id": "ObjectId",
  "destinationId": "ObjectId (ref: Destinations)",
  "name": "String",
  "description": "String",
  "category": "String (e.g., 'Valley', 'Lake', 'City', 'Monument')",
  "image": "String (URL)",
  "coordinates": {
    "lat": "Number",
    "lng": "Number"
  },
  "dayIndex": "Number (which day of the itinerary this place belongs to, 1-based)"
}
```

## 4. Restaurants Collection
```json
{
  "_id": "ObjectId",
  "destinationId": "ObjectId (ref: Destinations)",
  "placeId": "ObjectId (ref: Places, optional — links restaurant to a specific nearby place)",
  "name": "String",
  "cuisine": "String",
  "priceLevel": "String (enum: 'budget' | 'mid-range' | 'luxury')",
  "rating": "Number"
}
```
*Note: `placeId` is set for AI-generated entries to group restaurants near a specific place. For manually seeded destinations, `placeId` may be null.*

## 5. Property Stays Collection
```json
{
  "_id": "ObjectId",
  "destinationId": "ObjectId (ref: Destinations)",
  "placeId": "ObjectId (ref: Places, optional — links stay to a specific nearby place)",
  "name": "String",
  "priceRange": "String (enum: 'budget' | 'mid-range' | 'luxury')",
  "rating": "Number",
  "location": "String (Neighbourhood description)"
}
```

## 6. Wishlist Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "destinationId": "ObjectId (ref: Destinations)",
  "createdAt": "Date"
}
```

## 7. Schema Change Summary (vs Original)

| Collection     | New Fields Added                                        |
|----------------|---------------------------------------------------------|
| Destinations   | `slug`, `aiGenerated`, `tags`, `travelPlans[]`          |
| Places         | `coordinates {lat, lng}`, `dayIndex`                    |
| Restaurants    | `placeId` (optional ref → Places)                       |
| PropertyStays  | `placeId` (optional ref → Places)                       |
