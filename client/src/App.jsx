import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './store/slices/authSlice';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const dispatch = useDispatch();
  const { sessionChecked } = useSelector((state) => state.auth);

  // Restore session from HttpOnly cookie on every page load
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  // Wait until session check resolves before rendering routes
  if (!sessionChecked) return null;

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations/:id" element={<DestinationDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Phase 3 routes — placeholders */}
          <Route
            path="/ai-search"
            element={
              <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <p className="text-gray-400 font-medium">AI Search — coming in Phase 3</p>
              </div>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                  <p className="text-gray-400 font-medium">Wishlist — coming in Phase 3</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
