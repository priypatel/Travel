import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';

/**
 * Reusable heart/wishlist toggle button.
 * Props:
 *   destinationId — string
 *   className     — optional extra classes for the button wrapper
 *   size          — 'sm' (default) | 'md'
 */
export default function WishlistButton({ destinationId, className = '', size = 'sm' }) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useSelector((state) => state.auth);
  const savedIds  = useSelector((state) => state.wishlist.savedIds);
  const isSaved   = savedIds.includes(String(destinationId));

  const iconSize  = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  const btnSize   = size === 'md' ? 'w-10 h-10' : 'w-8 h-8';

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirect to login, then come back here
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    if (isSaved) dispatch(removeFromWishlist(destinationId));
    else         dispatch(addToWishlist(destinationId));
  };

  return (
    <button
      onClick={handleClick}
      title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
      className={`${btnSize} bg-white shadow-md hover:bg-gray-50 rounded-full flex items-center justify-center transition-colors ${className}`}
    >
      <svg
        className={`${iconSize} transition-colors ${isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
        fill={isSaved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}
