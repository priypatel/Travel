import { Link } from 'react-router-dom';

const PRICE_LABEL = {
  '$': 'Budget',
  '$$': 'Mid-range',
  '$$$': 'Luxury',
};

export default function DestinationCard({ destination }) {
  const { _id, name, country, description, bestTime, heroImage, tags } = destination;
  const badge = tags?.[0] || null;

  return (
    <Link
      to={`/destinations/${_id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 w-full cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={heroImage}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {badge && (
          <span className="absolute top-3 right-3 bg-amber-400 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-base font-bold text-[#0F172A] mb-0.5">{name}</h3>

        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {country}
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{description}</p>

        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {bestTime}
        </div>

        <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
          Explore
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
