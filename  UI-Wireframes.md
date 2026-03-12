# UI Wireframes

## Home Page

Navbar
Search bar
Featured destinations
Popular travel locations

---

## Login Page

Card layout centered on screen

Logo icon (indigo)
Heading: "Welcome back"
Subtitle: "Sign in to continue your journey"

Form (Formik + Yup validation):
- Email input (required, valid email format, inline error on invalid)
- Password input (required, inline error if empty)
- "Sign in" button (LoadingButton — shows spinner during API call)

Error banner (red, appears at top of form if server returns error)

Divider: "or"
Link: "Don't have an account? Create one" → navigates to Register

Tagline: "Discover your next adventure with AI-powered recommendations"

---

## Register Page

Card layout centered on screen

Logo icon (indigo)
Heading: "Create your account"
Subtitle: "Start exploring the world today"

Form (Formik + Yup validation):
- Full name input (required, trimmed, inline error if empty)
- Email input (required, valid email format, inline error on invalid)
- Password input (required, min 6 characters, inline error with hint)
- Confirm password input (required, must match password, inline error on mismatch)
- "Create account" button (LoadingButton — shows spinner during API call)

**No role selection field** — role is always "user"

Error banner (red, appears at top of form if server returns error, e.g. "Email already in use")

Divider: "or"
Link: "Already have an account? Sign in" → navigates to Login

Tagline: "Discover your next adventure with AI-powered recommendations"

---

## Destination Page

Hero image
Destination name
Description
Best time to visit

Section

Top 5 Places to Visit

Grid layout cards

Section

Top 5 Restaurants

Grid layout cards

Section

Top 5 Property Stays

Grid layout cards

Map Section

Interactive route map

---

## Advanced Search Page

Title
Find your perfect destination

Form (Formik + Yup validation):
- Location input (text, required, inline error if empty)
- Budget range (dropdown: Low/Medium/High, required)
- Travel length (number, required, min 1, inline error if invalid)
- Travel style (dropdown, required)
- Interests (text/tags, required, at least 1 item)

Button

Get Recommendations (LoadingButton — shows spinner while AI processes)

AI Response Card

Displays recommendedDestination and reason
Appears after API responds

---

## Wishlist Page

Saved destinations list
Remove from wishlist option