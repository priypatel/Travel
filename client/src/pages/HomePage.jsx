import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDestinations } from '../store/slices/destinationSlice';
import DestinationSlider from '../components/DestinationSlider';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Checks if `month` falls within a destination's bestTime string.
 * Handles:
 *   - Single: "April"
 *   - Range: "April to October"
 *   - Wrap-around: "November to February"
 *   - Multiple: "March to May, October to November"
 */
function isMonthInBestTime(bestTime, month) {
  const targetIdx = MONTHS.findIndex(
    (m) => m.toLowerCase() === month.toLowerCase()
  );
  if (targetIdx === -1) return false;

  const ranges = bestTime.split(',').map((r) => r.trim());

  for (const range of ranges) {
    const parts = range.split(/\s+to\s+/i).map((p) => p.trim());

    if (parts.length === 1) {
      const idx = MONTHS.findIndex(
        (m) => m.toLowerCase() === parts[0].toLowerCase()
      );
      if (idx === targetIdx) return true;
    } else if (parts.length === 2) {
      const startIdx = MONTHS.findIndex(
        (m) => m.toLowerCase() === parts[0].toLowerCase()
      );
      const endIdx = MONTHS.findIndex(
        (m) => m.toLowerCase() === parts[1].toLowerCase()
      );
      if (startIdx === -1 || endIdx === -1) continue;

      if (startIdx <= endIdx) {
        // Normal range e.g. April–October
        if (targetIdx >= startIdx && targetIdx <= endIdx) return true;
      } else {
        // Wrap-around e.g. November–February
        if (targetIdx >= startIdx || targetIdx <= endIdx) return true;
      }
    }
  }
  return false;
}

function SkeletonSlider() {
  return (
    <section className="mb-14">
      <div className="h-7 w-64 bg-gray-200 rounded-lg animate-pulse mb-6" />
      <div className="flex gap-6 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="shrink-0 w-[296px] bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.destinations);
  const [activeMonth, setActiveMonth] = useState(null);

  useEffect(() => {
    dispatch(getDestinations());
  }, [dispatch]);

  // Split by country
  const india = useMemo(() => list.filter((d) => d.country === 'India'), [list]);
  const worldwide = useMemo(() => list.filter((d) => d.country !== 'India'), [list]);

  // Apply month filter to both sections
  const filteredIndia = useMemo(
    () => activeMonth ? india.filter((d) => isMonthInBestTime(d.bestTime, activeMonth)) : india,
    [india, activeMonth]
  );
  const filteredWorldwide = useMemo(
    () => activeMonth ? worldwide.filter((d) => isMonthInBestTime(d.bestTime, activeMonth)) : worldwide,
    [worldwide, activeMonth]
  );

  const toggleMonth = (month) => setActiveMonth((prev) => (prev === month ? null : month));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&auto=format&fit=crop&q=80"
          alt="Travel hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/50 via-[#0F172A]/30 to-[#0F172A]/60" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
            Discover Your Next
            <span className="text-[#06B6D4]"> Adventure</span>
          </h1>
          <p className="text-lg text-white/80 mb-8">
            AI-powered travel recommendations tailored just for you. Explore destinations, find hidden gems, and plan your perfect trip.
          </p>
          <a
            href="/ai-search"
            className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base shadow-lg shadow-indigo-500/25"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Plan with AI
          </a>
        </div>
      </section>

      {/* ── Month filter bar ────────────────────────────────────────── */}
      <div className="sticky top-[72px] z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-3">
          {/* Label */}
          <div className="shrink-0 flex items-center gap-1.5 text-sm text-gray-500 font-medium">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Filter by Month:
          </div>

          {/* Pills */}
          <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {MONTHS.map((month) => (
              <button
                key={month}
                onClick={() => toggleMonth(month)}
                className={`shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  activeMonth === month
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sliders ─────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">

        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {loading && (
          <>
            <SkeletonSlider />
            <SkeletonSlider />
          </>
        )}

        {!loading && !error && (
          <>
            <DestinationSlider
              title="Top Destinations in India"
              destinations={filteredIndia}
            />
            <DestinationSlider
              title="Top Destinations Worldwide"
              destinations={filteredWorldwide}
            />

            {/* Both sections empty after filter */}
            {filteredIndia.length === 0 && filteredWorldwide.length === 0 && (
              <div className="text-center py-20">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-1">No destinations for {activeMonth}</h3>
                <p className="text-sm text-gray-500">Try selecting a different month.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
