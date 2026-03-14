import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAIRecommendation, fetchAIDestinationBySlug } from '../../api/aiApi';

// POST /ai/recommend → { destinations: [...], source }
export const getAIRecommendation = createAsyncThunk(
  'ai/recommend',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetchAIRecommendation(payload);
      return res.data; // { destinations, source }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'AI recommendation failed. Please try again.'
      );
    }
  }
);

// GET /ai/destination/:slug → { destination, plans, source }
export const getAIDestinationBySlug = createAsyncThunk(
  'ai/destinationBySlug',
  async ({ slug, budget, days, name }, { rejectWithValue }) => {
    try {
      const res = await fetchAIDestinationBySlug(slug, { budget, days, name });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load destination details.'
      );
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    destinations: [],    // [{ destinationName, country, reason, bestSeason, tags, slug }]
    source: null,
    loading: false,
    error: null,
    destinationDetail: null, // { destination, plans, source }
    detailLoading: false,
    detailError: null,
  },
  reducers: {
    clearAIResult(state) {
      state.destinations = [];
      state.source = null;
      state.error = null;
    },
    clearAIDetail(state) {
      state.destinationDetail = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAIRecommendation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.destinations = [];
      })
      .addCase(getAIRecommendation.fulfilled, (state, action) => {
        state.loading = false;
        state.destinations = action.payload.destinations || [];
        state.source = action.payload.source;
      })
      .addCase(getAIRecommendation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAIDestinationBySlug.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.destinationDetail = null;
      })
      .addCase(getAIDestinationBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.destinationDetail = action.payload;
      })
      .addCase(getAIDestinationBySlug.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      });
  },
});

export const { clearAIResult, clearAIDetail } = aiSlice.actions;
export default aiSlice.reducer;
