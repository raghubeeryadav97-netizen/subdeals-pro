import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const defaultSettings = {
  site_name: 'SubDeals Pro',
  currency_symbol: '₹',
  whatsapp_number: '916381492284',
  theme: 'dark',
};

export const fetchSettings = createAsyncThunk('settings/fetch', async () => {
  try {
    const { data } = await api.get('/settings/public');
    return data.settings;
  } catch {
    return defaultSettings;
  }
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { data: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => { state.loading = true; })
      .addCase(fetchSettings.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchSettings.rejected, (state) => { state.loading = false; state.data = defaultSettings; });
  },
});

export default settingsSlice.reducer;