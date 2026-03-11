# Testing Strategy

## 1. Scope
The testing approach must cover custom logic, relational database fetching, secured routes, and the integration points for AI and mapping.

## 2. Testing Frameworks
*   **Backend**: Jest + Supertest (API behavior and mocked DB calls).
*   **Frontend**: React Testing Library + Jest (Component rendering, Context hooks).
*   **E2E (End-to-End)**: Cypress (Simulating full user journeys).

## 3. High-Priority Backend Tests
### 3.1 Authentication & Security (`auth`, `wishlist`, `rbac`)
*   Ensure `/auth/register` explicitly strips any `role` parameter sent by a malicious client and firmly defaults the new account to `role="user"`.
*   Ensure `/wishlist/add` immediately rejects requests lacking a valid, unexpired Authorization Bearer token (returns 401/403).
*   Ensure tokens properly decode to a valid `userId` reference and role.

### 3.2 Relational Data Fetching
*   Ensure fetching `GET /destinations/:id/places` successfully retrieves the subset of documents attached to the parent destination, preventing full-table scans.

### 3.3 The AI Recommendation Controller
*   **Mocking Gemini**: Since live LLM requests incur latency and potential costs, unit tests for `/ai/recommend` must use `jest.mock()` to fake the Gemini JSON object response. The test should verify the controller successfully parses `{ recommendedDestination, reason }` and handles unexpected formats safely without crashing the server.

## 4. High-Priority Frontend Tests
### 4.1 Component State
*   Ensure the "Save to Wishlist" button toggles visual state conditionally based on Auth Context.
*   Ensure the Advanced Search Form correctly manages the states of inputs (Location, Budget, Time, Style, Interests).

## 5. End-to-End (E2E) Journeys
1.  **AI Search Flow**: User fills out Advanced Form -> Clicks 'Get Recommendations' -> Sees Loading state -> Views the AI's 'recommendedDestination' -> Clicks physical link to navigate to that Destination Detail page.
2.  **Wishlist Flow**: Visitor tries to wishlist -> Redirected to Login -> Logs in -> Returns to Destination -> Clicks Wishlist -> Navigates to Wishlist page -> Sees saved Destination component.
