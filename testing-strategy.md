# Testing Strategy

## 1. Scope
The testing approach must cover custom logic, relational database fetching, secured routes, the integration points for AI and mapping, centralized error handling, and form validation.

## 2. Testing Frameworks
*   **Backend**: Jest + Supertest (API behavior and mocked DB calls).
*   **Frontend**: React Testing Library + Jest (Component rendering, Context hooks).
*   **E2E (End-to-End)**: Cypress (Simulating full user journeys).

## 3. High-Priority Backend Tests
### 3.1 Authentication & Security (`auth`, `wishlist`, `rbac`)
*   Ensure `/auth/register` explicitly strips any `role` parameter sent by a malicious client and firmly defaults the new account to `role="user"`.
*   Ensure `/wishlist/add` immediately rejects requests lacking a valid, unexpired Authorization Bearer token (returns 401/403).
*   Ensure tokens properly decode to a valid `userId` reference and role.

### 3.2 Centralized Error Handling
*   Ensure the `asyncHandler` properly catches rejected promises and forwards errors to `errorHandler`.
*   Ensure `AppError` instances produce the correct `statusCode` and `message` in the response.
*   Ensure the `validate` middleware returns 400 with field-level error details when `req.body` fails Yup schema validation.
*   Ensure unknown/unexpected errors return a generic 500 response without leaking stack traces or internal details.

### 3.3 Request Validation (Yup Schemas)
*   Ensure `/auth/register` rejects missing `name`, `email`, or `password` with a 400 and field-specific error messages.
*   Ensure `/auth/register` rejects invalid email formats.
*   Ensure `/auth/register` rejects passwords shorter than 6 characters.
*   Ensure `/auth/login` rejects missing `email` or `password`.
*   Ensure `/ai/recommend` rejects missing or invalid fields (budget not in allowed values, days < 1, empty interests).

### 3.4 Relational Data Fetching
*   Ensure fetching `GET /destinations/:id/places` successfully retrieves the subset of documents attached to the parent destination, preventing full-table scans.

### 3.5 The AI Recommendation Controller
*   **Mocking Gemini**: Since live LLM requests incur latency and potential costs, unit tests for `/ai/recommend` must use `jest.mock()` to fake the Gemini JSON object response. The test should verify the controller successfully parses `{ recommendedDestination, reason }` and handles unexpected formats safely by throwing an `AppError(502)` without crashing the server.

## 4. High-Priority Frontend Tests
### 4.1 Form Validation (Formik + Yup)
*   Ensure the Login form shows inline error messages for empty email and password on submit.
*   Ensure the Login form shows "Invalid email address" for malformed emails.
*   Ensure the Register form shows "Passwords do not match" when password and confirm fields differ.
*   Ensure the Register form shows "Password must be at least 6 characters" for short passwords.
*   Ensure the AI Search form validates all required fields with appropriate messages.

### 4.2 Reusable Components
*   Ensure `FormField` renders label, input, and error message correctly.
*   Ensure `LoadingButton` shows spinner when `isLoading={true}` and disables click.
*   Ensure `Toast` displays success/error/info variants with correct styling.

### 4.3 Component State
*   Ensure the "Save to Wishlist" button toggles visual state conditionally based on Auth Context.
*   Ensure the Advanced Search Form correctly manages the states of inputs (Location, Budget, Time, Style, Interests) via Formik.

## 5. End-to-End (E2E) Journeys
1.  **AI Search Flow**: User fills out Formik form → Yup validates → Clicks 'Get Recommendations' → Sees LoadingButton spinner → Views the AI's 'recommendedDestination' → Clicks physical link to navigate to that Destination Detail page.
2.  **Wishlist Flow**: Visitor tries to wishlist → Redirected to Login → Fills Formik login form → Yup validates → Logs in → Returns to Destination → Clicks Wishlist → Toast shows success → Navigates to Wishlist page → Sees saved Destination component.
3.  **Validation Flow**: User submits empty Login form → Inline Yup errors appear on all fields → User corrects email only → Password error remains → User submits with wrong credentials → Server error banner appears → User corrects → Successful login.
