import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetchWishlist, apiAddToWishlist, apiRemoveFromWishlist } from '../../api/wishlistApi';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await apiFetchWishlist();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load wishlist');
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (destinationId, { rejectWithValue }) => {
  try {
    await apiAddToWishlist(destinationId);
    return String(destinationId);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to wishlist');
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (destinationId, { rejectWithValue }) => {
  try {
    await apiRemoveFromWishlist(destinationId);
    return String(destinationId);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove from wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],       // full destination objects
    savedIds: [],    // plain string[] — serializable, Immer-safe
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.savedIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading  = false;
        state.items    = action.payload;
        state.savedIds = action.payload.map((d) => String(d._id));
      })
      .addCase(fetchWishlist.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.savedIds.includes(action.payload)) {
          state.savedIds.push(action.payload);
        }
      })

      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.savedIds = state.savedIds.filter((id) => id !== action.payload);
        state.items    = state.items.filter((d) => String(d._id) !== action.payload);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
