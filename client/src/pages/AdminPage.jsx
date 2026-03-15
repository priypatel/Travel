import { useState, useEffect, useCallback } from 'react';
import {
  apiListDestinations, apiCreateDestination, apiUpdateDestination, apiDeleteDestination,
  apiListPlaces, apiCreatePlace, apiUpdatePlace, apiDeletePlace,
  apiListRestaurants, apiCreateRestaurant, apiUpdateRestaurant, apiDeleteRestaurant,
  apiListStays, apiCreateStay, apiUpdateStay, apiDeleteStay,
} from '../api/adminApi';

const PLACE_CATEGORIES = [
  'Temple','Museum','Park','Beach','Market','Monument',
  'Nature','Castle','Palace','City','Valley','Lake',
  'Waterfall','Cave','Island','Desert','Other',
];
const PRICE_LEVELS = ['budget', 'mid-range', 'luxury'];

// ── Reusable UI ──────────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}
      {...props}
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white" {...props}>
      {children}
    </select>
  );
}

function Textarea({ ...props }) {
  return <textarea rows={3} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-none" {...props} />;
}

function SaveBtn({ loading, label = 'Add', disabled }) {
  return (
    <button type="submit" disabled={loading || disabled}
      className="text-sm font-semibold px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors">
      {loading ? 'Saving…' : label}
    </button>
  );
}

function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>{children}</div>;
}

function SectionTitle({ children }) {
  return <h3 className="text-sm font-semibold text-[#0F172A] mb-4">{children}</h3>;
}

// ── Inline edit row ──────────────────────────────────────────────────────────

