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

## Step 2: Database Schema, Authentication & Error Handling Infrastructure
*   **Work Done:** Connecting Express to MongoDB Atlas. Creating the `Users` schema, the JWT login/registration endpoints with centralized error handling, reusable frontend form components, and a backend script to seed an Admin.
*   **Dependencies:** Requires Step 1 (Express server running).
*   **Required Details:** Mongoose connections, `bcrypt` for password hashing, `jsonwebtoken` for stateless auth. The registration logic must actively ignore any role requests and hardcode `role="user"`. All error handling uses centralized middleware. All forms use Formik + Yup.
*   **AI Generation Prompt:**
    > "Give me the Node.js/Express code to connect to MongoDB Atlas using Mongoose. Create a `User` schema: `{ name, email, password, role (default 'user') }`.
    >
    > **Backend error handling infrastructure:**
    > 1. Create `AppError` class in `utils/AppError.js` extending `Error` with `statusCode` and `isOperational` properties.
    > 2. Create `asyncHandler` middleware that wraps async controller functions and catches rejected promises.
    > 3. Create `errorHandler` global middleware (registered last in Express) that formats all errors into `{ status, message, errors }` JSON.
    > 4. Create `validate` middleware that accepts a Yup schema and validates `req.body`, returning 400 with field-level errors on failure.
    > 5. Create Yup validation schemas for register (`name` required, `email` required valid email, `password` required min 6) and login (`email` required, `password` required).
    >
    > Write two API routes: `POST /api/auth/register` (strips role, hashes password, wrapped by `asyncHandler`, validated by Yup schema) and `POST /api/auth/login` (verifies password, returns JWT, wrapped by `asyncHandler`). Controllers must NOT use try/catch — they throw `AppError` instead.
    >
    > **Frontend form infrastructure:**
    > 1. Install Formik and Yup.
    > 2. Create a reusable `FormField` component (label + input + inline error message).
    > 3. Create a reusable `LoadingButton` component (submit button with spinner state).
    > 4. Create Yup validation schemas for Login and Register forms.
    > 5. Build Login and Register pages using Formik, Yup schemas, FormField, and LoadingButton.
    > 6. Create an Axios instance with request interceptor (auto-attach JWT) and response interceptor (handle 401 globally).
    >
    > Also provide a standalone node script to seed a single 'admin' user."

---

## Step 3: Core Data APIs (Destinations)
*   **Work Done**: Creating schemas and GET routes for Destinations, Places, Restaurants, and PropertyStays. Building a seed script to load the core ~20+ Top India and World destinations.
*   **Dependencies**: Requires Step 2 (MongoDB connected, error handling infrastructure in place).
*   **Required Details**: Mongoose schemas referencing `destinationId`. Express controllers wrapped by `asyncHandler`. All new routes use the established error handling patterns.
*   **AI Generation Prompt**:
    > "Based on a NoSQL relational approach, write the Mongoose schemas for `Destination`, `Place`, `Restaurant`, and `PropertyStay`. Then, write Express controllers and routes for: `GET /api/destinations` (supporting an optional `?month=` query parameter filter), `GET /api/destinations/:id`, and specific sub-routes `GET /api/destinations/:id/places`, `GET /api/destinations/:id/restaurants`, and `GET /api/destinations/:id/stays`. Wrap ALL controller functions with `asyncHandler`. Use `AppError` for 404 errors (e.g., destination not found). Finally, generate a comprehensive data seed script that populates the database with ~20 top destinations in India and the world (e.g., Goa, Paris, Jaipur), along with 5 items for each of their relational collections."

---

## Step 4: Frontend Home Page & Navigation
*   **Work Done:** Building the React Router setup, Navbar, Hero Section, and the Destination Card Grid. Fetching data from the new APIs.
*   **Dependencies:** Requires Step 3 (Destination APIs returning data) and Step 1 (React/Tailwind setup).
*   **Required Details:** Reusable generic `Card` layout. Axios instance with JWT interceptors connecting to `/api/destinations`.
*   **AI Generation Prompt:**
    > "In my React client, set up `react-router-dom`. Create a sticky `Navbar` component with links to Home, Advanced Search, and Wishlist. Next, build the Home Page. It needs a Hero Section taking up 80vh of the screen with a background image and a large 'Discover Your Next Adventure' title. Below that, write a data-fetching component using the `useApi` custom hook that hits `GET /api/destinations` via the configured Axios instance and renders the results in a responsive TailwindCSS grid using a reusable `DestinationCard` component."

