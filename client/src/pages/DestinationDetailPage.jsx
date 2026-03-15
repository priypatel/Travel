import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDestinationDetail, clearDetail } from '../store/slices/destinationSlice';
import WishlistButton from '../components/WishlistButton';
import ShareButton from '../components/ShareButton';

// ── Category config ────────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  Nature:    { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: '🌿' },
  History:   { bg: 'bg-amber-50',   text: 'text-amber-600',   icon: '🏛' },
  Culture:   { bg: 'bg-purple-50',  text: 'text-purple-600',  icon: '🎭' },
  Adventure: { bg: 'bg-orange-50',  text: 'text-orange-600',  icon: '⛰' },
  Beach:     { bg: 'bg-cyan-50',    text: 'text-cyan-600',    icon: '🏖' },
  Museum:    { bg: 'bg-indigo-50',  text: 'text-indigo-600',  icon: '🖼' },
  Temple:    { bg: 'bg-rose-50',    text: 'text-rose-600',    icon: '⛩' },
  Market:    { bg: 'bg-yellow-50',  text: 'text-yellow-600',  icon: '🛒' },
  Monument:  { bg: 'bg-slate-50',   text: 'text-slate-600',   icon: '🗽' },
  Park:      { bg: 'bg-green-50',   text: 'text-green-600',   icon: '🌳' },
  Castle:    { bg: 'bg-stone-50',   text: 'text-stone-600',   icon: '🏰' },
  Palace:    { bg: 'bg-pink-50',    text: 'text-pink-600',    icon: '🏯' },
};

const PRICE_BADGE = {
  '$':         { label: '$',   cls: 'bg-green-100 text-green-700' },
  '$$':        { label: '$$',  cls: 'bg-yellow-100 text-yellow-700' },
  '$$$':       { label: '$$$', cls: 'bg-purple-100 text-purple-700' },
  budget:      { label: '$',   cls: 'bg-green-100 text-green-700' },
  'mid-range': { label: '$$',  cls: 'bg-yellow-100 text-yellow-700' },
  luxury:      { label: '$$$', cls: 'bg-purple-100 text-purple-700' },
};

// ── Distribute items across buckets (3 per bucket, wrap-around) ───────────────
function distribute(items, numBuckets, perBucket = 3) {
  const buckets = Array.from({ length: numBuckets }, () => []);
  items.forEach((item, i) => {
    const bucket = Math.floor(i / perBucket) % numBuckets;
    if (buckets[bucket].length < perBucket) buckets[bucket].push(item);
  });
  // If some buckets are still empty (not enough items), repeat items
  const pool = [...items];
  for (let b = 0; b < numBuckets; b++) {
    while (buckets[b].length < Math.min(perBucket, items.length)) {
      buckets[b].push(pool[buckets[b].length % pool.length]);
    }
  }
  return buckets;
}

