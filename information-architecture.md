# Information Architecture (IA)

The application follows a straightforward navigation model built around exploration and AI recommendations.

## 1. Global Navigation
* **Navbar**: Contains Links to Home, Advanced Search, Wishlist (If logged in), and Login/Profile.

## 2. Core Pages

### 2.1 Home Page (`/`)
* **Search Bar**: Quick text search for destinations.
* **Month Filter**: Quick filter for best time to visit.
* **Featured Destinations Section**: Hand-picked or highest-rated destinations.
* **Popular Travel Locations Section**: Trending destinations grid.

### 2.2 Destination Detail Page (`/destinations/:id`)
* **Header Area**: Large hero image, Destination Name, descriptive paragraph, and "Best time to visit" badge.
* **Top 5 Places to Visit**: Grid layout highlighting key attractions and POIs.
* **Top 5 Restaurants**: Grid layout highlighting top-rated dining options.
* **Top 5 Property Stays**: Grid layout highlighting accommodations.
* **Map Section**: Full-width interactive map showing the destination and plotting the associated restaurants/places.

### 2.3 Advanced AI Search Page (`/ai-search`) [Extra Feature]
* **Title**: "Find your perfect destination (AI Powered)"
* **Input Form** (Formik + Yup validation): 
  * Location (Base/Region) — required
  * Budget Range — required, dropdown (Low/Medium/High)
  * Travel Length (Days) — required, number, min 1
  * Travel Style (e.g., Relaxing, Adventurous) — required
  * Interests (e.g., Beaches, History) — required, at least 1
* **Validation Behavior**: Inline error messages appear below invalid fields on blur and on submit. Fields with errors show a red border.
* **Action**: "Get Recommendations" LoadingButton (shows spinner during API call).
* **Results Block**: Displays AI chosen destination + textual reasoning.

### 2.4 Login Page (`/login`)
* **Form** (Formik + Yup validation):
  * Email — required, valid email format
  * Password — required
* **Validation Behavior**: Inline errors on blur/submit. Server errors (e.g., "Invalid email or password") shown in a red banner above the form.
* **Action**: "Sign in" LoadingButton.
* **Navigation**: Link to Register page.

### 2.5 Register Page (`/register`)
* **Form** (Formik + Yup validation):
  * Full name — required
  * Email — required, valid email format
  * Password — required, min 6 characters
  * Confirm password — required, must match password
* **Validation Behavior**: Inline errors on blur/submit. No role selection field rendered.
* **Action**: "Create account" LoadingButton.
* **Navigation**: Link to Login page.

### 2.6 Wishlist Page (`/wishlist`) *(Protected Route)*
* **List View**: Grid or list of saved destination cards.
* **Interactions**: Click to view destination, or click "Remove" to delete from wishlist.
