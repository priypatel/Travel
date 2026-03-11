# Product Requirements Document (PRD)

## 1. Product Overview
The platform is a travel discovery application primarily showcasing a curated list of ~20+ top destinations in India and the world. Alongside this main browsing experience, it offers "extra features" such as user authentication, interactive maps, and a powerful AI recommendation engine for users who want to search beyond the curated list or get highly personalized travel suggestions.

## 2. Target Audience
* **Travel enthusiasts** seeking new experiences
* **Solo travelers** looking for curated recommendations
* **Couples** planning targeted getaways
* **Trip planners** organizing complex itineraries

## 3. Core Features
1. **Curated Destination Listing**: The main experience. Users can browse a hand-picked, seeded database of ~20+ top travel destinations (focused on India and popular world locations).
2. **Destination Detail Page**: Rich pages for each destination containing:
   * Hero image & Description
   * Best time to visit
   * Top 5 places to visit
   * Top 5 restaurants
   * Top 5 property stays
3. **Wishlist**: Authenticated users can bookmark/save destinations to their personal wishlist for future reference.
4. **Advanced AI Search (Extra Feature)**: A powerful recommendation engine serving as an advanced search/fallback. If a user wants specific recommendations beyond the 20+ curated places, they provide preferences:
   * Location
   * Budget
   * Travel days
   * Travel style
   * Interests
   * *Output*: AI recommends the absolute best destination match with a detailed reasoning.
5. **Map Visualization**: Visualizing destination routes and nearby places/POI (Points of Interest) on an interactive map.
6. **Month Filter**: Allows users to filter the curated travel destinations by the best visiting months.
7. **Role-Based Access**: The system supports "user" and "admin" roles. Regular users are created via the frontend (which defaults to "user" role with no option to change it). Admin accounts cannot be created via the UI and must be manually seeded.

## 4. Success Metrics
* **User Engagement**: Session length and interaction rates.
* **AI Search Usage**: Number of queries run through the Advanced AI Search.
* **Wishlist Saves**: Number of destinations bookmarked by authenticated users.
* **Destination Page Views**: Traffic volume on individual destination detail pages.
