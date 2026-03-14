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
 * Phase 1: Get 3-5 destination recommendations (fast, names only).
 * Returns array of { destinationName, country, reason, bestSeason }
 */
export async function getTopDestinations({ location, budget, days, travelStyle, interests }) {
  const interestList = Array.isArray(interests) ? interests.join(', ') : interests;
  const hasLocation = location && location.trim();

  const scope = hasLocation
    ? `The traveller wants to explore WITHIN "${location.trim()}". Recommend 4 different specific places, cities, or sub-regions INSIDE "${location.trim()}" — do NOT go outside this region.`
    : 'The traveller is open to anywhere in the world. Recommend 4 different well-known global destinations.';

  const exampleDestinations = hasLocation
    ? `For example, if the region is "Kashmir" suggest places like "Dal Lake, Srinagar", "Gulmarg", "Pahalgam", "Sonamarg". If "India" suggest "Kerala", "Rajasthan", "Goa", "Ladakh". If "Thailand" suggest "Bangkok", "Chiang Mai", "Phuket", "Koh Samui".`
    : `For example, suggest "Bali, Indonesia", "Kyoto, Japan", "Santorini, Greece", "Cape Town, South Africa".`;

  const prompt = `You are an expert travel planner. ${scope} Budget: ${budget}. Duration: ${days} days. Travel style: ${travelStyle}. Interests: ${interestList}.

${exampleDestinations}

Return ONLY a JSON array with exactly 4 items, no other text:
[
  {
    "destinationName": "Specific place name (city, area, or sub-region)",
    "country": "Sovereign country name",
    "reason": "2 sentences on why this specific place fits the budget, travel style, and interests",
    "bestSeason": "e.g. October to April",
    "tags": ["tag1", "tag2", "tag3"]
  }
]
Rules:
- All 4 must be DIFFERENT places${hasLocation ? ` within or closely associated with "${location.trim()}"` : ' from different parts of the world'}
- "country" must always be the sovereign country (e.g. "India" not "Jammu & Kashmir" or "Kashmir")
- "destinationName" should be a specific well-known place name (e.g. "Gulmarg" not just "Kashmir")
- No markdown, no extra text outside the JSON array`;

  const text = await callGemini(prompt);
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw new Error('Gemini returned non-JSON response'); }
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Gemini returned empty destinations list');
  return parsed.map((d) => ({
    destinationName: String(d.destinationName || ''),
    country: String(d.country || ''),
    reason: String(d.reason || ''),
    bestSeason: String(d.bestSeason || ''),
    tags: Array.isArray(d.tags) ? d.tags : [],
  }));
}

/**
 * Phase 2: Get full itinerary for ONE destination (called on-demand from detail page).
 * Returns { description, coordinates, plans[2] }
 */
export async function getFullItinerary(destinationName, budget, days) {
  const numPlaces = Math.max(3, Math.min(days, 7));
  const budgetLabel = budget === 'budget' ? 'budget-friendly' : budget === 'luxury' ? 'luxury' : 'mid-range';

  const prompt = `You are an expert travel guide. Generate a detailed ${days}-day travel itinerary for "${destinationName}" suited for ${budgetLabel} travellers. Return ONLY strict JSON with this exact structure, no markdown:
{
  "description": "3-4 sentence overview of this destination",
  "coordinates": { "lat": <decimal>, "lng": <decimal> },
  "plans": [
    {
      "title": "Classic Explorer",
      "places": [
        {
          "dayIndex": 1,
          "name": "place name",
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
      "title": "Hidden Gems",
      "places": []
    }
  ]
}
Rules:
- Plan 1 "Classic Explorer": exactly ${numPlaces} places, dayIndex 1 to ${numPlaces}
- Plan 2 "Hidden Gems": exactly ${numPlaces} different places, dayIndex 1 to ${numPlaces}
- Each place must have exactly 2 restaurants and 2 stays matching "${budget}" price level
- All coordinates must be real decimal numbers for the specific location`;

  const text = await callGemini(prompt);
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw new Error('Gemini returned non-JSON for itinerary'); }
  if (!parsed.description || !parsed.coordinates || !Array.isArray(parsed.plans)) {
    throw new Error('Gemini itinerary response missing required fields');
  }
  return parsed;
}
