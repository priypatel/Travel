# Information Architecture (IA)

The application follows a navigation model built around exploration and AI-powered itinerary recommendations.

## 1. Global Navigation
* **Navbar**: Home, AI Search (`/ai-search`), Wishlist (logged in only), Login/Profile.

## 2. Core Pages

### 2.1 Home Page (`/`)
* **Month Filter**: Filter destinations by best time to visit (Jan–Dec).
* **Destination Card Grid**: Seeded destinations → click links to `/destinations/:id`.

### 2.2 Destination Detail Page (`/destinations/:id`)
* **Header**: Large hero image, Destination Name, description, "Best time to visit" badge.
* **Top Places**: Grid of place cards (name, category, image).
* **Top Restaurants**: Grid of restaurant cards (name, cuisine, priceLevel, rating).
* **Where to Stay**: Grid of property stay cards (name, priceRange, rating).
* **Map Section**: Full-width Leaflet map with colour-coded POI markers (destination, places, restaurants, stays).

### 2.3 Advanced AI Search Page (`/ai-search`)
* **Title**: "Advanced Search — AI Powered"
* **Input Form** (Formik + Yup validation):
  * Location (text) — required
  * Budget Range — required, dropdown (`budget` | `mid-range` | `luxury`)
  * Travel Length (days) — required, number, min 1
  * Travel Style — required, dropdown
  * Interests — required, multi-select tags
* **Validation**: Inline errors below invalid fields on blur/submit.
* **Action**: "Get Recommendations" LoadingButton (spinner during API call).
* **Result Card** (appears below form after response):
  * Destination name + country
  * AI reason paragraph
  * **4–5 Place preview cards** (name, category, day number)
  * "View Full Itinerary →" button → `/ai-destination?name={slug}`
  * "New Search" button to reset form

### 2.4 AI Destination Detail Page (`/ai-destination?name={slug}`)
* **Header**: Gradient hero, destination name, country, description, best time badge.
* **Two Plan Tabs**: e.g. "Classic Kashmir — 4 Days" | "Extended Kashmir — 6 Days"
* **Per-Plan Layout** (active tab):
  * Numbered place cards (Day 1, Day 2, …)
  * Each place card expands or shows inline:
    * **Restaurants near this place** — 2 options closest to user's selected budget
    * **Stays near this place** — 2 options closest to user's selected budget
* **Map Section**: Leaflet map with all place + restaurant + stay markers.
* **Source badge**: shows `"AI Generated"` or `"From Database"`.

### 2.5 Login Page (`/login`)
* Formik + Yup. Inline errors on blur/submit. Error banner for server errors.
* "Sign in" LoadingButton. Link to Register.

### 2.6 Register Page (`/register`)
* Formik + Yup. No role field. "Create account" LoadingButton.

### 2.7 Wishlist Page (`/wishlist`) *(Protected)*
* Grid of saved destination cards. Click to view, "Remove" to delete.
