# Scoring Engine Specification

## 1. AI Recommendation Engine constraints
Unlike traditional "database scoring", the core recommendation power of this application rests within the Gemini Large Language Model. The system performs dynamic "scoring" based on the user's multi-variable inputs against the model's vast global knowledge.

### 1.1 Input Variables
The AI must weigh the following parameters to select a single "Recommended Destination":
1. **Location bounds**: (e.g., 'Europe', 'Within 5 hours of New York').
2. **Budget range**: String constraints (e.g., 'Low', 'Medium', 'Luxury').
3. **Travel length**: Duration affecting feasibility.
4. **Travel style**: Behavioral constraints (e.g., 'Adventurous', 'Relaxing', 'Cultural').
5. **Specific Interests**: (e.g., 'Surfing', 'Architecture').

### 1.2 Prompt Structuring (Backend)
The `AIController` is responsible for building a rigorous prompt template to prevent hallucinated data structures:

> "You are an expert travel planner. The user wants to travel to [Location bounds], has a [Budget] budget, for [Travel Length] days. Their travel style is [Travel Style], and they are specifically interested in [Interests]. Based on these exact constraints, select the single best global destination. You must return your response in strict JSON format containing exactly two keys: 'recommendedDestination' (string) and 'reason' (string, maximum 3 sentences explaining exactly why it fits the budget, style, and interests). Do not include any other markdown formatting."

## 2. Platform Filtering & Internal Querying
For standard browsing:
*   **Month Filter ("Best time to visit")**: The `Destinations` collection stores a `bestTime` string. The backend applies a RegExp or text-index match when the `?month=X` query param is provided to the `GET /destinations` route.
*   **Ranking top entities**: The `rating` field on `Restaurants` and `PropertyStays` dictates the default ascending/descending order when returning the "Top 5" to the destination detail page.
