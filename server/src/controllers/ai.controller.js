import crypto from 'crypto';
import asyncHandler from '../middleware/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { getTopDestinations, getFullItinerary } from '../services/gemini.service.js';
import { redisGet, redisSet } from '../services/redis.service.js';
import Destination from '../models/Destination.model.js';

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function searchHash(payload) {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(payload))
    .digest('hex')
    .slice(0, 16);
}

// POST /api/ai/recommend
// Phase 1: returns 3 style-variant cards (location mode) or 4 global cards (blank mode)
export const recommend = asyncHandler(async (req, res) => {
  const { location, budget, days, travelStyle, interests } = req.body;

  // v3 cache key — v3 adds planStyle to response shape
  const hash = searchHash({ location, budget, days, travelStyle, interests });
  const searchCacheKey = `ai:search:v3:${hash}`;
  const cached = await redisGet(searchCacheKey);
  if (cached) {
    return res.status(200).json({ status: 'success', data: { destinations: cached, source: 'cache' } });
  }

  let destinations;
  try {
    const raw = await getTopDestinations({ location, budget, days, travelStyle, interests });

    // Slug: location mode → "{region}-{style}", global mode → "{destination}"
    const withSlugs = raw.map((d) => ({
      ...d,
      slug: d.planStyle
        ? toSlug(`${d.destinationName}-${d.planStyle}`)
        : toSlug(`${d.destinationName}`),
    }));

    // Upsert lightweight DB entries so each card gets a real _id for wishlisting
    destinations = await Promise.all(
      withSlugs.map(async (d) => {
        const doc = await Destination.findOneAndUpdate(
          { slug: d.slug },
          {
            $setOnInsert: {
              name: d.destinationName,
              country: d.country,
              slug: d.slug,
              description: d.reason,
              bestTime: d.bestSeason,
              tags: d.tags || [],
              heroImage: '',
              aiGenerated: true,
              planStyle: d.planStyle || '',
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        return { ...d, _id: String(doc._id) };
      })
    );
  } catch (err) {
    throw new AppError(err.message || 'AI recommendation failed. Please try again.', 502);
  }

  // Cache search result (1d)
  await redisSet(searchCacheKey, destinations, 86400);

  res.status(200).json({ status: 'success', data: { destinations, source: 'ai' } });
});

// GET /api/ai/destination/:slug?budget=mid-range&days=5&name=...&style=...
// Phase 2 on demand: returns full itinerary for one destination
export const getDestinationBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { budget = 'mid-range', days = 5, name, style } = req.query;
  if (!slug) throw new AppError('Slug is required', 400);

  // v2 cache key — versioned to avoid serving stale pre-upsert cached docs
  const destCacheKey = `ai:dest:v2:${slug}`;
  const cached = await redisGet(destCacheKey);
  if (cached) {
    return res.status(200).json({
      status: 'success',
      data: { destination: cached, plans: cached.travelPlans, source: 'cache' },
    });
  }

  // Resolve destination name from query param or slug
  const destinationName = name
    ? decodeURIComponent(name)
    : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const planStyle = style ? decodeURIComponent(style) : null;

  // Check MongoDB — may find a Phase 1 stub (no travelPlans) or a full doc
  let destination = await Destination.findOne({ slug, aiGenerated: true });

  // Generate if: doc doesn't exist, OR it's a Phase 1 stub with no itinerary
  if (!destination || !destination.travelPlans?.length) {
    let itinerary;
    try {
      itinerary = await getFullItinerary(destinationName, budget, Number(days), planStyle);
    } catch (err) {
      throw new AppError(err.message || 'Failed to generate itinerary.', 502);
    }

    const nameParts = destinationName.split(',');
    const destName = nameParts[0].trim();
    const destCountry = nameParts[1]?.trim() || '';
    if (!destName || destName.toLowerCase() === 'undefined') {
      throw new AppError('Invalid destination name returned by AI', 502);
    }

    if (destination) {
      // Update the Phase 1 stub in-place — preserves the same _id (critical for wishlist matching)
      destination = await Destination.findByIdAndUpdate(
        destination._id,
        {
          $set: {
            name: destName || destination.name,
            country: destCountry || destination.country,
            description: itinerary.description,
            coordinates: itinerary.coordinates,
            travelPlans: itinerary.plans,
          },
        },
        { new: true }
      );
    } else {
      destination = await Destination.create({
        name: destName,
        country: destCountry,
        slug,
        description: itinerary.description,
        coordinates: itinerary.coordinates,
        travelPlans: itinerary.plans,
        aiGenerated: true,
        planStyle: planStyle || '',
        bestTime: '',
        heroImage: '',
        tags: [],
      });
    }
  }

  // Cache 7d
  await redisSet(destCacheKey, destination.toObject(), 604800);

  res.status(200).json({
    status: 'success',
    data: { destination, plans: destination.travelPlans, source: 'ai' },
  });
});
