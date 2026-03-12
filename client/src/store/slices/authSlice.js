import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser, logoutUser, getMeUser } from '../../api/authApi';

// --- Thunks ---

export const register = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      return await registerUser(formData); // server sets HttpOnly cookie
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      return await loginUser(formData); // server sets HttpOnly cookie
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await logoutUser(); // server clears cookie
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      return await getMeUser(); // restore session from cookie
    } catch {
      return rejectWithValue(null); // no active session — fail silently
    }
  }
);

// --- Slice ---

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    sessionChecked: false, // true once getMe has resolved
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // register
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // login
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // logout
    builder
      .addCase(logout.fulfilled, (state) => { state.user = null; })
      .addCase(logout.rejected, (state) => { state.user = null; }); // clear locally even if server fails

    // getMe — silent session restore on page load
    builder
      .addCase(getMe.fulfilled, (state, action) => { state.user = action.payload.user; state.sessionChecked = true; })
      .addCase(getMe.rejected, (state) => { state.user = null; state.sessionChecked = true; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
