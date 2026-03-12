import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDestinations, setActiveMonth } from '../store/slices/destinationSlice';
import DestinationCard from '../components/DestinationCard';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function HomePage() {
  const dispatch = useDispatch();
  const { list, loading, error, activeMonth } = useSelector((state) => state.destinations);

  useEffect(() => {
    dispatch(getDestinations(activeMonth));
  }, [dispatch, activeMonth]);

  const handleMonthClick = (month) => {
    const next = activeMonth === month ? null : month;
    dispatch(setActiveMonth(next));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Hero ─────────────────────────────────────────────────── */}
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

      {/* ── Month filter bar ─────────────────────────────────────── */}
      <section className="sticky top-[72px] z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => dispatch(setActiveMonth(null))}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !activeMonth
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {MONTHS.map((month) => (
              <button
                key={month}
                onClick={() => handleMonthClick(month)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeMonth === month
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destination grid ─────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">
              {activeMonth ? `Best in ${activeMonth}` : 'Explore Destinations'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {loading ? 'Loading...' : `${list.length} destination${list.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full max-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && list.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {list.map((destination) => (
              <DestinationCard key={destination._id} destination={destination} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && list.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-1">No destinations found</h3>
            <p className="text-sm text-gray-500">
              {activeMonth
                ? `No destinations are best visited in ${activeMonth}. Try another month.`
                : 'No destinations available yet.'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
