import { Link } from 'react-router-dom';

export default function DestinationCard({ destination }) {
  const { _id, name, country, description, bestTime, heroImage, tags } = destination;

  return (
    <Link
      to={`/destinations/${_id}`}
      className="group block w-full max-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Hero image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={heroImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Best time badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-indigo-600 px-2.5 py-1 rounded-full">
          {bestTime}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-bold text-[#0F172A] leading-tight">{name}</h3>
          <span className="text-sm text-gray-400 shrink-0 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {country}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{description}</p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
