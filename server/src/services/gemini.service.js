import { GoogleGenerativeAI } from '@google/generative-ai';

const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];

async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(key);

  let lastError;
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    } catch (err) {
      lastError = err;
      const msg = err.message || '';
      if (!msg.includes('429') && !msg.includes('404') && !msg.includes('quota') && !msg.includes('not found')) {
        throw err;
      }
    }
  }
  throw lastError;
}

/**
 * Phase 1: Get destination recommendations.
 *
 * LOCATION MODE  (location provided):
 *   Returns 3 different travel-style variants for the same region.
 *   e.g. "Kashmir" → Classic Explorer, Adventure Route, Hidden Gems
 *   Each card has planStyle field; slugs are "{region}-{style}".
 *
 * GLOBAL MODE (no location):
 *   Returns 4 different global destinations (existing behaviour).
 *   planStyle is null.
 */
export async function getTopDestinations({ location, budget, days, travelStyle, interests }) {
  const interestList = Array.isArray(interests) ? interests.join(', ') : interests;
  const hasLocation = location && location.trim();

  let prompt;

  if (hasLocation) {
    const loc = location.trim();
    prompt = `You are an expert travel planner. The traveller wants to explore "${loc}". Budget: ${budget}. Duration: ${days} days. Travel style: ${travelStyle}. Interests: ${interestList}.

Generate 3 different ${days}-day trip styles for "${loc}". Each style highlights different experiences, places, and vibes within "${loc}".

Return ONLY a JSON array with exactly 3 items, no other text:
[
  {
    "destinationName": "${loc}",
    "country": "Sovereign country name",
    "planStyle": "Style name",
    "reason": "2 sentences describing what makes this travel style special for ${loc} and which places/experiences it covers",
    "bestSeason": "Best time to visit (e.g. October to April)",
    "tags": ["tag1", "tag2", "tag3"]
  }
]
Rules:
- All 3 must have "destinationName" exactly as "${loc}"
- "country" must be the sovereign country (e.g. "India" for Kashmir, not "Jammu & Kashmir")
- Each "planStyle" must be DIFFERENT — choose 3 from: Classic Explorer, Adventure Route, Hidden Gems, Cultural Immersion, Luxury Escape, Budget Journey, Nature Retreat, Romantic Getaway, Family Fun — pick styles that best match ${travelStyle} style and ${interestList} interests
- Each "reason" describes DIFFERENT places and experiences within "${loc}"
- "tags" should reflect that specific travel style
- No markdown, no extra text outside the JSON array`;
  } else {
    prompt = `You are an expert travel planner. The traveller is open to anywhere in the world. Budget: ${budget}. Duration: ${days} days. Travel style: ${travelStyle}. Interests: ${interestList}.

Recommend 4 different well-known global destinations from different parts of the world.
For example, suggest "Bali, Indonesia", "Kyoto, Japan", "Santorini, Greece", "Cape Town, South Africa".

Return ONLY a JSON array with exactly 4 items, no other text:
[
  {
    "destinationName": "Specific place name (city, area, or country)",
    "country": "Sovereign country name",
    "reason": "2 sentences on why this destination fits the budget, travel style, and interests",
    "bestSeason": "e.g. October to April",
    "tags": ["tag1", "tag2", "tag3"]
  }
]
Rules:
- All 4 must be DIFFERENT places from different parts of the world
- "country" must always be the sovereign country
- "destinationName" should be a specific well-known place name
- No markdown, no extra text outside the JSON array`;
  }

  const text = await callGemini(prompt);
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw new Error('Gemini returned non-JSON response'); }
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Gemini returned empty destinations list');
  return parsed.map((d) => ({
    destinationName: String(d.destinationName || ''),
    country:         String(d.country || ''),
    planStyle:       d.planStyle ? String(d.planStyle) : null,
    reason:          String(d.reason || ''),
    bestSeason:      String(d.bestSeason || ''),
    tags:            Array.isArray(d.tags) ? d.tags : [],
  }));
}

/**
 * Phase 2: Get full itinerary for ONE destination (called on-demand from detail page).
 * planStyle — optional travel style (e.g. "Adventure Route"). When provided, the
 * itinerary covers multiple places spread across the whole region in that style.
 * Returns { description, coordinates, plans[2] }
 */
