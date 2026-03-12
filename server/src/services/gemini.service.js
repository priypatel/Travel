import { GoogleGenerativeAI } from '@google/generative-ai';

// Models to try in order — fallback if one has quota issues
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];

async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  console.log(`[Gemini] Using key: ${key ? key.slice(0, 8) + '...' : 'NOT SET'}`);
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
 * Calls Gemini with a strict prompt and returns { recommendedDestination, reason }.
 * Tries multiple models in order until one succeeds.
 */
export async function getRecommendation({ location, budget, days, travelStyle, interests }) {
  const interestList = Array.isArray(interests) ? interests.join(', ') : interests;
  const locationText = location && location.trim() ? location.trim() : 'anywhere in the world';

  const prompt = `You are an expert travel planner. The user wants to travel to ${locationText}, has a ${budget} budget, for ${days} days. Their travel style is ${travelStyle}, and they are specifically interested in ${interestList}. Based on these exact constraints, select the single best global destination. You must return your response in strict JSON format containing exactly two keys: "recommendedDestination" (string, the destination name and country, e.g. "Santorini, Greece") and "reason" (string, maximum 3 sentences explaining exactly why it fits the budget, style, and interests). Do not include any other text or markdown formatting outside the JSON object.`;

  const text = await callGemini(prompt);
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Gemini returned non-JSON response');
  }
  if (!parsed.recommendedDestination || !parsed.reason) {
    throw new Error('Gemini response missing required fields');
  }
  return {
    recommendedDestination: String(parsed.recommendedDestination),
    reason: String(parsed.reason),
  };
}

export async function getDestinationDetails(destinationName) {
  const prompt = `You are an expert travel guide. Generate detailed travel information for "${destinationName}". Return ONLY strict JSON with this exact structure, no other text:
{
  "description": "3-4 sentence overview of this destination covering its culture, climate, and what makes it special",
  "coordinates": { "lat": <decimal latitude>, "lng": <decimal longitude> },
  "places": [
    { "name": "place name", "category": "Nature|History|Culture|Adventure|Entertainment", "description": "2 sentences about this place" },
    { "name": "...", "category": "...", "description": "..." },
    { "name": "...", "category": "...", "description": "..." },
    { "name": "...", "category": "...", "description": "..." },
    { "name": "...", "category": "...", "description": "..." }
  ],
  "restaurants": [
    { "name": "restaurant name", "cuisine": "cuisine type", "rating": <4.0-5.0>, "priceLevel": "$|$$|$$$|$$$$" },
    { "name": "...", "cuisine": "...", "rating": 0, "priceLevel": "$$" },
    { "name": "...", "cuisine": "...", "rating": 0, "priceLevel": "$$" },
    { "name": "...", "cuisine": "...", "rating": 0, "priceLevel": "$$" },
    { "name": "...", "cuisine": "...", "rating": 0, "priceLevel": "$$" }
  ],
  "stays": [
    { "name": "hotel name", "type": "Hotel|Resort|Hostel|Boutique", "rating": <4.0-5.0>, "priceRange": "$XX/night" },
    { "name": "...", "type": "...", "rating": 0, "priceRange": "..." },
    { "name": "...", "type": "...", "rating": 0, "priceRange": "..." },
    { "name": "...", "type": "...", "rating": 0, "priceRange": "..." },
    { "name": "...", "type": "...", "rating": 0, "priceRange": "..." }
  ]
}`;

  const text = await callGemini(prompt);
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Gemini returned non-JSON response for destination details');
  }
  if (!parsed.description || !parsed.coordinates || !parsed.places || !parsed.restaurants || !parsed.stays) {
    throw new Error('Gemini destination details response missing required fields');
  }
  return parsed;
}
