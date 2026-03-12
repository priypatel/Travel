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
* **AC 2:** User can input: Location, Budget Range, Travel Length, Travel Style, and Interests via a Formik-managed form.
* **AC 3:** Each field is validated by a Yup schema. Invalid fields show inline error messages on blur and on submit using the `FormField` component.
* **AC 4:** Clicking "Get Recommendations" (a `LoadingButton`) shows a spinner while the API processes.
* **AC 5:** On success, the recommended destination and AI's reasoning are displayed.
* **AC 6:** On server error, a `Toast` notification shows the error message.

## Epic 3: User Accounts & Wishlist
**User Story 3.1:** As a user, I want to create an account and log in securely.
* **AC 1:** System provides Registration (Name, Email, Password) and Login endpoints.
* **AC 2:** Registration automatically assigns the "user" role. The frontend UI does not expose any role selection.
* **AC 3:** Successful login issues a JWT. The Axios instance auto-attaches it to all subsequent requests.
* **AC 4:** Admin accounts cannot be created via the user-facing UI; they must be manually seeded in the database.
* **AC 5:** Login form uses Formik + Yup. Empty email shows "Email is required". Invalid format shows "Invalid email address". Empty password shows "Password is required".
* **AC 6:** Register form uses Formik + Yup. Password < 6 chars shows "Password must be at least 6 characters". Mismatched confirm shows "Passwords do not match".
* **AC 7:** Server errors (e.g., "Email already in use", "Invalid email or password") display in a red banner above the form.
* **AC 8:** All submit buttons use the `LoadingButton` component showing a spinner during API calls.
* **AC 9:** Backend auth controllers use `asyncHandler` — no raw `try/catch`. Validation is handled by Yup schemas via the `validate` middleware.

**User Story 3.2:** As a logged-in user, I want to save destinations to a wishlist so I don't lose them.
* **AC 1:** Detailed destination pages include a "Save to Wishlist" button (only visible/active if logged in).
* **AC 2:** User can access a dedicated "Wishlist Page" showing all saved destinations.
* **AC 3:** User can remove destinations from their wishlist.
* **AC 4:** Adding/removing from wishlist shows a `Toast` notification confirming the action.

## Epic 4: Error Handling & Developer Experience
**User Story 4.1:** As a developer, I want centralized error handling so I don't repeat error logic in every controller.
* **AC 1:** All async controllers are wrapped by `asyncHandler` — no manual `try/catch` anywhere.
* **AC 2:** A custom `AppError` class allows throwing errors with `statusCode` and descriptive `message`.
* **AC 3:** A global `errorHandler` middleware catches all errors and returns a consistent JSON structure: `{ status, message, errors }`.
* **AC 4:** A `validate` middleware validates `req.body` against a Yup schema before the controller runs, returning 400 with field-level error details on failure.
* **AC 5:** Unexpected errors return 500 without leaking stack traces or internal details.

**User Story 4.2:** As a developer, I want reusable frontend components so pages are consistent and easy to build.
* **AC 1:** `FormField` renders a label, styled input, and conditional error message — used across all form pages.
* **AC 2:** `LoadingButton` renders a submit button with configurable text, loading text, and spinner — used across all forms.
* **AC 3:** `Toast` renders dismissible notifications with success/error/info variants.
* **AC 4:** `useAuth` hook provides `login`, `register`, `logout`, `user`, and `token` — encapsulating Redux dispatch logic.
* **AC 5:** Axios instance auto-attaches JWT and handles 401 responses globally.
