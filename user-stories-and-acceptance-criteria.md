# User Stories & Acceptance Criteria

## Epic 1: Discover & Browse Destinations
**User Story 1.1:** As a traveler, I want to browse a curated list of top ~20+ destinations in India and the world on the homepage so I can get reliable travel inspiration.
* **AC 1:** Homepage displays a grid of destination cards sourced from the seeded database.
* **AC 2:** Users can filter destinations by the "Best month to visit".

**User Story 1.2:** As a traveler, I want to view detailed information about a destination so I can plan my trip there.
* **AC 1:** Clicking a destination opens a detail page with a hero image, description, and "Best time to visit".
* **AC 2:** The page displays a grid of the "Top 5 Places to Visit".
* **AC 3:** The page displays a grid of the "Top 5 Restaurants".
* **AC 4:** The page displays a grid of the "Top 5 Property Stays".
* **AC 5:** An interactive map component shows the route or points of interest.

## Epic 2: Advanced AI Search (Extra Feature)
**User Story 2.1:** As a trip planner, I want to use AI to search for and find the perfect destination beyond the curated list based on my specific constraints.
* **AC 1:** User accesses the Advanced Search Page.
* **AC 2:** User can input: Location, Budget Range, Travel Length, Travel Style, and Interests.
* **AC 3:** Clicking "Get Recommendations" queries the Gemini AI and returns the recommended destination along with the AI's reasoning.

## Epic 3: User Accounts & Wishlist
**User Story 3.1:** As a user, I want to create an account and log in securely.
* **AC 1:** System provides Registration (Name, Email, Password) and Login endpoints.
* **AC 2:** Registration automatically assigns the "user" role. The frontend UI does not expose any role selection.
* **AC 3:** Successful login issues a JWT.
* **AC 4:** Admin accounts cannot be created via the user-facing UI; they must be manually seeded in the database.

**User Story 3.2:** As a logged-in user, I want to save destinations to a wishlist so I don't lose them.
* **AC 1:** Detailed destination pages include a "Save to Wishlist" button (only visible/active if logged in).
* **AC 2:** User can access a dedicated "Wishlist Page" showing all saved destinations.
* **AC 3:** User can remove destinations from their wishlist.
