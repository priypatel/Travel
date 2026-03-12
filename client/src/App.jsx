import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe, logout } from './store/slices/authSlice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const dispatch = useDispatch();
  const { user, sessionChecked } = useSelector((state) => state.auth);

  // Restore session from HttpOnly cookie on every page load
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  // Wait until session check resolves before rendering routes
  if (!sessionChecked) return null;

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" replace />} />
      {/* Placeholder — home page will be built in Phase 2 */}
      <Route
        path="/"
        element={
          user ? (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-[#111827] mb-2">Welcome, {user.name}!</h1>
                <p className="text-[#6B7280] mb-6">You are logged in successfully. Home page coming in Phase 2.</p>
                <button
                  onClick={() => dispatch(logout())}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
