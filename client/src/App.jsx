import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './store/slices/authSlice';
import { fetchWishlist, clearWishlist } from './store/slices/wishlistSlice';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AISearchPage from './pages/AISearchPage';
import AIDestinationDetailPage from './pages/AIDestinationDetailPage';
import WishlistPage from './pages/WishlistPage';

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const dispatch = useDispatch();
  const { sessionChecked, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  // Load wishlist on login, clear on logout
  useEffect(() => {
    if (user) dispatch(fetchWishlist());
    else      dispatch(clearWishlist());
  }, [dispatch, user]);

  if (!sessionChecked) return null;

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="pt-[72px]">
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/destinations/:id"  element={<DestinationDetailPage />} />
          <Route path="/login"             element={<LoginPage />} />
          <Route path="/register"          element={<RegisterPage />} />
          <Route path="/ai-search"         element={<AISearchPage />} />
          <Route path="/ai-destination"    element={<AIDestinationDetailPage />} />
          <Route path="/wishlist"          element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="*"                  element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
