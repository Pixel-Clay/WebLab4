import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkPoint as apiCheckPoint, checkPointFromClick as apiCheckPointFromClick, getHistory, clearHistory as apiClearHistory } from '../../services/api';

export const checkPoint = createAsyncThunk(
  'points/check',
  async ({ x, y, r }, { rejectWithValue }) => {
    try {
      const response = await apiCheckPoint(x, y, r);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to check point');
    }
  }
);

export const checkPointFromClick = createAsyncThunk(
  'points/checkFromClick',
  async ({ x, y, r }, { rejectWithValue }) => {
    try {
      const response = await apiCheckPointFromClick(x, y, r);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to check point');
    }
  }
);

export const loadHistory = createAsyncThunk(
  'points/loadHistory',
  async ({ offset = 0, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await getHistory(offset, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to load history');
    }
  }
);

export const clearHistory = createAsyncThunk(
  'points/clearHistory',
  async (_, { rejectWithValue }) => {
    try {
      await apiClearHistory();
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to clear history');
    }
  }
);

const pointsSlice = createSlice({
  name: 'points',
  initialState: {
    points: [],
    currentPoint: null,
    loading: false,
    error: null,
    totalCount: 0,
    currentOffset: 0,
    pageSize: 20,
  },
  reducers: {
    setCurrentPoint: (state, action) => {
      state.currentPoint = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkPoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPoint.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPoint = action.payload;
        state.error = null;
      })
      .addCase(checkPoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkPointFromClick.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPointFromClick.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPoint = action.payload;
        state.error = null;
      })
      .addCase(checkPointFromClick.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadHistory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.data) {
          state.points = action.payload.data;
          state.totalCount = action.payload.total || 0;
          state.currentOffset = action.payload.offset || 0;
          state.pageSize = action.payload.limit || 20;
        } else {
          state.points = Array.isArray(action.payload) ? action.payload : [];
          state.totalCount = state.points.length;
        }
      })
      .addCase(loadHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearHistory.fulfilled, (state) => {
        state.loading = false;
        state.points = [];
        state.currentPoint = null;
        state.totalCount = 0;
        state.currentOffset = 0;
      })
      .addCase(clearHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentPoint, clearError } = pointsSlice.actions;
export default pointsSlice.reducer;


