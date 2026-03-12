import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAIRecommendation, searchDestinationByName, fetchAIDestinationDetails } from '../../api/aiApi';

// Gets AI recommendation then immediately looks up the destination in DB
export const getAIRecommendation = createAsyncThunk(
  'ai/recommend',
  async (payload, { rejectWithValue }) => {
    try {
      const aiRes = await fetchAIRecommendation(payload);
      const { recommendedDestination, reason } = aiRes.data;

      // Try to find a matching destination in DB for the detail page link
      const searchRes = await searchDestinationByName(recommendedDestination.split(',')[0].trim());
      const matchedDestination = searchRes.data || null;

      return { recommendedDestination, reason, matchedDestination };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'AI recommendation failed. Please try again.'
      );
    }
  }
);

export const getAIDestinationDetails = createAsyncThunk(
  'ai/destinationDetails',
  async (name, { rejectWithValue }) => {
    try {
      const res = await fetchAIDestinationDetails(name);
      return { name, ...res.data };
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
    result: null,             // { recommendedDestination, reason, matchedDestination }
    loading: false,
    error: null,
    destinationDetail: null,  // { name, description, coordinates, places, restaurants, stays }
    detailLoading: false,
    detailError: null,
  },
  reducers: {
    clearAIResult(state) {
      state.result = null;
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
        state.result = null;
      })
      .addCase(getAIRecommendation.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(getAIRecommendation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAIDestinationDetails.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.destinationDetail = null;
      })
      .addCase(getAIDestinationDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.destinationDetail = action.payload;
      })
      .addCase(getAIDestinationDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      });
  },
});

export const { clearAIResult, clearAIDetail } = aiSlice.actions;
export default aiSlice.reducer;