---

## Step 5: Frontend Destination Detail Page
*   **Work Done:** Building the deep-dive page for a specific destination.
*   **Dependencies:** Requires Step 4 (React Router setup).
*   **Required Details:** Extracting the `:id` parameter from the URL, fetching the destination details, then separately fetching its 5 Places, 5 Restaurants, and 5 Stays using the configured Axios instance.
*   **AI Generation Prompt:**
    > "Write a React page component for `DestinationDetail`. It should read the ID from the URL using `useParams()`. On mount, it should fetch `GET /api/destinations/:id`, `.../places`, `.../restaurants`, and `.../stays` using the Axios instance with JWT interceptors. Render a large hero image at the top with the destination description. Create three distinct horizontal scroll or grid sections below for 'Top Places', 'Top Restaurants', and 'Top Stays'. Use subtle framer-motion animations as the data loads in."

---

## Step 6: Backend AI Recommendation Engine
*   **Work Done:** Integrating the Google Gemini API to handle complex travel queries and return a structured JSON response.
*   **Dependencies:** Requires Step 2 (Express set up with error handling infrastructure) and a Google Gemini API Key.
*   **Required Details:** Secure handling of the `GEMINI_API_KEY`. Strict prompt design. Controller wrapped by `asyncHandler`, request validated by Yup schema middleware.
*   **AI Generation Prompt:**
    > "Write a Node.js Express controller for `POST /api/ai/recommend`, wrapped by `asyncHandler`. It will receive `location`, `budget`, `days`, `travelStyle`, and `interests` in the body (validated by the `validate` middleware with a Yup schema). Using the `@google/generative-ai` SDK, construct a prompt and strictly ask the model to return a raw JSON object containing exactly `recommendedDestination` (string) and `reason` (string). Parse the text response carefully. If parsing fails, throw a new `AppError('Failed to parse AI response', 502)`. Return the payload to the client."

---

## Step 7: Frontend Advanced AI Search UI
*   **Work Done:** Creating the user form to input preferences, handling loading states, and displaying the AI's recommendation.
*   **Dependencies:** Requires Step 6 (AI backend endpoint active).
*   **Required Details:** Formik + Yup form with dropdowns and inputs. LoadingButton with spinner. Toast notifications for errors.
*   **AI Generation Prompt:**
    > "Build a React page for 'Advanced AI Search' using Formik and Yup. Create a Yup schema validating: 'Location' (required string), 'Budget' (required, oneOf: Low/Medium/High), 'Travel Length' (required number, min 1), 'Travel Style' (required string), and 'Interests' (required string). Use `FormField` components for each field. Add a `LoadingButton` that shows a spinner. When submitted, call `POST /api/ai/recommend` via the Axios instance. On success, display the `recommendedDestination` and `reason` in a visually distinct card. On error, show a Toast notification."

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
*   **Required Details:** Express middleware verifying the `Authorization` header. Controllers wrapped by `asyncHandler`. Wishlist add endpoint validated by Yup schema. Toast notifications for add/remove feedback.
*   **AI Generation Prompt:**
    > "First, write an Express middleware called `verifyToken` that checks the JWT authorization header and appends `req.user`. Then, write the `Wishlist` mongoose schema (linking references to User and Destination). Write API routes: `POST /api/wishlist/add` (validated by Yup schema via `validate` middleware), `GET /api/wishlist`, and `DELETE /api/wishlist/:id` — all wrapped by `asyncHandler` and protected by `verifyToken`. On the React frontend, use the `useAuth` custom hook to check login state. Update the `DestinationDetail` page to include a 'Save to Wishlist' button (using `LoadingButton`) that only renders if the user is logged in. Show Toast notifications on success/failure. Finally, build the '/wishlist' React route mapping out their saved cards."