// ── Mini cards ─────────────────────────────────────────────────────────────────
function RestaurantMini({ r }) {
  const price = PRICE_BADGE[r.priceLevel] || PRICE_BADGE['$$'];
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
      <span className="text-base shrink-0">🍽</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs font-semibold text-[#0F172A] truncate">{r.name}</p>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${price.cls}`}>{price.label}</span>
        </div>
        <p className="text-xs text-gray-400">{r.cuisine}</p>
        {r.rating > 0 && (
          <div className="flex items-center gap-0.5 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className={`w-2.5 h-2.5 ${i < Math.round(r.rating) ? 'text-amber-400' : 'text-gray-200'}`}
                fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
            <span className="text-xs text-gray-400 ml-0.5">{r.rating}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StayMini({ s }) {
  const price = PRICE_BADGE[s.priceLevel] || PRICE_BADGE['$$'];
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
      <span className="text-base shrink-0">🏨</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs font-semibold text-[#0F172A] truncate">{s.name}</p>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${price.cls}`}>{price.label}</span>
        </div>
        <p className="text-xs text-gray-400">
          {[s.priceRange, s.type].filter(Boolean).join(' · ')}
        </p>
        {s.rating > 0 && (
          <div className="flex items-center gap-0.5 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className={`w-2.5 h-2.5 ${i < Math.round(s.rating) ? 'text-amber-400' : 'text-gray-200'}`}
                fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
            <span className="text-xs text-gray-400 ml-0.5">{s.rating}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Day place card ─────────────────────────────────────────────────────────────
function DayPlaceCard({ place, dayNumber, placedRestaurants, placedStays }) {
  const colors = CATEGORY_COLORS[place.category] || { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: '📍' };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Place header */}
      <div className={`${colors.bg} px-5 py-4 flex items-start gap-4`}>
        <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center text-xl shrink-0">
          {colors.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-white bg-[#4F46E5] px-2 py-0.5 rounded-full">
              Day {dayNumber}
            </span>
            <span className={`text-xs font-medium ${colors.text}`}>{place.category}</span>
          </div>
          <h3 className="text-base font-bold text-[#0F172A] leading-tight">{place.name}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{place.description}</p>
        </div>
        {place.image && (
          <img
            src={place.image}
            alt={place.name}
            className="w-20 h-20 rounded-xl object-cover shrink-0 hidden sm:block"
          />
        )}
      </div>

      {/* Restaurants + Stays */}
      {(placedRestaurants.length > 0 || placedStays.length > 0) && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {placedRestaurants.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Where to Eat</p>
              <div className="space-y-2">
                {placedRestaurants.map((r) => <RestaurantMini key={r._id} r={r} />)}
              </div>
            </div>
          )}
          {placedStays.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Where to Stay</p>
              <div className="space-y-2">
                {placedStays.map((s) => <StayMini key={s._id} s={s} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Map ────────────────────────────────────────────────────────────────────────
const POI_COLORS = {
  restaurant: '#06B6D4',
  stay:       '#7C3AED',
};

function makeDotIcon(color, size = 10) {
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;background:${color};border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.25);"></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function makeNumberIcon(day) {
  return L.divIcon({
    html: `<div style="width:28px;height:28px;background:#4F46E5;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(79,70,229,0.4);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:800;font-family:system-ui;">${day}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

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
  const radius = 0.008 + (index % 3) * 0.006;
  return { lat: lat + Math.cos(angle) * radius, lng: lng + Math.sin(angle) * radius };
}

function DestinationMap({ lat, lng, name, places = [], restBuckets = [], stayBuckets = [] }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const layersRef    = useRef(null);
  const geocodedRef  = useRef([]); // geocoded coords per place index
  const [selectedDay, setSelectedDay]   = useState(null);
  const [coordsReady, setCoordsReady]   = useState(false);

  // Init map + geocode all places upfront
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

    geocodedRef.current = [];
    setCoordsReady(false);
    setSelectedDay(null);

    mapRef.current = L.map(containerRef.current).setView([lat, lng], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);
    layersRef.current = L.layerGroup().addTo(mapRef.current);

    let cancelled = false;
    (async () => {
      const coords = [];
      for (let i = 0; i < places.length; i++) {
        if (cancelled) break;
        const p = places[i];
        let c = null;
        if (p.coordinates?.lat && p.coordinates?.lng) {
          c = { lat: p.coordinates.lat, lng: p.coordinates.lng };
        } else {
          await new Promise(r => setTimeout(r, 120));
          if (cancelled) break;
          c = await geocode(`${p.name}, ${name}`) ?? scatter(lat, lng, i);
        }
        coords.push(c);
      }
      if (!cancelled) {
        geocodedRef.current = coords;
        setCoordsReady(true);
      }
    })();

    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null; };
  }, [lat, lng, name]);

  // Re-render markers when selectedDay or coords are ready
  useEffect(() => {
    if (!mapRef.current || !layersRef.current || !coordsReady) return;
    layersRef.current.clearLayers();

    const coords = geocodedRef.current;
    if (coords.length === 0) return;

    if (selectedDay === null) {
      // ALL DAYS — numbered markers + route polyline
      const latLngs = coords.map(c => [c.lat, c.lng]);

      if (latLngs.length > 1) {
        L.polyline(latLngs, { color: '#4F46E5', weight: 2.5, opacity: 0.5, dashArray: '8 5' })
          .addTo(layersRef.current);
      }

      places.forEach((place, i) => {
        const day = i + 1;
        L.marker([coords[i].lat, coords[i].lng], { icon: makeNumberIcon(day) })
          .addTo(layersRef.current)
          .bindPopup(
            `<div style="font-family:system-ui;min-width:130px">
              <div style="font-size:10px;color:#4F46E5;font-weight:700;margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em">Day ${day}</div>
              <div style="font-weight:700;font-size:13px;color:#0F172A">${place.name}</div>
              <div style="font-size:11px;color:#6B7280;margin-top:1px">${place.category || ''}</div>
            </div>`
          );
      });

      if (latLngs.length > 1) {
        mapRef.current.fitBounds(latLngs, { padding: [44, 44], maxZoom: 13 });
      } else if (latLngs.length === 1) {
        mapRef.current.setView(latLngs[0], 12);
      }
    } else {
      // SINGLE DAY — numbered marker + restaurant/stay sub-markers
      const idx = selectedDay - 1;
      if (!coords[idx]) return;
      const { lat: pLat, lng: pLng } = coords[idx];
      const place = places[idx];

      L.marker([pLat, pLng], { icon: makeNumberIcon(selectedDay) })
        .addTo(layersRef.current)
        .bindPopup(
          `<div style="font-family:system-ui;min-width:150px">
            <div style="font-size:10px;color:#4F46E5;font-weight:700;margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em">Day ${selectedDay}</div>
            <div style="font-weight:700;font-size:13px;color:#0F172A">${place?.name}</div>
            <div style="font-size:11px;color:#6B7280;margin-top:1px">${place?.category || ''}</div>
          </div>`
        )
        .openPopup();

      (restBuckets[idx] || []).forEach((r, i) => {
        const pos = scatter(pLat, pLng, i * 2);
        L.marker([pos.lat, pos.lng], { icon: makeDotIcon(POI_COLORS.restaurant) })
          .addTo(layersRef.current)
          .bindPopup(
            `<div style="font-family:system-ui"><div style="font-weight:600;font-size:12px;color:#0F172A">🍽 ${r.name}</div><div style="font-size:11px;color:#6B7280">${r.cuisine || ''}</div></div>`
          );
      });

      (stayBuckets[idx] || []).forEach((s, i) => {
        const pos = scatter(pLat, pLng, i * 2 + 1 + (restBuckets[idx]?.length || 0));
        L.marker([pos.lat, pos.lng], { icon: makeDotIcon(POI_COLORS.stay) })
          .addTo(layersRef.current)
          .bindPopup(
            `<div style="font-family:system-ui"><div style="font-weight:600;font-size:12px;color:#0F172A">🏨 ${s.name}</div><div style="font-size:11px;color:#6B7280">${[s.priceRange, s.type].filter(Boolean).join(' · ')}</div></div>`
          );
      });

      mapRef.current.setView([pLat, pLng], 13);
    }
  }, [selectedDay, coordsReady]);

  return (
    <div className="isolate">
      {/* Day filter bar */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 overflow-y-visible" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setSelectedDay(null)}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedDay === null
              ? 'bg-[#4F46E5] text-white shadow-sm'
              : 'bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
          }`}
        >
          All Days
        </button>
        {places.map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setSelectedDay(i + 1)}
            disabled={!coordsReady}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 ${
              selectedDay === i + 1
                ? 'bg-[#4F46E5] text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            Day {i + 1}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="w-full h-80 rounded-2xl overflow-hidden" />

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3 px-1 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-[9px] font-bold shrink-0">1</span>
          Day Stop
        </span>
        {selectedDay !== null ? (
          <>
            <span className="flex items-center gap-1.5">
              <span style={{ background: POI_COLORS.restaurant }} className="w-2.5 h-2.5 rounded-full inline-block shrink-0" />
              Restaurants
            </span>
            <span className="flex items-center gap-1.5">
              <span style={{ background: POI_COLORS.stay }} className="w-2.5 h-2.5 rounded-full inline-block shrink-0" />
              Stays
            </span>
          </>
        ) : (
          <span className="flex items-center gap-1.5">
            <svg width="20" height="6" className="shrink-0"><line x1="0" y1="3" x2="20" y2="3" stroke="#4F46E5" strokeWidth="2" strokeDasharray="5 3" opacity=".6"/></svg>
            Route
          </span>
        )}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function DestinationDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const fromWishlist = searchParams.get('from') === 'wishlist';
  const dispatch = useDispatch();
  const { detail, places, restaurants, stays, loading, error } = useSelector(
    (state) => state.destinations
  );

  useEffect(() => {
    dispatch(getDestinationDetail(id));
    return () => dispatch(clearDetail());
  }, [dispatch, id]);

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

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
            {error || 'Destination not found'}
          </h2>
          <Link to={fromWishlist ? '/wishlist' : '/'} className="text-indigo-600 text-sm hover:underline">
            {fromWishlist ? '← Back to Wishlist' : '← Back to destinations'}
          </Link>
        </div>
      </div>
    );
  }

  // Distribute restaurants and stays across places (3 each per place)
  const restBuckets  = places.length > 0 ? distribute(restaurants, places.length, 3) : [];
  const stayBuckets  = places.length > 0 ? distribute(stays, places.length, 3) : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <img
          src={detail.heroImage}
          alt={detail.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 pb-10 w-full">
          <Link
            to={fromWishlist ? '/wishlist' : '/'}
            className="no-print inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {fromWishlist ? 'Back to Wishlist' : 'All destinations'}
          </Link>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">{detail.name}</h1>
                <div className="no-print flex items-center gap-2">
                  <WishlistButton destinationId={detail._id} size="md" className="shrink-0" />
                  <ShareButton name={detail.name} country={detail.country} />
                </div>
              </div>
              <p className="text-white/80 mt-1 text-lg">{detail.country}</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-1">
              {detail.bestTime && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                  🗓 Best: {detail.bestTime}
                </span>
              )}
              {detail.tags?.map((tag) => (
                <span key={tag} className="bg-indigo-600/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-10">
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">About {detail.name}</h2>
          <p className="text-gray-600 leading-relaxed">{detail.description}</p>
        </div>

        {/* Map */}
        {detail.coordinates?.lat && detail.coordinates?.lng && (
          <div className="no-print bg-white rounded-2xl shadow-sm mb-10 p-4">
            <DestinationMap
              lat={detail.coordinates.lat}
              lng={detail.coordinates.lng}
              name={detail.name}
              places={places}
              restBuckets={restBuckets}
              stayBuckets={stayBuckets}
            />
          </div>
        )}

        {/* Day-by-day itinerary */}
        {places.length > 0 ? (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🗺</span>
              <h2 className="text-xl font-bold text-[#0F172A]">
                Day-by-Day Itinerary · {places.length} Places
              </h2>
            </div>
            {places.map((place, i) => (
              <DayPlaceCard
                key={place._id}
                place={place}
                dayNumber={i + 1}
                placedRestaurants={restBuckets[i] || []}
                placedStays={stayBuckets[i] || []}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-400 text-sm">No itinerary available for this destination.</p>
          </div>
        )}
      </div>
    </div>
  );
}
