import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import {
  clearDemoSession,
  DEMO_ADMIN,
  isDemoCredentials,
  isDemoSession,
  isInvalidAuthPayload,
  isOfflineApiMode,
  setDemoSession,
} from '../../utils/auth';

function activateDemoLogin() {
  setDemoSession();
  return DEMO_ADMIN.user;
}

function tryDemoLogin(credentials, err) {
  if (!isDemoCredentials(credentials)) return null;

  const apiDown =
    !err?.response ||
    err?.code === 'ERR_NETWORK' ||
    err?.code === 'ERR_INVALID_API' ||
    err?.invalidResponse;

  if (apiDown || isOfflineApiMode()) {
    return activateDemoLogin();
  }
  return null;
}

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  const normalized = {
    email: credentials.email?.trim().toLowerCase(),
    password: credentials.password,
  };

  if (isOfflineApiMode() && isDemoCredentials(normalized)) {
    return activateDemoLogin();
  }

  try {
    const { data, headers } = await api.post('/auth/login', normalized);
    const contentType = headers?.['content-type'] || '';

    if (typeof data === 'string' || contentType.includes('text/html') || isInvalidAuthPayload(data)) {
      const demoUser = tryDemoLogin(normalized, { invalidResponse: true });
      if (demoUser) return demoUser;
      return rejectWithValue('Server connect nahi ho pa raha. Demo login try karo.');
    }

    clearDemoSession();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  } catch (err) {
    const demoUser = tryDemoLogin(normalized, err);
    if (demoUser) return demoUser;
    return rejectWithValue(err.response?.data?.message || 'Login failed. API abhi connect nahi hai.');
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