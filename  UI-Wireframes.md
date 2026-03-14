# UI Wireframes

## Home Page
Navbar
Month filter bar (Jan–Dec buttons)
Destination card grid
Loading skeleton while fetching

---

## Login Page
Card layout centered on screen
Logo icon (indigo)
Heading: "Welcome back"
Form (Formik + Yup): Email, Password
LoadingButton: "Sign in"
Error banner (red, server errors)
Link: "Don't have an account? Create one"

---

## Register Page
Card layout centered on screen
Logo icon (indigo)
Heading: "Create your account"
Form (Formik + Yup): Name, Email, Password, Confirm Password
**No role selection field**
LoadingButton: "Create account"
Error banner (server errors)
Link: "Already have an account? Sign in"

---

## Destination Detail Page (`/destinations/:id`)
Hero image (full width) — destination name + country overlay
Description paragraph
Best time to visit badge

Section: Top Places to Visit
Horizontal card row (name, category, image)

Section: Top Restaurants
Horizontal card row (name, cuisine, priceLevel, rating)

Section: Where to Stay
Horizontal card row (name, priceRange, rating)

Map Section
Full-width Leaflet map (350px height)
Colour-coded markers: indigo=destination, green=places, cyan=restaurants, purple=stays
Legend below map

---

## Advanced Search Page (`/ai-search`)

Title: "Advanced Search"
Subtitle: "Get personalized travel recommendations based on your preferences"

Form card (Formik + Yup):
- Location input (optional text, placeholder: "Enter city/country or leave blank for 'anywhere'")
- Budget Range (dropdown: Budget / Mid-Range / Luxury)
- Travel Length (number, min 1)
- Travel Style (dropdown: Adventure / Culture / Relaxing / Nature / Food / Shopping)
- Interests (multi-select pill tags: Nature, Photography, History, Food, Nightlife, Shopping, Art, Music)
LoadingButton: "Get Recommendations"

Result Card (appears below form after response):
- Label: "AI RECOMMENDATION"
- Destination name + country (large)
- AI reason paragraph
- Place preview cards (4-5 cards in horizontal scroll):
  - Day number badge
  - Place name
  - Category chip
- CTA buttons: "View Full Itinerary →" | "New Search"

---

## AI Destination Detail Page (`/ai-destination?name={slug}`)

Hero gradient banner (indigo→cyan)
Destination name (large) + country
Description
Best time badge | AI Generated badge

Plan Tabs (2 tabs):
  Tab 1: "Classic [Name] — N Days"
  Tab 2: "Extended [Name] — N Days"

Active Plan Content:
  For each place (Day 1, Day 2, ...):
    Place header card (name, category, day badge, description)
    
    Sub-section: Restaurants Near [Place Name]
      2 restaurant cards (closest budget match first)
      Card: name | cuisine | priceLevel chip | rating stars
    
    Sub-section: Where to Stay Near [Place Name]
      2 stay cards (closest budget match first)
      Card: name | priceRange chip | rating | location

Map Section:
  Full-width Leaflet map
  All place markers (green) + restaurant markers (cyan) + stay markers (purple)
  Legend below

---

## Wishlist Page (`/wishlist`)
Protected route — redirect to login if unauthenticated
Grid of saved destination cards
"Remove" button on each card
Empty state: "No saved destinations yet — explore and save your favourites"
