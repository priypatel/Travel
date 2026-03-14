import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { getAIRecommendation, clearAIResult } from '../store/slices/aiSlice';

const BUDGET_OPTIONS = [
  { value: 'budget',    label: 'Budget / Backpacker' },
  { value: 'mid-range', label: 'Mid-Range' },
  { value: 'luxury',    label: 'Luxury' },
];

const TRAVEL_STYLE_OPTIONS = [
  'Adventure', 'Relaxing', 'Culture', 'Family', 'Romantic', 'Solo',
];

const INTEREST_OPTIONS = [
  'Nature', 'Photography', 'History', 'Food', 'Nightlife', 'Shopping',
  'Art', 'Music', 'Beaches', 'Hiking', 'Architecture', 'Wildlife',
];

// Card gradient by index
const CARD_GRADIENTS = [
  'from-indigo-500 via-purple-500 to-pink-400',
  'from-cyan-500 via-teal-400 to-emerald-400',
  'from-orange-400 via-rose-400 to-pink-500',
  'from-blue-500 via-indigo-400 to-violet-400',
];

const validationSchema = yup.object({
  budget: yup.string().required('Budget is required'),
  days: yup
    .number()
    .typeError('Must be a number')
    .min(1, 'At least 1 day')
    .required('Travel length is required'),
  travelStyle: yup.string().required('Travel style is required'),
  interests: yup
    .array()
    .of(yup.string())
    .min(1, 'Select at least one interest')
    .required(),
});

function DestinationCard({ dest, index, budget, days, onExplore }) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Hero gradient */}
      <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-end`}>
        <div className="absolute inset-0 bg-black/10" />
        {/* Tags */}
        <div className="relative z-10 flex flex-wrap gap-1.5 p-3">
          {dest.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-white/25 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-[#0F172A] leading-tight">{dest.destinationName}</h3>
        {dest.country && (
          <div className="flex items-center gap-1 mt-0.5 mb-2">
            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-gray-500">{dest.country}</span>
          </div>
        )}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">{dest.reason}</p>

        {dest.bestSeason && (
          <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500">
            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {dest.bestSeason}
          </div>
        )}

        <button
          onClick={() => onExplore(dest, budget, days)}
          className="mt-4 flex items-center gap-1 text-[#4F46E5] font-semibold text-sm hover:gap-2 transition-all"
        >
          Explore →
        </button>
      </div>
    </div>
  );
}

export default function AISearchPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { destinations, source, loading, error } = useSelector((state) => state.ai);
  const [submittedLocation, setSubmittedLocation] = useState('');

  const formik = useFormik({
    initialValues: {
      location: '',
      budget: 'mid-range',
      days: 5,
      travelStyle: 'Culture',
      interests: [],
    },
    validationSchema,
    onSubmit: (values) => {
      setSubmittedLocation(values.location.trim());
      dispatch(getAIRecommendation({
        ...values,
        location: values.location.trim() || 'anywhere',
        days: Number(values.days),
      }));
    },
  });

  const toggleInterest = (interest) => {
    const current = formik.values.interests;
    formik.setFieldValue(
      'interests',
      current.includes(interest) ? current.filter((i) => i !== interest) : [...current, interest]
    );
  };

  const handleExplore = (dest, budget, days) => {
    navigate(
      `/ai-destination?slug=${dest.slug}&budget=${budget}&days=${days}&name=${encodeURIComponent(dest.destinationName)}`
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="text-center pt-14 pb-10 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
          Advanced Search
        </h1>
        <p className="mt-3 text-[#6B7280] text-lg">
          Get personalized travel recommendations based on your preferences
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-20">
        {/* Error */}
        {error && (
          <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-[#0F172A] mb-1">Find Your Perfect Destination</h2>
          <p className="text-sm text-[#6B7280] mb-7">
            Tell us your preferences and we'll recommend the best destinations for you
          </p>

          <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Location <span className="text-[#6B7280] font-normal">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  placeholder="Enter city/country or leave blank for 'anywhere'"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
                />
              </div>
            </div>

            {/* Budget + Days */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Budget Range</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <select
                    name="budget"
                    value={formik.values.budget}
                    onChange={formik.handleChange}
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-[#111827] bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] appearance-none transition"
                  >
                    {BUDGET_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Travel Length (days)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="number"
                    name="days"
                    min={1}
                    value={formik.values.days}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
                  />
                </div>
                {formik.touched.days && formik.errors.days && (
                  <p className="text-[#DC2626] text-xs mt-1">{formik.errors.days}</p>
                )}
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">Travel Style</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <select
                  name="travelStyle"
                  value={formik.values.travelStyle}
                  onChange={formik.handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-[#111827] bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] appearance-none transition"
                >
                  {TRAVEL_STYLE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Interests <span className="text-[#6B7280] font-normal">(select multiple)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const selected = formik.values.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        selected
                          ? 'bg-[#4F46E5] border-[#4F46E5] text-white'
                          : 'bg-white border-gray-200 text-[#6B7280] hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
              {formik.touched.interests && formik.errors.interests && (
                <p className="text-[#DC2626] text-xs mt-1.5">{formik.errors.interests}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4F46E5] hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Finding destinations...
                </>
              ) : (
                'Get Recommendations'
              )}
            </button>
          </form>
        </div>

        {/* Results grid */}
        {destinations.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {submittedLocation ? `Places to Visit in ${submittedLocation}` : 'Recommended for You'}
                </h2>
                <p className="text-sm text-[#6B7280] mt-0.5">
                  {destinations.length} destinations matched your preferences
                  {source === 'cache' && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Cached</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => dispatch(clearAIResult())}
                className="text-sm text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 px-4 py-1.5 rounded-lg transition-colors"
              >
                New Search
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {destinations.map((dest, i) => (
                <DestinationCard
                  key={dest.slug || i}
                  dest={dest}
                  index={i}
                  budget={formik.values.budget}
                  days={formik.values.days}
                  onExplore={handleExplore}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
