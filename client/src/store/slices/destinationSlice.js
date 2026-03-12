import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchDestinations,
  fetchDestinationById,
  fetchDestinationPlaces,
  fetchDestinationRestaurants,
  fetchDestinationStays,
} from '../../api/destinationsApi';

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const getDestinations = createAsyncThunk(
  'destinations/getAll',
  async (month, { rejectWithValue }) => {
    try {
      const data = await fetchDestinations(month);
      return data.data; // array of destinations
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load destinations');
    }
  }
);

export const getDestinationById = createAsyncThunk(
  'destinations/getById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchDestinationById(id);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Destination not found');
    }
  }
);

export const getDestinationDetail = createAsyncThunk(
  'destinations/getDetail',
  async (id, { rejectWithValue }) => {
    try {
      const [destRes, placesRes, restaurantsRes, staysRes] = await Promise.all([
        fetchDestinationById(id),
        fetchDestinationPlaces(id),
        fetchDestinationRestaurants(id),
        fetchDestinationStays(id),
      ]);
      return {
        destination: destRes.data,
        places: placesRes.data,
        restaurants: restaurantsRes.data,
        stays: staysRes.data,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load destination details');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const destinationSlice = createSlice({
  name: 'destinations',
  initialState: {
    list: [],           // all destinations (home page)
    detail: null,       // single destination
    places: [],
    restaurants: [],
    stays: [],
    loading: false,
    error: null,
    activeMonth: null,  // currently selected month filter
  },
  reducers: {
    setActiveMonth(state, action) {
      state.activeMonth = action.payload;
    },
    clearDetail(state) {
      state.detail = null;
      state.places = [];
      state.restaurants = [];
      state.stays = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // getDestinations
    builder
      .addCase(getDestinations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // getDestinationDetail
    builder
      .addCase(getDestinationDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDestinationDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload.destination;
        state.places = action.payload.places;
        state.restaurants = action.payload.restaurants;
        state.stays = action.payload.stays;
      })
      .addCase(getDestinationDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveMonth, clearDetail } = destinationSlice.actions;
export default destinationSlice.reducer;
