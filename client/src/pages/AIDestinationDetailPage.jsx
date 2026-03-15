import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAIDestinationBySlug, clearAIDetail } from '../store/slices/aiSlice';
import WishlistButton from '../components/WishlistButton';
import ShareButton from '../components/ShareButton';
import TripCostSummary from '../components/TripCostSummary';

const CATEGORY_COLORS = {
  Nature:      { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: '🌿' },
  History:     { bg: 'bg-amber-50',   text: 'text-amber-600',   icon: '🏛' },
  Culture:     { bg: 'bg-purple-50',  text: 'text-purple-600',  icon: '🎭' },
  Adventure:   { bg: 'bg-orange-50',  text: 'text-orange-600',  icon: '⛰' },
  Beach:       { bg: 'bg-cyan-50',    text: 'text-cyan-600',    icon: '🏖' },
  Museum:      { bg: 'bg-indigo-50',  text: 'text-indigo-600',  icon: '🖼' },
  Temple:      { bg: 'bg-rose-50',    text: 'text-rose-600',    icon: '⛩' },
  Market:      { bg: 'bg-yellow-50',  text: 'text-yellow-600',  icon: '🛒' },
  Monument:    { bg: 'bg-slate-50',   text: 'text-slate-600',   icon: '🗽' },
};


