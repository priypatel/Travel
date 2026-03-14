# Scoring Engine Specification

## 1. AI Recommendation Engine

### 1.1 Input Variables
The AI receives these parameters from the user:
1. **Location bounds**: e.g., 'India', 'Europe', 'Southeast Asia'
2. **Budget**: `'budget'` | `'mid-range'` | `'luxury'`
3. **Travel length**: Number of days (determines number of places returned)
4. **Travel style**: e.g., 'Adventure', 'Relaxing', 'Culture'
5. **Interests**: Array of strings e.g., ['nature', 'photography']

---

### 1.2 Cache & DB Lookup Flow (Before Calling Gemini)

```
POST /api/ai/recommend (params)
  │
  ├─ Hash params → check Redis key: ai:search:{hash}
  │   └─ HIT → return full cached destination data immediately ✓
  │
  ├─ Step 1: Call Gemini (quick prompt) → get destinationName only
  │   → normalize to slug (e.g., "Kashmir, India" → "kashmir-india")
  │
  ├─ Step 2: Check Redis key: ai:dest:{slug}
  │   └─ HIT → cache search hash → return ✓
  │
  ├─ Step 3: Check MongoDB — find Destination by slug
  │   └─ FOUND with travelPlans → cache in Redis → return ✓
  │
  └─ Step 4: Call Gemini FULL prompt → parse → save to MongoDB → cache → return
```

---

### 1.3 Prompt 1 — Quick Destination Name (Step 1)

> "You are a travel expert. A user wants to travel near [Location], budget is [Budget], for [Days] days, travel style: [Style], interests: [Interests]. Return ONLY a strict JSON object with one key: `destinationName` (the single best destination as 'City, Country'). No markdown, no explanation."

---

### 1.4 Prompt 2 — Full Itinerary Detail (Step 4)

Used only when destination is NOT in DB or Redis.

```
You are an expert travel planner. Generate a detailed travel itinerary for [DESTINATION_NAME].
The user has a [BUDGET] budget, [DAYS] days, travel style: [STYLE], interests: [INTERESTS].

Return ONLY a strict JSON object with this exact structure (no markdown, no extra keys):
{
  "destinationName": "string",
  "country": "string",
  "description": "string (2-3 sentences about the destination)",
  "bestTime": "string (e.g., 'March to October')",
  "heroImageQuery": "string (a search query to find a hero image, e.g., 'Kashmir valley landscape')",
  "coordinates": { "lat": number, "lng": number },
  "travelPlans": [
    {
      "planName": "string (e.g., 'Classic [DESTINATION] - [N] Days')",
      "days": number,
      "places": [
        {
          "name": "string (real place name within or near the destination)",
          "description": "string (1-2 sentences)",
          "category": "string (e.g., 'City', 'Valley', 'Lake', 'Beach', 'Monument')",
          "coordinates": { "lat": number, "lng": number },
          "restaurants": [
            {
              "name": "string",
              "cuisine": "string",
              "priceLevel": "budget | mid-range | luxury",
              "rating": number (4.0-5.0)
            }
          ],
          "stays": [
            {
              "name": "string",
              "priceRange": "budget | mid-range | luxury",
              "rating": number (4.0-5.0),
              "location": "string (neighbourhood or area name)"
            }
          ]
        }
      ]
    },
    {
      "planName": "string (alternate plan with different days/places)",
      "days": number,
      "places": [ ... ]
    }
  ]
}

Rules:
- Plan 1: exactly [DAYS] places (one per day). Filter restaurants/stays to match [BUDGET] budget closest.
- Plan 2: an alternate itinerary with 1-2 more days covering additional highlights.
- Each place must have 2 restaurants and 2 stays closest to [BUDGET] (e.g., if budget='mid-range', prefer mid-range options).
- All coordinates must be real, accurate lat/lng values.
- Do not hallucinate place names — use real, well-known locations.
```

---

### 1.5 Budget Matching for Restaurants & Stays

| User Budget | Show first           | Show second   |
|-------------|----------------------|---------------|
| `budget`    | budget               | mid-range     |
| `mid-range` | mid-range            | budget        |
| `luxury`    | luxury               | mid-range     |

The AI prompt instructs Gemini to filter the 2 options per place to closest-fit budget. The frontend displays them in this order.

---

## 2. Platform Filtering & Internal Querying

### Month Filter
The `Destinations` collection stores a `bestTime` string. The backend applies a RegExp match when `?month=X` is provided to `GET /destinations`.

### Redis Caching
- **Key**: `ai:dest:{slug}` → full destination JSON (TTL: 7 days)
- **Key**: `ai:search:{sha256-hash-of-params}` → destination slug (TTL: 1 day)
- **Provider**: Upstash (serverless Redis, free tier — no local Redis required)

### DB Persistence
Once an AI-generated destination is fetched and parsed, it is saved to MongoDB collections:
- `Destination` document with `aiGenerated: true`
- `Place` documents with `destinationId` + `coordinates` + `dayIndex`
- `Restaurant` documents with `destinationId` + `placeId`
- `PropertyStay` documents with `destinationId` + `placeId`