// Explicit per-budget price constraints — must match frontend BUDGET_BASE per-day rates
const BUDGET_PRICE_GUIDE = {
  budget:      'stays $15–40/night (hostels, guesthouses, budget hotels), meals $5–15/person, total ~$30–65/day',
  'mid-range': 'stays $65–120/night (3-star hotels, boutique), meals $15–40/person, total ~$90–160/day',
  luxury:      'stays $200–500+/night (5-star hotels, luxury resorts), meals $50–120/person, total ~$260+/day',
};

export async function getFullItinerary(destinationName, budget, days, planStyle = null) {
  const numPlaces = Math.max(3, Math.min(days, 7));
  const budgetLabel = budget === 'budget' ? 'budget-friendly' : budget === 'luxury' ? 'luxury' : 'mid-range';
  const priceGuide = BUDGET_PRICE_GUIDE[budget] || BUDGET_PRICE_GUIDE['mid-range'];

  const styleGuide = planStyle
    ? `Travel style: "${planStyle}". Tailor ALL place selections, restaurants, and stays to match this style:
- Classic Explorer → iconic landmarks, famous sights, must-see spots
- Adventure Route → outdoor activities, treks, hikes, sport activities
- Hidden Gems → offbeat spots, local neighbourhoods, lesser-known places
- Cultural Immersion → temples, museums, history, local cuisine, festivals
- Luxury Escape → premium experiences, fine dining, luxury stays
- Budget Journey → affordable activities, street food, budget-friendly stays
- Nature Retreat → parks, wildlife, forests, scenic landscapes
- Romantic Getaway → scenic spots, sunset views, couple activities
- Family Fun → family-friendly attractions, parks, easy walks`
    : '';

  const regionGuide = planStyle
    ? `Each day must visit a DIFFERENT area or sub-region of "${destinationName}" — spread the itinerary across the whole region, not just one city.`
    : '';

  const plan1Title = planStyle || 'Classic Explorer';
  const plan2Title = planStyle ? `${planStyle} — Alternative` : 'Hidden Gems';

  const prompt = `You are an expert travel guide. Generate a detailed ${days}-day travel itinerary for "${destinationName}" suited for ${budgetLabel} travellers.
Budget constraints (MUST follow): ${priceGuide}
${styleGuide}
${regionGuide}

Return ONLY strict JSON with this exact structure, no markdown:
{
  "description": "3-4 sentence overview of this ${planStyle ? planStyle + ' trip to ' : ''}${destinationName}",
  "coordinates": { "lat": <decimal>, "lng": <decimal> },
  "plans": [
    {
      "title": "${plan1Title}",
      "places": [
        {
          "dayIndex": 1,
          "name": "specific place name within ${destinationName}",
          "category": "Nature|History|Culture|Adventure|Beach|Market|Museum|Temple|Monument|Other",
          "description": "2 sentences about this place",
          "coordinates": { "lat": <decimal>, "lng": <decimal> },
          "restaurants": [
            { "name": "restaurant name", "cuisine": "cuisine type", "priceLevel": "${budget}", "rating": 4.5 },
            { "name": "restaurant name 2", "cuisine": "cuisine type", "priceLevel": "${budget}", "rating": 4.3 }
          ],
          "stays": [
            { "name": "stay name", "type": "Hotel|Resort|Hostel|Boutique|Guesthouse", "priceLevel": "${budget}", "rating": 4.4, "priceRange": "$XX/night" },
            { "name": "stay name 2", "type": "Hotel|Resort|Hostel|Boutique|Guesthouse", "priceLevel": "${budget}", "rating": 4.2, "priceRange": "$XX/night" }
          ]
        }
      ]
    },
    {
      "title": "${plan2Title}",
      "places": []
    }
  ]
}
Rules:
- Plan 1 "${plan1Title}": exactly ${numPlaces} places, dayIndex 1 to ${numPlaces}${planStyle ? `, each place must reflect the "${planStyle}" theme and cover a different part of "${destinationName}"` : ''}
- Plan 2 "${plan2Title}": exactly ${numPlaces} DIFFERENT places, dayIndex 1 to ${numPlaces}
- Each place must have exactly 2 restaurants and 2 stays matching "${budget}" price level
- priceRange in stays MUST match the budget: ${priceGuide}
- All coordinates must be real decimal numbers for the specific location`;

  const text = await callGemini(prompt);
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw new Error('Gemini returned non-JSON for itinerary'); }
  if (!parsed.description || !parsed.coordinates || !Array.isArray(parsed.plans)) {
    throw new Error('Gemini itinerary response missing required fields');
  }
  return parsed;
}
