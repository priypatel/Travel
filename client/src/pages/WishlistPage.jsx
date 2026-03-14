import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';

function WishlistCard({ destination }) {
  const dispatch = useDispatch();
  const { _id, name, country, description, bestTime, heroImage, tags } = destination;
  const badge = tags?.[0] || null;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={heroImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-amber-400 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {badge}
          </span>
        )}
        {/* Remove button */}
        <button
          onClick={(e) => { e.preventDefault(); dispatch(removeFromWishlist(_id)); }}
          title="Remove from wishlist"
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-red-50 rounded-full flex items-center justify-center shadow transition-colors"
        >
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-[#0F172A] mb-0.5">{name}</h3>
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {country}
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{description}</p>
        {bestTime && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {bestTime}
          </div>
        )}
        <Link
          to={`/destinations/${_id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Explore
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-10">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-3xl font-bold text-[#0F172A]">My Wishlist</h1>
          <p className="text-[#6B7280] mt-1">
            {user?.name ? `${user.name}'s` : 'Your'} saved destinations
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-5">
              <svg className="w-9 h-9 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-2">No saved destinations yet</h2>
            <p className="text-[#6B7280] mb-6 max-w-sm">
              Browse destinations and tap the heart icon to save your favourites here.
            </p>
            <Link
              to="/"
              className="bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Browse Destinations
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && items.length > 0 && (
          <>
            <p className="text-sm text-[#6B7280] mb-6">{items.length} saved destination{items.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((dest) => (
                <WishlistCard key={dest._id} destination={dest} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