function ItemRow({ children, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex gap-1 ml-2 shrink-0">
        <button onClick={onEdit}
          className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors px-2 py-1 rounded hover:bg-indigo-50">
          Edit
        </button>
        <button onClick={onDelete}
          className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50">
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Destination Form (Add + Edit) ────────────────────────────────────────────

function DestinationForm({ onCreated, editItem, onUpdated, onCancelEdit }) {
  const isEdit = !!editItem;
  const [form, setForm] = useState({ name:'', country:'', description:'', bestTime:'', heroImage:'', tags:'', lat:'', lng:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync form whenever editItem changes
  useEffect(() => {
    if (editItem) {
      setForm({
        name: editItem.name || '',
        country: editItem.country || '',
        description: editItem.description || '',
        bestTime: editItem.bestTime || '',
        heroImage: editItem.heroImage || '',
        tags: Array.isArray(editItem.tags) ? editItem.tags.join(', ') : '',
        lat: editItem.coordinates?.lat || '',
        lng: editItem.coordinates?.lng || '',
      });
      setError('');
    } else {
      setForm({ name:'', country:'', description:'', bestTime:'', heroImage:'', tags:'', lat:'', lng:'' });
    }
  }, [editItem]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required'); return; }
    setError(''); setLoading(true);
    try {
      if (isEdit) {
        const res = await apiUpdateDestination(editItem._id, form);
        onUpdated(res.data.data);
      } else {
        const res = await apiCreateDestination(form);
        onCreated(res.data.data);
        setForm({ name:'', country:'', description:'', bestTime:'', heroImage:'', tags:'', lat:'', lng:'' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>{isEdit ? `Edit: ${editItem.name}` : 'Add New Destination'}</SectionTitle>
        {isEdit && <button onClick={onCancelEdit} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>}
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name *"><Input placeholder="e.g. Goa" value={form.name} onChange={set('name')} /></Field>
          <Field label="Country"><Input placeholder="e.g. India" value={form.country} onChange={set('country')} /></Field>
        </div>
        <Field label="Description"><Textarea value={form.description} onChange={set('description')} placeholder="Short description…" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Best Time"><Input placeholder="e.g. October to March" value={form.bestTime} onChange={set('bestTime')} /></Field>
          <Field label="Tags (comma-separated)"><Input placeholder="beach, nature, culture" value={form.tags} onChange={set('tags')} /></Field>
        </div>
        <Field label="Hero Image URL"><Input placeholder="https://…" value={form.heroImage} onChange={set('heroImage')} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude"><Input type="number" step="any" placeholder="15.2993" value={form.lat} onChange={set('lat')} /></Field>
          <Field label="Longitude"><Input type="number" step="any" placeholder="74.1240" value={form.lng} onChange={set('lng')} /></Field>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex justify-end">
          <SaveBtn loading={loading} label={isEdit ? 'Save Changes' : 'Create Destination'} />
        </div>
      </form>
    </Card>
  );
}

// ── Destinations List ────────────────────────────────────────────────────────

function DestinationList({ destinations, selected, onSelect, onEdit, onDelete }) {
  if (!destinations.length) return <p className="text-sm text-gray-400">No destinations yet.</p>;
  return (
    <div className="space-y-2">
      {destinations.map((d) => (
        <div key={d._id}
          onClick={() => onSelect(d)}
          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${selected?._id === d._id ? 'border-indigo-400 bg-indigo-50' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}`}>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#0F172A] truncate">{d.name}</p>
            <p className="text-xs text-gray-400">{d.country}</p>
          </div>
          <div className="flex gap-1 ml-2 shrink-0">
            <button onClick={(e) => { e.stopPropagation(); onEdit(d); }}
              className="text-xs text-indigo-500 hover:text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100">Edit</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(d._id); }}
              className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Places Section ───────────────────────────────────────────────────────────

function PlacesSection({ destId }) {
  const [places, setPlaces] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', description:'', category:'Temple', image:'', lat:'', lng:'', dayIndex:'' });
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const res = await apiListPlaces(destId);
    setPlaces(res.data.data);
  }, [destId]);

  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setEdit = (k) => (e) => setEditForm((f) => ({ ...f, [k]: e.target.value }));

  const startEdit = (p) => {
    setEditing(p._id);
    setEditForm({
      name: p.name, description: p.description, category: p.category,
      image: p.image, lat: p.coordinates?.lat || '', lng: p.coordinates?.lng || '',
      dayIndex: p.dayIndex || '',
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await apiCreatePlace(destId, form);
      setForm({ name:'', description:'', category:'Temple', image:'', lat:'', lng:'', dayIndex:'' });
      load();
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (placeId) => {
    await apiUpdatePlace(destId, placeId, editForm);
    setEditing(null);
    load();
  };

  const handleDelete = async (placeId) => {
    await apiDeletePlace(destId, placeId);
    load();
  };

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle>Add Place</SectionTitle>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name *"><Input value={form.name} onChange={set('name')} placeholder="Place name" /></Field>
            <Field label="Category"><Select value={form.category} onChange={set('category')}>{PLACE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
          </div>
          <Field label="Description"><Textarea value={form.description} onChange={set('description')} placeholder="Description…" /></Field>
          <Field label="Image URL"><Input value={form.image} onChange={set('image')} placeholder="https://…" /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Latitude"><Input type="number" step="any" value={form.lat} onChange={set('lat')} placeholder="lat" /></Field>
            <Field label="Longitude"><Input type="number" step="any" value={form.lng} onChange={set('lng')} placeholder="lng" /></Field>
            <Field label="Day Index"><Input type="number" value={form.dayIndex} onChange={set('dayIndex')} placeholder="1" /></Field>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex justify-end"><SaveBtn loading={loading} /></div>
        </form>
      </Card>

      {places.length > 0 && (
        <Card>
          <SectionTitle>Places ({places.length})</SectionTitle>
          <div>
            {places.map((p) => (
              <div key={p._id}>
                {editing === p._id ? (
                  <div className="py-3 border-b border-gray-50 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input value={editForm.name} onChange={setEdit('name')} placeholder="Name" />
                      <Select value={editForm.category} onChange={setEdit('category')}>{PLACE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select>
                    </div>
                    <Textarea value={editForm.description} onChange={setEdit('description')} placeholder="Description" />
                    <Input value={editForm.image} onChange={setEdit('image')} placeholder="Image URL" />
                    <div className="grid grid-cols-3 gap-2">
                      <Input type="number" step="any" value={editForm.lat} onChange={setEdit('lat')} placeholder="lat" />
                      <Input type="number" step="any" value={editForm.lng} onChange={setEdit('lng')} placeholder="lng" />
                      <Input type="number" value={editForm.dayIndex} onChange={setEdit('dayIndex')} placeholder="Day" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(p._id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
                      <button onClick={() => setEditing(null)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <ItemRow onEdit={() => startEdit(p)} onDelete={() => handleDelete(p._id)}>
                    <p className="text-sm font-medium text-[#0F172A]">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category}{p.dayIndex ? ` · Day ${p.dayIndex}` : ''}</p>
                  </ItemRow>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Restaurants Section ───────────────────────────────────────────────────────

function RestaurantsSection({ destId }) {
  const [restaurants, setRestaurants] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', cuisine:'', priceLevel:'mid-range', rating:'4' });
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const res = await apiListRestaurants(destId);
    setRestaurants(res.data.data);
  }, [destId]);

  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setEdit = (k) => (e) => setEditForm((f) => ({ ...f, [k]: e.target.value }));

  const startEdit = (r) => {
    setEditing(r._id);
    setEditForm({ name: r.name, cuisine: r.cuisine, priceLevel: r.priceLevel, rating: String(r.rating) });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await apiCreateRestaurant(destId, form);
      setForm({ name:'', cuisine:'', priceLevel:'mid-range', rating:'4' });
      load();
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle>Add Restaurant</SectionTitle>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name *"><Input value={form.name} onChange={set('name')} placeholder="Restaurant name" /></Field>
            <Field label="Cuisine *"><Input value={form.cuisine} onChange={set('cuisine')} placeholder="e.g. Seafood, Indian" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price Level"><Select value={form.priceLevel} onChange={set('priceLevel')}>{PRICE_LEVELS.map((p) => <option key={p}>{p}</option>)}</Select></Field>
            <Field label="Rating (1–5)"><Input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={set('rating')} /></Field>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex justify-end"><SaveBtn loading={loading} /></div>
        </form>
      </Card>

      {restaurants.length > 0 && (
        <Card>
          <SectionTitle>Restaurants ({restaurants.length})</SectionTitle>
          <div>
            {restaurants.map((r) => (
              <div key={r._id}>
                {editing === r._id ? (
                  <div className="py-3 border-b border-gray-50 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input value={editForm.name} onChange={setEdit('name')} placeholder="Name" />
                      <Input value={editForm.cuisine} onChange={setEdit('cuisine')} placeholder="Cuisine" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={editForm.priceLevel} onChange={setEdit('priceLevel')}>{PRICE_LEVELS.map((p) => <option key={p}>{p}</option>)}</Select>
                      <Input type="number" min="1" max="5" step="0.1" value={editForm.rating} onChange={setEdit('rating')} placeholder="Rating" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={async () => { await apiUpdateRestaurant(destId, r._id, editForm); setEditing(null); load(); }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
                      <button onClick={() => setEditing(null)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <ItemRow onEdit={() => startEdit(r)} onDelete={async () => { await apiDeleteRestaurant(destId, r._id); load(); }}>
                    <p className="text-sm font-medium text-[#0F172A]">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.cuisine} · {r.priceLevel} · ★ {r.rating}</p>
                  </ItemRow>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Stays Section ─────────────────────────────────────────────────────────────

function StaysSection({ destId }) {
  const [stays, setStays] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', priceRange:'', priceLevel:'mid-range', rating:'4', location:'' });
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const res = await apiListStays(destId);
    setStays(res.data.data);
  }, [destId]);

  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setEdit = (k) => (e) => setEditForm((f) => ({ ...f, [k]: e.target.value }));

  const startEdit = (s) => {
    setEditing(s._id);
    setEditForm({ name: s.name, priceRange: s.priceRange, priceLevel: s.priceLevel, rating: String(s.rating), location: s.location });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await apiCreateStay(destId, form);
      setForm({ name:'', priceRange:'', priceLevel:'mid-range', rating:'4', location:'' });
      load();
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle>Add Stay</SectionTitle>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name *"><Input value={form.name} onChange={set('name')} placeholder="Hotel / Resort name" /></Field>
            <Field label="Location *"><Input value={form.location} onChange={set('location')} placeholder="e.g. North Goa" /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Price Range"><Input value={form.priceRange} onChange={set('priceRange')} placeholder="₹5000–₹10000/night" /></Field>
            <Field label="Price Level"><Select value={form.priceLevel} onChange={set('priceLevel')}>{PRICE_LEVELS.map((p) => <option key={p}>{p}</option>)}</Select></Field>
            <Field label="Rating (1–5)"><Input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={set('rating')} /></Field>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex justify-end"><SaveBtn loading={loading} /></div>
        </form>
      </Card>

      {stays.length > 0 && (
        <Card>
          <SectionTitle>Stays ({stays.length})</SectionTitle>
          <div>
            {stays.map((s) => (
              <div key={s._id}>
                {editing === s._id ? (
                  <div className="py-3 border-b border-gray-50 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input value={editForm.name} onChange={setEdit('name')} placeholder="Name" />
                      <Input value={editForm.location} onChange={setEdit('location')} placeholder="Location" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input value={editForm.priceRange} onChange={setEdit('priceRange')} placeholder="Price range" />
                      <Select value={editForm.priceLevel} onChange={setEdit('priceLevel')}>{PRICE_LEVELS.map((p) => <option key={p}>{p}</option>)}</Select>
                      <Input type="number" min="1" max="5" step="0.1" value={editForm.rating} onChange={setEdit('rating')} placeholder="Rating" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={async () => { await apiUpdateStay(destId, s._id, editForm); setEditing(null); load(); }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
                      <button onClick={() => setEditing(null)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <ItemRow onEdit={() => startEdit(s)} onDelete={async () => { await apiDeleteStay(destId, s._id); load(); }}>
                    <p className="text-sm font-medium text-[#0F172A]">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.location} · {s.priceLevel} · ★ {s.rating}</p>
                  </ItemRow>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Main AdminPage ────────────────────────────────────────────────────────────

const SUB_TABS = ['Places', 'Restaurants', 'Stays'];

export default function AdminPage() {
  const [destinations, setDestinations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editingDest, setEditingDest] = useState(null);
  const [subTab, setSubTab] = useState('Places');
  const [loadingDests, setLoadingDests] = useState(true);

  const loadDestinations = async () => {
    try {
      const res = await apiListDestinations();
      setDestinations(res.data.data);
    } finally { setLoadingDests(false); }
  };

  useEffect(() => { loadDestinations(); }, []);

  const handleCreated = (dest) => {
    setDestinations((d) => [dest, ...d]);
    setSelected(dest);
    setSubTab('Places');
  };

  const handleUpdated = (dest) => {
    setDestinations((d) => d.map((x) => x._id === dest._id ? dest : x));
    if (selected?._id === dest._id) setSelected(dest);
    setEditingDest(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this destination and all its data?')) return;
    await apiDeleteDestination(id);
    setDestinations((d) => d.filter((x) => x._id !== id));
    if (selected?._id === id) setSelected(null);
    if (editingDest?._id === id) setEditingDest(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4">
      <div className="max-w-[1100px] mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">Manage destinations, places, restaurants and stays</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: form + list */}
          <div className="space-y-6">
            <DestinationForm
              onCreated={handleCreated}
              editItem={editingDest}
              onUpdated={handleUpdated}
              onCancelEdit={() => setEditingDest(null)}
            />
            <Card>
              <SectionTitle>All Destinations ({destinations.length})</SectionTitle>
              {loadingDests
                ? <p className="text-sm text-gray-400">Loading…</p>
                : <DestinationList
                    destinations={destinations}
                    selected={selected}
                    onSelect={setSelected}
                    onEdit={(d) => { setEditingDest(d); setSelected(d); }}
                    onDelete={handleDelete}
                  />
              }
            </Card>
          </div>

          {/* Right: sub-data */}
          <div className="lg:col-span-2">
            {!selected ? (
              <Card className="flex items-center justify-center h-48">
                <p className="text-sm text-gray-400">Select or create a destination to manage its content</p>
              </Card>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A]">{selected.name}</h2>
                  <p className="text-sm text-gray-400">{selected.country}</p>
                </div>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                  {SUB_TABS.map((t) => (
                    <button key={t} onClick={() => setSubTab(t)}
                      className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-colors ${subTab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                      {t}
                    </button>
                  ))}
                </div>
                {subTab === 'Places'      && <PlacesSection      destId={selected._id} />}
                {subTab === 'Restaurants' && <RestaurantsSection destId={selected._id} />}
                {subTab === 'Stays'       && <StaysSection       destId={selected._id} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
