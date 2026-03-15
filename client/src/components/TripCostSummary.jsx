// USD rates — used for AI page and all non-India destinations
const COST_GUIDE_USD = {
  budget:      { stayMin: 15,  stayMax: 40,  mealMin: 5,  mealMax: 15,  totalMin: 30,  totalMax: 65,   label: 'Budget',    color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  'mid-range': { stayMin: 65,  stayMax: 120, mealMin: 15, mealMax: 40,  totalMin: 90,  totalMax: 160,  label: 'Mid-Range', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  luxury:      { stayMin: 200, stayMax: 500, mealMin: 50, mealMax: 120, totalMin: 260, totalMax: null, label: 'Luxury',    color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
};

// INR rates — used for India destinations on the regular detail page
const COST_GUIDE_INR = {
  budget:      { stayMin: 1200,  stayMax: 3500,  mealMin: 300,  mealMax: 800,  totalMin: 2500,  totalMax: 5500,  label: 'Budget',    color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  'mid-range': { stayMin: 5000,  stayMax: 10000, mealMin: 800,  mealMax: 2500, totalMin: 7500,  totalMax: 15000, label: 'Mid-Range', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  luxury:      { stayMin: 15000, stayMax: 50000, mealMin: 3000, mealMax: 8000, totalMin: 20000, totalMax: null,  label: 'Luxury',    color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
};

function isIndia(country) {
  if (!country) return false;
  return country.trim().toLowerCase() === 'india';
}

function fmt(val, symbol) {
  return `${symbol}${val.toLocaleString('en-IN')}`;
}
function range(min, max, symbol) {
  return max ? `${fmt(min, symbol)} – ${fmt(max, symbol)}` : `${fmt(min, symbol)}+`;
}

// country prop: pass destination country for currency detection (undefined = always USD)
export default function TripCostSummary({ budget = 'mid-range', days = 5, country }) {
  const useINR  = isIndia(country);
  const guide   = (useINR ? COST_GUIDE_INR : COST_GUIDE_USD)[budget]
               || (useINR ? COST_GUIDE_INR : COST_GUIDE_USD)['mid-range'];
  const symbol  = useINR ? '₹' : '$';
  const d = Math.max(1, Number(days) || 5);

  const stayTotal  = [guide.stayMin * d,     guide.stayMax ? guide.stayMax * d : null];
  const mealTotal  = [guide.mealMin * d * 3, guide.mealMax ? guide.mealMax * d * 3 : null];
  const grandTotal = [guide.totalMin * d,    guide.totalMax ? guide.totalMax * d : null];

  const perDayTotal = guide.totalMin;
  const stayPct  = Math.round((guide.stayMin / perDayTotal) * 100);
  const mealPct  = Math.round(((guide.mealMin * 3) / perDayTotal) * 100);
  const otherPct = Math.max(0, 100 - stayPct - mealPct);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${guide.border} p-5 mt-8`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">💰</span>
          <h3 className="font-bold text-[#0F172A]">Estimated Trip Cost</h3>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${guide.bg} ${guide.color}`}>
          {guide.label} · {d} day{d !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Breakdown rows */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
            Accommodation ({d} night{d !== 1 ? 's' : ''})
          </span>
          <span className="font-semibold text-[#0F172A]">{range(...stayTotal, symbol)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />
            Food &amp; Drinks (3 meals/day)
          </span>
          <span className="font-semibold text-[#0F172A]">{range(...mealTotal, symbol)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            Activities &amp; Misc
          </span>
          <span className="font-semibold text-gray-400 text-xs">Varies by destination</span>
        </div>
      </div>

      {/* Stacked progress bar */}
      <div className="h-2 rounded-full overflow-hidden flex mb-3 bg-gray-100">
        <div className="bg-indigo-500" style={{ width: `${stayPct}%` }} />
        <div className="bg-cyan-500" style={{ width: `${mealPct}%` }} />
        <div className="bg-amber-400" style={{ width: `${otherPct}%` }} />
      </div>

      {/* Bar legend */}
      <div className="flex gap-4 mb-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />Stay</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />Food</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />Other</span>
      </div>

      {/* Total */}
      <div className={`flex items-center justify-between ${guide.bg} rounded-xl px-4 py-3`}>
        <span className="text-sm font-bold text-[#0F172A]">Total Estimate</span>
        <span className={`text-xl font-bold ${guide.color}`}>{range(...grandTotal, symbol)}</span>
      </div>

      <p className="text-xs text-gray-400 mt-2 text-center">
        * Average {guide.label.toLowerCase()} costs in {useINR ? 'INR' : 'USD'}. Actual prices may vary by season and availability.
      </p>
    </div>
  );
}
