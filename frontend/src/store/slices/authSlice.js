import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import {
  clearDemoSession,
  DEMO_ADMIN,
  isDemoCredentials,
  isDemoSession,
  isInvalidAuthPayload,
  isOfflineApiMode,
  normalizeCredentials,
  setDemoSession,
} from '../../utils/auth';

function activateDemoLogin() {
  setDemoSession();
  return DEMO_ADMIN.user;
}

export const demoLogin = createAsyncThunk('auth/demoLogin', async () => activateDemoLogin());

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  const normalized = normalizeCredentials(credentials);

  if (isOfflineApiMode() && isDemoCredentials(normalized)) {
    return activateDemoLogin();
  }

  try {
    const { data, headers } = await api.post('/auth/login', normalized);
    const contentType = headers?.['content-type'] || '';

    if (typeof data === 'string' || contentType.includes('text/html') || isInvalidAuthPayload(data)) {
      if (isDemoCredentials(normalized)) return activateDemoLogin();
      return rejectWithValue('Login failed. Please check your email and password.');
    }

    clearDemoSession();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  } catch (err) {
    if (isDemoCredentials(normalized)) return activateDemoLogin();
    return rejectWithValue(err.response?.data?.message || 'Login failed. Please check your email and password.');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  if (isDemoSession()) return DEMO_ADMIN.user;

  try {
    const { data } = await api.get('/auth/me');
    clearDemoSession();
    return data.user;
  } catch (err) {
    if (isDemoSession()) return DEMO_ADMIN.user;
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, initializing: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      clearDemoSession();
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(demoLogin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(demoLogin.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(demoLogin.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMe.pending, (state) => { state.initializing = true; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.initializing = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.initializing = false;
        if (isDemoSession()) state.user = DEMO_ADMIN.user;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;