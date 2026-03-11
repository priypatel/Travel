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
* **Input Form**: 
  * Location (Base/Region)
  * Budget Range
  * Travel Length (Days)
  * Travel Style (e.g., Relaxing, Adventurous)
  * Interests (e.g., Beaches, History)
* **Action**: "Get Recommendations" Button.
* **Results Block**: Displays AI chosen destination + textual reasoning.

### 2.4 Wishlist Page (`/wishlist`) *(Protected Route)*
* **List View**: Grid or list of saved destination cards.
* **Interactions**: Click to view destination, or click "Remove" to delete from wishlist.
