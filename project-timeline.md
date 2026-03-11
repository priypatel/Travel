# Project Implementation Timeline & AI Prompts

This document outlines the step-by-step development process to build the Travel AI Platform from scratch. Each chronological step includes the work required, its dependencies, the granular details, and a clear prompt you can feed an AI to help you build out that specific chunk of the application.

---

## Step 1: Initialize Monorepo & UI Foundation
*   **Work Done:** Initialization of the root project, setting up the Node `server` and React `client` directories, configuring TailwindCSS, and establishing a single startup script.
*   **Dependencies:** None. This is the starting point.
*   **Required Details:** You need `package.json` configurations tying the apps together using a package like `concurrently`. TailwindCSS must be initialized to use the primary Indigo colors from the UI Design System.
*   **AI Generation Prompt:**
    > "I am starting a new Travel AI Platform using the MERN stack. Create a monorepo setup script and folder structure. I need a root `package.json` that uses `concurrently` to run both client and server. Inside `/server`, set up a basic Express app skeleton. Inside `/client`, initialize a modern React app and install/configure TailwindCSS using Inter font and an Indigo primary color (#4F46E5). Please provide all terminal commands and core configuration files."

---

## Step 2: Database Schema & Authentication
*   **Work Done:** Connecting Express to MongoDB Atlas. Creating the `Users` schema, the JWT login/registration endpoints, and a backend script to seed an Admin.
*   **Dependencies:** Requires Step 1 (Express server running).
*   **Required Details:** Mongoose connections, `bcrypt` for password hashing, `jsonwebtoken` for stateless auth. The registration logic must actively ignore any role requests and hardcode `role="user"`.
*   **AI Generation Prompt:**
    > "Give me the Node.js/Express code to connect to MongoDB Atlas using Mongoose. Then, create a `User` schema matching this shape: `{ name, email, password, role (default 'user') }`. Write two API routes: `POST /api/auth/register` (which strips the role parameter to force 'user' and hashes the password via bcrypt) and `POST /api/auth/login` (which verifies the password and returns a JWT). Also, provide a simple standalone node script I can run to seed a single 'admin' user into the database."

---

## Step 3: Core Data APIs (Destinations)
*   **Work Done**: Creating schemas and GET routes for Destinations, Places, Restaurants, and PropertyStays. Building a seed script to load the core ~20+ Top India and World destinations.
*   **Dependencies**: Requires Step 2 (MongoDB connected).
*   **Required Details**: Mongoose schemas referencing `destinationId`. Express controllers fetching lists and single items, including the month filter logic. The platform mainly revolves around these curated 20+ places.
*   **AI Generation Prompt**:
    > "Based on a NoSQL relational approach, write the Mongoose schemas for `Destination`, `Place`, `Restaurant`, and `PropertyStay`. Then, write Express controllers and routes for: `GET /api/destinations` (supporting an optional `?month=` query parameter filter), `GET /api/destinations/:id`, and specific sub-routes `GET /api/destinations/:id/places`, `GET /api/destinations/:id/restaurants`, and `GET /api/destinations/:id/stays`. Finally, generate a comprehensive data seed script that populates the database with ~20 top destinations in India and the world (e.g., Goa, Paris, Jaipur), along with 5 items for each of their relational collections."

---

## Step 4: Frontend Home Page & Navigation
*   **Work Done:** Building the React Router setup, Navbar, Hero Section, and the Destination Card Grid. Fetching data from the new APIs.
*   **Dependencies:** Requires Step 3 (Destination APIs returning data) and Step 1 (React/Tailwind setup).
*   **Required Details:** Reusable generic `Card` layout. Axios/Fetch integration connecting to `/api/destinations`.
*   **AI Generation Prompt:**
    > "In my React client, set up `react-router-dom`. Create a sticky `Navbar` component with links to Home, Advanced Search, and Wishlist. Next, build the Home Page. It needs a Hero Section taking up 80vh of the screen with a background image and a large 'Discover Your Next Adventure' title. Below that, write a data-fetching component that hits `GET /api/destinations` and renders the results in a responsive TailwindCSS grid using a reusable `DestinationCard` component."

---

