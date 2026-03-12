import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { getAIRecommendation, clearAIResult } from '../store/slices/aiSlice';

const BUDGET_OPTIONS = [
  { value: 'Low', label: 'Budget' },
  { value: 'Medium', label: 'Medium Budget' },
  { value: 'High', label: 'Luxury' },
];

const TRAVEL_STYLE_OPTIONS = [
  'Adventure',
  'Relaxing',
  'Culture',
  'Family',
  'Romantic',
  'Solo',
];

const INTEREST_OPTIONS = [
  'Nature',
  'Photography',
  'History',
  'Food',
  'Nightlife',
  'Shopping',
  'Art',
  'Music',
  'Beaches',
  'Hiking',
  'Architecture',
  'Wildlife',
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

export default function AISearchPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { result, loading, error } = useSelector((state) => state.ai);

  const formik = useFormik({
    initialValues: {
      location: '',
      budget: 'Medium',
      days: 5,
      travelStyle: 'Culture',
      interests: [],
    },
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        ...values,
        location: values.location.trim() || 'anywhere',
        days: Number(values.days),
      };
      dispatch(getAIRecommendation(payload));
    },
  });

  const toggleInterest = (interest) => {
    const current = formik.values.interests;
    if (current.includes(interest)) {
      formik.setFieldValue(
        'interests',
        current.filter((i) => i !== interest)
      );
    } else {
      formik.setFieldValue('interests', [...current, interest]);
    }
  };

  const handleNewSearch = () => {
    dispatch(clearAIResult());
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="text-center pt-14 pb-10 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
          Advanced Search
        </h1>
        <p className="mt-3 text-[#6B7280] text-lg">
          Get personalized travel recommendations based on your preferences
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-20">
        {/* ── Error banner ───────────────────────────────────────── */}
        {error && (
          <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* ── Form card ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-[#0F172A] mb-1">
            Find Your Perfect Destination
          </h2>
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

            {/* Budget + Days row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">
                  Budget Range
                </label>
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
                {formik.touched.budget && formik.errors.budget && (
                  <p className="text-[#DC2626] text-xs mt-1">{formik.errors.budget}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">
                  Travel Length (days)
                </label>
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
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Travel Style
              </label>
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
              {formik.touched.travelStyle && formik.errors.travelStyle && (
                <p className="text-[#DC2626] text-xs mt-1">{formik.errors.travelStyle}</p>
              )}
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Interests{' '}
                <span className="text-[#6B7280] font-normal">(select multiple)</span>
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
                  Finding your destination...
                </>
              ) : (
                'Get Recommendations'
              )}
            </button>
          </form>
        </div>

        {/* ── Result card (below form) ────────────────────────────── */}
        {result && (
          <div className="bg-white rounded-2xl shadow-md p-6 mt-8 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">
                  AI Recommendation
                </p>
                <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                  {result.recommendedDestination}
                </h2>
                <p className="text-[#6B7280] leading-relaxed text-sm">
                  {result.reason}
                </p>

                <div className="flex flex-wrap gap-3 mt-5">
                  {result.matchedDestination ? (
                    <Link
                      to={`/destinations/${result.matchedDestination._id}`}
                      className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
                    >
                      Explore in Database
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ) : null}
                  <button
                    onClick={() => navigate(`/ai-destination?name=${encodeURIComponent(result.recommendedDestination)}`)}
                    className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
                  >
                    View Full Details
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNewSearch}
                    className="inline-flex items-center gap-2 border border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 font-medium text-sm px-5 py-2.5 rounded-xl transition-colors"
                  >
                    New Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
