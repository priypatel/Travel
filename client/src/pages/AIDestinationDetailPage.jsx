import { useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAIDestinationDetails, clearAIDetail } from '../store/slices/aiSlice';

// Category → color mapping for place cards
const CATEGORY_COLORS = {
  Nature:        { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: '🌿' },
  History:       { bg: 'bg-amber-50',   text: 'text-amber-600',   icon: '🏛' },
  Culture:       { bg: 'bg-purple-50',  text: 'text-purple-600',  icon: '🎭' },
  Adventure:     { bg: 'bg-orange-50',  text: 'text-orange-600',  icon: '⛰' },
  Entertainment: { bg: 'bg-pink-50',    text: 'text-pink-600',    icon: '🎪' },
};

function PlaceCard({ place }) {
  const colors = CATEGORY_COLORS[place.category] || { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: '📍' };
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-full h-32 ${colors.bg} flex items-center justify-center text-4xl`}>
        {colors.icon}
      </div>
      <div className="p-3">
        <span className={`text-xs font-medium ${colors.text} ${colors.bg} px-2 py-0.5 rounded-full`}>
          {place.category}
        </span>
        <h4 className="text-sm font-bold text-[#0F172A] mt-2 mb-1">{place.name}</h4>
        <p className="text-xs text-gray-500 line-clamp-3">{place.description}</p>
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant }) {
  const stars = Math.round(restaurant.rating);
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex gap-3">
      <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0 text-lg">
        🍽
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-sm font-bold text-[#0F172A] leading-tight">{restaurant.name}</h4>
          <span className="text-xs text-gray-400 shrink-0">{restaurant.priceLevel}</span>
        </div>
        <p className="text-xs text-gray-500 mb-1">{restaurant.cuisine}</p>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className={`w-3 h-3 ${i < stars ? 'text-amber-400' : 'text-gray-200'}`}
              fill="currentColor" viewBox="0 0 20 20">
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
      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 text-lg">
        🏨
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-sm font-bold text-[#0F172A] leading-tight">{stay.name}</h4>
          <span className="text-xs text-gray-400 shrink-0">{stay.priceRange}</span>
        </div>
        <p className="text-xs text-gray-500 mb-1">{stay.type}</p>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className={`w-3 h-3 ${i < stars ? 'text-amber-400' : 'text-gray-200'}`}
              fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-400 ml-1">{stay.rating}</span>
        </div>
      </div>
    </div>
  );
}

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

function makeDotIcon(color, size = 14) {
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;background:${color};border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 2px ${color};"></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const POI_COLORS = {
  place:       '#16A34A',
  restaurant:  '#06B6D4',
  stay:        '#7C3AED',
  destination: '#4F46E5',
};

async function geocode(query) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch { /* fall through */ }
  return null;
}

function scatter(lat, lng, index) {
  const angle = (index * 137.5 * Math.PI) / 180;
  const radius = 0.01 + (index % 3) * 0.007;
  return { lat: lat + Math.cos(angle) * radius, lng: lng + Math.sin(angle) * radius };
}

function DestinationMap({ lat, lng, name, places = [], restaurants = [], stays = [] }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);

    L.marker([lat, lng], { icon: makeDotIcon(POI_COLORS.destination, 18) })
      .addTo(mapRef.current)
      .bindPopup(`<b>${name}</b>`)
      .openPopup();

    const pois = [
      ...places.map((p, i)      => ({ name: p.name, type: 'Place',      color: POI_COLORS.place,      index: i })),
      ...restaurants.map((r, i) => ({ name: r.name, type: 'Restaurant', color: POI_COLORS.restaurant, index: places.length + i })),
      ...stays.map((s, i)       => ({ name: s.name, type: 'Stay',       color: POI_COLORS.stay,       index: places.length + restaurants.length + i })),
    ];

    let cancelled = false;
    (async () => {
      for (const poi of pois) {
        if (cancelled || !mapRef.current) break;
        await new Promise(r => setTimeout(r, 120));
        if (cancelled || !mapRef.current) break;

        const coords = await geocode(`${poi.name}, ${name}`)
          ?? scatter(lat, lng, poi.index);

        if (!cancelled && mapRef.current) {
          L.marker([coords.lat, coords.lng], { icon: makeDotIcon(poi.color) })
            .addTo(mapRef.current)
            .bindPopup(`<b>${poi.name}</b><br/><span style="color:#6B7280;font-size:11px">${poi.type}</span>`);
        }
      }
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, name]);

  return (
    <div>
      <div ref={containerRef} className="w-full h-72 rounded-2xl overflow-hidden" />
      <div className="flex flex-wrap gap-4 mt-3 px-1 text-xs text-gray-500">
        {[
          { color: POI_COLORS.destination, label: 'Destination' },
          { color: POI_COLORS.place,       label: 'Places' },
          { color: POI_COLORS.restaurant,  label: 'Restaurants' },
          { color: POI_COLORS.stay,        label: 'Stays' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span style={{ background: color }} className="w-2.5 h-2.5 rounded-full inline-block" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AIDestinationDetailPage() {
  const [searchParams] = useSearchParams();
  const destinationName = searchParams.get('name') || '';
  const dispatch = useDispatch();
  const { destinationDetail, detailLoading, detailError } = useSelector((state) => state.ai);

  useEffect(() => {
    if (destinationName) dispatch(getAIDestinationDetails(destinationName));
    return () => dispatch(clearAIDetail());
  }, [dispatch, destinationName]);

  if (detailLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="h-[40vh] bg-gradient-to-br from-indigo-600 to-cyan-500 animate-pulse" />
        <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
        </div>
        <div className="max-w-[1200px] mx-auto px-6 text-center text-gray-400 text-sm mt-4">
          Generating destination details with AI — this may take a moment...
        </div>
      </div>
    );
  }

  if (detailError || !destinationDetail) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
            {detailError || 'Could not load destination details'}
          </h2>
          <Link to="/ai-search" className="text-indigo-600 text-sm hover:underline">
            ← Back to AI Search
          </Link>
        </div>
      </div>
    );
  }

  const { name, description, coordinates, places, restaurants, stays } = destinationDetail;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Hero (gradient, no image needed) ─────────────────────── */}
      <section className="relative h-[40vh] flex items-end overflow-hidden bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#06B6D4]">
        <div className="absolute inset-0 bg-[#0F172A]/30" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 pb-10 w-full">
          <Link
            to="/ai-search"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to AI Search
          </Link>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Generated
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">{name}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-10">
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">About {name}</h2>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Map */}
        {coordinates?.lat && coordinates?.lng && (
          <div className="bg-white rounded-2xl shadow-sm mb-10 p-4">
            <DestinationMap
              lat={coordinates.lat}
              lng={coordinates.lng}
              name={name}
              places={places}
              restaurants={restaurants}
              stays={stays}
            />
          </div>
        )}

        {/* Places */}
        <Section title="Top Places to Visit" icon="🏛">
          {places?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {places.map((place, i) => (
                <PlaceCard key={i} place={place} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No places available.</p>
          )}
        </Section>

        {/* Restaurants */}
        <Section title="Top Restaurants" icon="🍽">
          {restaurants?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map((r, i) => (
                <RestaurantCard key={i} restaurant={r} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No restaurants available.</p>
          )}
        </Section>

        {/* Stays */}
        <Section title="Where to Stay" icon="🏨">
          {stays?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stays.map((s, i) => (
                <StayCard key={i} stay={s} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No stays available.</p>
          )}
        </Section>
      </div>
    </div>
  );
}
