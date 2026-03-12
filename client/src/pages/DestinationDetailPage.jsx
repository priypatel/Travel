import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDestinationDetail, clearDetail } from '../store/slices/destinationSlice';

// ─── Sub-cards ────────────────────────────────────────────────────────────────

function PlaceCard({ place }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img
        src={place.image}
        alt={place.name}
        className="w-full h-40 object-cover"
        loading="lazy"
      />
      <div className="p-3">
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          {place.category}
        </span>
        <h4 className="text-sm font-bold text-[#0F172A] mt-2 mb-1">{place.name}</h4>
        <p className="text-xs text-gray-500 line-clamp-2">{place.description}</p>
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant }) {
  const stars = Math.round(restaurant.rating);
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex gap-3">
      <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-sm font-bold text-[#0F172A] leading-tight">{restaurant.name}</h4>
          <span className="text-xs text-gray-400 shrink-0">{restaurant.priceLevel}</span>
        </div>
        <p className="text-xs text-gray-500 mb-1">{restaurant.cuisine}</p>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${i < stars ? 'text-amber-400' : 'text-gray-200'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-400 ml-1">{restaurant.rating}</span>
        </div>
      </div>
    </div>
  );
}

function StayCard({ stay }) {
  const stars = Math.round(stay.rating);
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex gap-3">
      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-sm font-bold text-[#0F172A] leading-tight">{stay.name}</h4>
          <span className="text-xs text-gray-400 shrink-0">{stay.priceRange}</span>
        </div>
        <p className="text-xs text-gray-500 mb-1">{stay.location}</p>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${i < stars ? 'text-amber-400' : 'text-gray-200'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-400 ml-1">{stay.rating}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon, children }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">{icon}</span>
        <h2 className="text-xl font-bold text-[#0F172A]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DestinationDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { detail, places, restaurants, stays, loading, error } = useSelector(
    (state) => state.destinations
  );

  useEffect(() => {
    dispatch(getDestinationDetail(id));
    return () => dispatch(clearDetail());
  }, [dispatch, id]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="h-[60vh] bg-gray-200 animate-pulse" />
        <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !detail) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
            {error || 'Destination not found'}
          </h2>
          <Link to="/" className="text-indigo-600 text-sm hover:underline">
            ← Back to destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <img
          src={detail.heroImage}
          alt={detail.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 pb-10 w-full">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All destinations
          </Link>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">{detail.name}</h1>
              <p className="text-white/80 mt-1 text-lg">{detail.country}</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-1">
              <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                🗓 Best: {detail.bestTime}
              </span>
              {detail.tags?.map((tag) => (
                <span key={tag} className="bg-indigo-600/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-10">
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">About {detail.name}</h2>
          <p className="text-gray-600 leading-relaxed">{detail.description}</p>
        </div>

        {/* Map placeholder */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-10">
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-sm font-medium">
                Interactive map coming soon
              </p>
              <p className="text-xs mt-1">
                Coords: {detail.coordinates?.lat}, {detail.coordinates?.lng}
              </p>
            </div>
          </div>
        </div>

        {/* Places */}
        <Section title="Top Places to Visit" icon="🏛">
          {places.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {places.map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No places listed yet.</p>
          )}
        </Section>

        {/* Restaurants */}
        <Section title="Top Restaurants" icon="🍽">
          {restaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map((r) => (
                <RestaurantCard key={r._id} restaurant={r} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No restaurants listed yet.</p>
          )}
        </Section>

        {/* Stays */}
        <Section title="Where to Stay" icon="🏨">
          {stays.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stays.map((s) => (
                <StayCard key={s._id} stay={s} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No stays listed yet.</p>
          )}
        </Section>
      </div>
    </div>
  );
}
