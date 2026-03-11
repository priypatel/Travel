# Environment Configuration

This document outlines the required environment variables to run the application securely.

## 1. Client (`client/.env`)
*   `REACT_APP_API_BASE_URL`: The URL of the Express backend API.
    *   Local: `http://localhost:5000`
    *   Production: `https://api.yourdomain.com`
*   `REACT_APP_MAPBOX_TOKEN`: Public token retrieved from Mapbox Developer console to render maps.

## 2. Server (`server/.env`)
*   `PORT`: The port the Express application boots on (Default: `5000`).
*   `MONGO_URI`: The connection string for the `travel_ai_db` inside MongoDB Atlas.
    *   Must contain authorized user/password credentials.
*   `JWT_SECRET`: A secure string used to salt and sign JSON Web Tokens for authentication and Wishlist route protection.
*   `GEMINI_API_KEY`: API key from Google AI Studio necessary to perform the Advanced AI Searches.

## 3. Tooling & Security
*   `.gitignore` files must rigorously exclude all `.env` files from source control to prevent token leakage.
*   Ensure production instances on Vercel and Render define correct variables via their web dashboard dashboards before deployment.
