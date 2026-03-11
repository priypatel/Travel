# Development Phases

## Phase 1: Foundation Setup (Weeks 1-2)
*   **Objective**: Initialize Monorepo, Database constraints, and Core Authentication.
*   **Tasks**:
    *   Initialize React frontend and Node/Express backend.
    *   Setup MongoDB Atlas `travel_ai_db` and establish Mongoose schemas (Users, Destinations).
    *   Build JWT Authentication (`/auth/register`, `/auth/login`) API enforcing "user" role default, and Client Context without any role selection UI.
    *   Create a backend data seed script to manually provision "admin" accounts into the database.
    *   Implement global Tailwind CSS styling based on the UI-Design-System.

## Phase 2: Core Data Models & Content Pages (Weeks 3-4)
*   **Objective**: Build the main browsing experience focusing on the curated Top 20+ India/World destinations.
*   **Tasks**:
    *   Establish schemas and build a comprehensive seed script to load the ~20+ top destinations along with their Places, Restaurants, and PropertyStays collections.
    *   Build endpoints to query Destinations and singular entities (`/destinations/:id/stays`, etc.).
    *   Implement React UI Wireframes for Home Page and Destination Detail Page.
    *   Implement the Month filter (`?month=x`).

## Phase 3: AI Engine & Map Visualization (Weeks 5-6)
*   **Objective**: Integrate third-party systems to complete the USP (Unique Selling Proposition).
*   **Tasks**:
    *   Implement Gemini API connection (`/ai/recommend`).
    *   Build the Advanced AI Search Form React component.
    *   Integrate Mapbox GL JS on the Destination Detail Page to plot geographical locations of Places, Restaurants, and Stays.
    *   Refine the AI prompt logic.

## Phase 4: User Engagement & Polish (Weeks 7-8)
*   **Objective**: Add personalization features, optimize, and deploy.
*   **Tasks**:
    *   Build Wishlist schema, APIs, and protected React routes.
    *   Implement Framer Motion transitions across the grids.
    *   Conduct end-to-end testing, visual QA, and mobile responsiveness checks.
    *   Deploy React to Vercel and Node to Render/Railway.
