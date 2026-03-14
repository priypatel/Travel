# Environment Configuration

This document outlines the required environment variables to run the application securely.

## 1. Client (`client/.env`)
*   `VITE_API_BASE_URL`: The URL of the Express backend API.
    *   Local: `http://localhost:5000`
    *   Production: `https://api.yourdomain.com`

*Note: Mapbox replaced with Leaflet + OpenStreetMap (free, no token required).*

## 2. Server (`server/.env`)
*   `PORT`: Express port (Default: `5000`).
*   `MONGO_URI`: MongoDB Atlas connection string for `travel_ai_db`.
*   `JWT_SECRET`: Secure string for access tokens (15 min expiry).
*   `JWT_REFRESH_SECRET`: Separate secret for refresh tokens (7 day expiry).
*   `GEMINI_API_KEY`: API key from Google AI Studio (personal Gmail, free tier — 15 RPM, 1500 RPD). Use model `gemini-2.5-flash`.
*   `REDIS_URL`: Upstash Redis REST URL (format: `https://<db>.upstash.io`).
*   `REDIS_TOKEN`: Upstash Redis REST token.
*   `CLIENT_URL`: Allowed CORS origin (e.g., `http://localhost:5173` locally, Vercel URL in production).

## 3. Upstash Redis Setup (Free, No Local Installation)
1. Go to **upstash.com** → sign up free (no credit card)
2. Create a Redis database → select closest region
3. Copy **REST URL** and **REST Token** from the console
4. Add to `server/.env`:
   ```
   REDIS_URL=https://<your-db>.upstash.io
   REDIS_TOKEN=<your-token>
   ```

## 4. Tooling & Security
*   `.gitignore` must exclude all `.env` files.
*   Production on Vercel/Render: set all vars via dashboard before deployment.
*   `NODE_ENV=production` enables `secure` flag on HttpOnly cookies.
