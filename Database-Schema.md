# Database Schema

## Overview
The platform utilizes a structured NoSQL approach with MongoDB (`travel_ai_db`). The collections are heavily relational, utilizing `ObjectId` referencing for associated entities (Places, Restaurants, Property Stays, Wishlists) to avoid massive document bloat on the top-level Destination items.

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

*Note: Admins cannot be created via the frontend UI. A manual database entry or a backend seed script is required to provision an admin account.*
```

## 2. Destinations Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "country": "String",
  "description": "String",
  "bestTime": "String (e.g., 'October-March')",
  "heroImage": "String (URL)",
  "coordinates": { 
    "lat": "Number", 
    "lng": "Number" 
  },
  "createdAt": "Date"
}
```

## 3. Places Collection
```json
{
  "_id": "ObjectId",
  "destinationId": "ObjectId (ref: Destinations)",
  "name": "String",
  "description": "String",
  "category": "String (e.g., 'Monument', 'Beach')",
  "image": "String (URL)"
}
```

## 4. Restaurants Collection
```json
{
  "_id": "ObjectId",
  "destinationId": "ObjectId (ref: Destinations)",
  "name": "String",
  "cuisine": "String",
  "priceLevel": "String (e.g., '$$', '$$$')",
  "rating": "Number"
}
```

## 5. Property Stays Collection
```json
{
  "_id": "ObjectId",
  "destinationId": "ObjectId (ref: Destinations)",
  "name": "String",
  "priceRange": "String",
  "rating": "Number",
  "location": "String (Neighborhood or LatLng structure)"
}
```

## 6. Wishlist Collection
Cross-reference collection allowing users to save their favorite destinations.
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "destinationId": "ObjectId (ref: Destinations)",
  "createdAt": "Date"
}
```