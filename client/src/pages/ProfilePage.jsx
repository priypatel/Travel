import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile, logout, clearError } from '../store/slices/authSlice';

function Avatar({ name, size = 'lg' }) {
  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  const sizeClass = size === 'lg' ? 'w-20 h-20 text-2xl' : 'w-10 h-10 text-sm';
  return (
    <div className={`${sizeClass} rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0`}>
      {initials}
    </div>
  );
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);
  const { items: wishlist } = useSelector((s) => s.wishlist);

  const [nameVal, setNameVal] = useState(user?.name || '');
  const [nameSuccess, setNameSuccess] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  const handleNameSave = async (e) => {
    e.preventDefault();
    if (!nameVal.trim() || nameVal.trim() === user.name) return;
    setNameSuccess(false);
    dispatch(clearError());
    const res = await dispatch(updateProfile({ name: nameVal.trim() }));
    if (res.meta.requestStatus === 'fulfilled') setNameSuccess(true);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);
    if (pwForm.newPassword !== pwForm.confirm) { setPwError('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { setPwError('Password must be at least 6 characters'); return; }
    dispatch(clearError());
    const res = await dispatch(updateProfile({
      currentPassword: pwForm.currentPassword,
      newPassword: pwForm.newPassword,
    }));
    if (res.meta.requestStatus === 'fulfilled') {
      setPwSuccess(true);
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
          <Avatar name={user.name} />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-[#0F172A] truncate">{user.name}</h1>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 capitalize">
                {user.role}
              </span>
              {memberSince && (
                <span className="text-xs text-gray-400">Member since {memberSince}</span>
              )}
              <span className="text-xs text-gray-400">
                {wishlist?.length ?? 0} saved {wishlist?.length === 1 ? 'destination' : 'destinations'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit name */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-[#0F172A] mb-4">Edit Name</h2>
          <form onSubmit={handleNameSave} className="flex gap-3">
            <input
              type="text"
              value={nameVal}
              onChange={(e) => { setNameVal(e.target.value); setNameSuccess(false); }}
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Your name"
            />
            <button
              type="submit"
              disabled={loading || !nameVal.trim() || nameVal.trim() === user.name}
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              Save
            </button>
          </form>
          {nameSuccess && <p className="text-xs text-green-600 mt-2">Name updated successfully.</p>}
          {error && !pwError && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-[#0F172A] mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSave} className="space-y-3">
            <input
              type="password"
              placeholder="Current password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="New password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {pwError && <p className="text-xs text-red-500">{pwError}</p>}
            {pwSuccess && <p className="text-xs text-green-600">Password changed successfully.</p>}
            {error && pwForm.currentPassword && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirm}
              className="w-full text-sm font-semibold py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving…' : 'Update password'}
            </button>
          </form>
        </div>

        {/* Sign out */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <button
            onClick={handleLogout}
            className="w-full text-sm font-semibold py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
          >
            Sign out
          </button>
        </div>

      </div>
    </div>
  );
}