function StarRating({ rating }) {
  const stars = Math.round(rating || 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3 h-3 ${i < stars ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-400 ml-1">{rating}</span>
    </div>
  );
}

function RestaurantMini({ r }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
      <span className="text-base shrink-0">🍽</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs font-semibold text-[#0F172A] truncate">{r.name}</p>
        </div>
        <p className="text-xs text-gray-400">{r.cuisine}</p>
      </div>
    </div>
  );
}

function StayMini({ s }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
      <span className="text-base shrink-0">🏨</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs font-semibold text-[#0F172A] truncate">{s.name}</p>
        </div>
        <p className="text-xs text-gray-400">{s.priceRange} · {s.type}</p>
      </div>
    </div>
  );
}

function PlaceCard({ place, dayNumber }) {
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
      </div>

      {/* Restaurants + Stays */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {place.restaurants?.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">
              Where to Eat
            </p>
            <div className="space-y-2">
              {place.restaurants.map((r, i) => <RestaurantMini key={i} r={r} />)}
            </div>
          </div>
        )}
        {place.stays?.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">
              Where to Stay
            </p>
            <div className="space-y-2">
              {place.stays.map((s, i) => <StayMini key={i} s={s} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Map helpers ────────────────────────────────────────────────────────────────
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

function scatter(lat, lng, index) {
  const angle = (index * 137.5 * Math.PI) / 180;
  const radius = 0.008 + (index % 3) * 0.006;
  return { lat: lat + Math.cos(angle) * radius, lng: lng + Math.sin(angle) * radius };
}

function DestinationMap({ lat, lng, name, places = [] }) {
  const containerRef = useRef(null);
  const mapRef      = useRef(null);
  const layersRef   = useRef(null);
  const [selectedDay, setSelectedDay] = useState(null); // null = All Days

  // Init map once
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

    mapRef.current = L.map(containerRef.current).setView([lat, lng], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);
    layersRef.current = L.layerGroup().addTo(mapRef.current);

    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, [lat, lng]);

  // Re-render markers whenever selectedDay or places change
  useEffect(() => {
    if (!mapRef.current || !layersRef.current) return;
    layersRef.current.clearLayers();

    const valid = places.filter(p => p.coordinates?.lat && p.coordinates?.lng);
    if (valid.length === 0) return;

    if (selectedDay === null) {
      // ALL DAYS — numbered markers + dashed route polyline
      const latLngs = valid.map(p => [p.coordinates.lat, p.coordinates.lng]);

      if (latLngs.length > 1) {
        L.polyline(latLngs, { color: '#4F46E5', weight: 2.5, opacity: 0.5, dashArray: '8 5' })
          .addTo(layersRef.current);
      }

      valid.forEach((place, i) => {
        const day = place.dayIndex ?? i + 1;
        L.marker([place.coordinates.lat, place.coordinates.lng], { icon: makeNumberIcon(day) })
          .addTo(layersRef.current)
          .bindPopup(
            `<div style="font-family:system-ui;min-width:130px">
              <div style="font-size:10px;color:#4F46E5;font-weight:700;margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em">Day ${day}</div>
              <div style="font-weight:700;font-size:13px;color:#0F172A">${place.name}</div>
              <div style="font-size:11px;color:#6B7280;margin-top:1px">${place.category}</div>
            </div>`
          );
      });

      if (latLngs.length > 1) {
        mapRef.current.fitBounds(latLngs, { padding: [44, 44], maxZoom: 13 });
      } else {
        mapRef.current.setView(latLngs[0], 12);
      }
    } else {
      // SINGLE DAY — numbered marker + restaurant/stay sub-markers
      const place = valid.find(p => (p.dayIndex ?? valid.indexOf(p) + 1) === selectedDay);
      if (!place) return;

      const { lat: pLat, lng: pLng } = place.coordinates;

      L.marker([pLat, pLng], { icon: makeNumberIcon(selectedDay) })
        .addTo(layersRef.current)
        .bindPopup(
          `<div style="font-family:system-ui;min-width:150px">
            <div style="font-size:10px;color:#4F46E5;font-weight:700;margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em">Day ${selectedDay}</div>
            <div style="font-weight:700;font-size:13px;color:#0F172A">${place.name}</div>
            <div style="font-size:11px;color:#6B7280;margin-top:1px">${place.category}</div>
          </div>`
        )
        .openPopup();

      place.restaurants?.forEach((r, i) => {
        const pos = scatter(pLat, pLng, i * 2);
        L.marker([pos.lat, pos.lng], { icon: makeDotIcon(POI_COLORS.restaurant) })
          .addTo(layersRef.current)
          .bindPopup(
            `<div style="font-family:system-ui"><div style="font-weight:600;font-size:12px;color:#0F172A">🍽 ${r.name}</div><div style="font-size:11px;color:#6B7280">${r.cuisine}</div></div>`
          );
      });

      place.stays?.forEach((s, i) => {
        const pos = scatter(pLat, pLng, i * 2 + 1 + (place.restaurants?.length || 0));
        L.marker([pos.lat, pos.lng], { icon: makeDotIcon(POI_COLORS.stay) })
          .addTo(layersRef.current)
          .bindPopup(
            `<div style="font-family:system-ui"><div style="font-weight:600;font-size:12px;color:#0F172A">🏨 ${s.name}</div><div style="font-size:11px;color:#6B7280">${s.priceRange} · ${s.type}</div></div>`
          );
      });

      mapRef.current.setView([pLat, pLng], 13);
    }
  }, [selectedDay, places]);

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
        {places.map((p, i) => {
          const day = p.dayIndex ?? i + 1;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDay === day
                  ? 'bg-[#4F46E5] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              Day {day}
            </button>
          );
        })}
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

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AIDestinationDetailPage() {
  const [searchParams] = useSearchParams();
  const slug        = searchParams.get('slug') || '';
  const budget      = searchParams.get('budget') || 'mid-range';
  const days        = searchParams.get('days') || '5';
  const name        = searchParams.get('name') || '';
  const style       = searchParams.get('style') || '';
  const fromWishlist = searchParams.get('from') === 'wishlist';
  const dispatch = useDispatch();
  const { destinationDetail, detailLoading, detailError } = useSelector((state) => state.ai);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (slug) dispatch(getAIDestinationBySlug({ slug, budget, days, name, style }));
    return () => dispatch(clearAIDetail());
  }, [dispatch, slug]);

  if (detailLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Hero skeleton */}
        <div className="h-[40vh] bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] flex items-end">
          <div className="max-w-[1200px] mx-auto px-6 pb-10 w-full animate-pulse">
            <div className="h-3 bg-white/20 rounded w-24 mb-4" />
            <div className="h-10 bg-white/30 rounded w-64 mb-2" />
            <div className="h-5 bg-white/20 rounded w-40" />
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-5">
          {/* AI generating message */}
          <div className="flex items-center gap-3 text-indigo-600 text-sm font-medium">
            <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Generating your itinerary with AI — this may take 10–20 seconds...
          </div>

          {/* Description card skeleton */}
          <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
            <div className="h-3 bg-gray-100 rounded w-4/6" />
          </div>

          {/* Map skeleton */}
          <div className="bg-white rounded-2xl shadow-sm p-4 animate-pulse">
            <div className="flex gap-2 mb-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-7 w-16 bg-gray-100 rounded-lg" />
              ))}
            </div>
            <div className="w-full h-80 rounded-2xl bg-gray-100" />
          </div>

          {/* Place card skeletons */}
          <div className="h-5 bg-gray-200 rounded w-56 animate-pulse" />
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="bg-gray-100 px-5 py-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <div className="h-4 bg-gray-200 rounded-full w-12" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1].map((col) => (
                  <div key={col} className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    {[0, 1].map((row) => (
                      <div key={row} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
                        <div className="w-6 h-6 rounded bg-gray-200 shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 bg-gray-200 rounded w-3/4" />
                          <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
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
          <Link to={fromWishlist ? '/wishlist' : '/ai-search'} className="text-indigo-600 text-sm hover:underline">
            {fromWishlist ? '← Back to Wishlist' : '← Back to AI Search'}
          </Link>
        </div>
      </div>
    );
  }

  const { destination, plans = [] } = destinationDetail;
  const activePlan = plans[activeTab];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative h-[40vh] flex items-end overflow-hidden">
        {destination?.heroImage ? (
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#06B6D4]" />
        )}
        <div className="absolute inset-0 bg-[#0F172A]/40" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 pb-10 w-full">
          <Link
            to={fromWishlist ? '/wishlist' : '/ai-search'}
            className="no-print inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {fromWishlist ? 'Back to Wishlist' : 'Back to AI Search'}
          </Link>
          <div>
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Generated Itinerary
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                {destination?.name}
                {destination?.country && (
                  <span className="text-indigo-200 font-normal text-3xl">, {destination.country}</span>
                )}
              </h1>
              <div className="no-print flex items-center gap-2">
                {destination?._id && (
                  <WishlistButton destinationId={destination._id} size="md" className="shrink-0" />
                )}
                <ShareButton name={destination?.name || ''} country={destination?.country || ''} />
              </div>
            </div>
            {style && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 rounded-full">
                  ✦ {style}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Overview */}
        {destination?.description && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="text-lg font-bold text-[#0F172A] mb-3">About {destination.name}</h2>
            <p className="text-gray-600 leading-relaxed">{destination.description}</p>
          </div>
        )}

        {/* Map */}
        {destination?.coordinates?.lat && destination?.coordinates?.lng && activePlan && (
          <div className="no-print bg-white rounded-2xl shadow-sm mb-8 p-4">
            <DestinationMap
              key={activeTab}
              lat={destination.coordinates.lat}
              lng={destination.coordinates.lng}
              name={destination.name}
              places={activePlan.places || []}
            />
          </div>
        )}

        {/* Plan tabs */}
        {plans.length > 1 && (
          <div className="flex gap-2 mb-6">
            {plans.map((plan, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === i
                    ? 'bg-[#4F46E5] text-white shadow-md'
                    : 'bg-white text-[#6B7280] border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {plan.title || `Plan ${i + 1}`}
              </button>
            ))}
          </div>
        )}

        {/* Day-by-day places */}
        {activePlan?.places?.length > 0 ? (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🗺</span>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {activePlan.title} · {activePlan.places.length}-Day Itinerary
              </h2>
            </div>
            {activePlan.places.map((place, i) => (
              <PlaceCard key={i} place={place} dayNumber={place.dayIndex ?? i + 1} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-400 text-sm">No itinerary available for this plan.</p>
          </div>
        )}

        {/* Trip cost summary — always at the bottom */}
        <TripCostSummary budget={budget} days={days} />
      </div>
    </div>
  );
}