## Step 5: Frontend Destination Detail Page
*   **Work Done:** Building the deep-dive page for a specific destination.
*   **Dependencies:** Requires Step 4 (React Router setup).
*   **Required Details:** Extracting the `:id` parameter from the URL, fetching the destination details, then separately fetching its 5 Places, 5 Restaurants, and 5 Stays.
*   **AI Generation Prompt:**
    > "Write a React page component for `DestinationDetail`. It should read the ID from the URL using `useParams()`. On mount, it should fetch `GET /api/destinations/:id`, `.../places`, `.../restaurants`, and `.../stays`. Render a large hero image at the top with the destination description. Create three distinct horizontal scroll or grid sections below for 'Top Places', 'Top Restaurants', and 'Top Stays'. Use subtle framer-motion animations as the data loads in."

---

## Step 6: Backend AI Recommendation Engine
*   **Work Done:** Integrating the Google Gemini API to handle complex travel queries and return a structured JSON response.
*   **Dependencies:** Requires Step 2 (Express set up) and a Google Gemini API Key.
*   **Required Details:** Secure handling of the `GEMINI_API_KEY`. Strict prompt design instructing the LLM to output only JSON containing `{ recommendedDestination, reason }`. Error fallbacks if the LLM hallucinates or times out.
*   **AI Generation Prompt:**
    > "Write a Node.js Express controller for `POST /api/ai/recommend`. It will receive `location`, `budget`, `days`, `travelStyle`, and `interests` in the body. Using the `@google/generative-ai` SDK, construct a prompt evaluating these inputs and strictly ask the model to return a raw JSON object containing exactly `recommendedDestination` (string) and `reason` (string). Parse the text response carefully, handle any potential JSON syntax errors gracefully, and return the payload to the client."

---

## Step 7: Frontend Advanced AI Search UI
*   **Work Done:** Creating the user form to input preferences, handling loading states, and displaying the AI's recommendation.
*   **Dependencies:** Requires Step 6 (AI backend endpoint active).
*   **Required Details:** A visually appealing Tailwind form with dropdowns and tag inputs. A prominent loading spinner/animation, as LLM requests take several seconds.
*   **AI Generation Prompt:**
    > "Build a React page for 'Advanced AI Search'. Create a clean centered form bordered by soft shadows layout requesting: 'Location' (text), 'Budget' (dropdown: Low/Medium/High), 'Travel Length' (number), 'Travel Style' (dropdown), and 'Interests' (text). Add a 'Get Recommendations' button. When clicked, display a prominent loading spinner. It should call `POST /api/ai/recommend` with the form data. Once the request resolves, replace the loader with a visually distinct success card displaying the `recommendedDestination` and `reason`."

---

## Step 8: Mapbox Integration
*   **Work Done:** Adding an interactive geographical map to the Destination Detail page.
*   **Dependencies:** Requires Step 5 (Destination Detail Page) and a Mapbox Public Token.
*   **Required Details:** Mapbox GL JS wrapper in React (e.g., `react-map-gl`). Needs to read the `coordinates` array from the `Destination` object and place markers.
*   **AI Generation Prompt:**
    > "In my React application, add Mapbox integration. Provide a `MapComponent` taking a `center` prop (latitude/longitude) and an array of `markers` props. Implement this at the bottom of the `DestinationDetail` page you wrote earlier. Make sure the map spans the full width of its container, features standard zoom controls, and displays pins for the destination's core location as well as any specific places fetched from the database."

---

## Step 9: Wishlist System & Final Polish
*   **Work Done:** Creating the `Wishlist` DB schema, the protected API routes, and linking the UI buttons.
*   **Dependencies:** Requires Step 2 (Auth/JWT middleware existing) and Step 5 (Destination Page functioning).
*   **Required Details:** Express middleware verifying the `Authorization` header to extract `userId`. A simple join/aggregation logic to return populated Destination cards on the Wishlist page.
*   **AI Generation Prompt:**
    > "First, write an Express middleware called `verifyToken` that checks the JWT authorization header and appends `req.user`. Then, write the `Wishlist` mongoose schema (linking references to User and Destination). Write API routes: `POST /api/wishlist/add`, `GET /api/wishlist`, and `DELETE /api/wishlist/:id` ensuring all routes use `verifyToken`. On the React frontend, create a Context provider to store the user's logged-in state. Update the `DestinationDetail` page to include a 'Save to Wishlist' button that only renders if the context says the user is logged in. Finally, build the '/wishlist' React route mapping out their saved cards based on the GET response."
