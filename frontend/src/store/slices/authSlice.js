import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import {
  clearDemoSession,
  DEMO_ADMIN,
  isDemoSession,
  setDemoSession,
} from '../../utils/auth';

function tryDemoLogin(credentials, err) {
  const apiDown = !err.response || err.code === 'ERR_NETWORK';
  const isDemoCreds =
    credentials.email === DEMO_ADMIN.email &&
    credentials.password === DEMO_ADMIN.password;

  if (apiDown && isDemoCreds) {
    setDemoSession();
    return DEMO_ADMIN.user;
  }
  return null;
}

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    clearDemoSession();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  } catch (err) {
    const demoUser = tryDemoLogin(credentials, err);
    if (demoUser) return demoUser;
    return rejectWithValue(err.response?.data?.message || 'Login failed');
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