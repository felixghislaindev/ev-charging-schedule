import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CarbonIntensityState {
  forecast: number;
  index: string;
}

const initialState: CarbonIntensityState = {
  forecast: 0,
  index: '',
};

const carbonIntensitySlice = createSlice({
  name: 'carbonIntensity',
  initialState,
  reducers: {
    setIntensity: (state, action: PayloadAction<{ forecast: number; index: string }>) => {
      state.forecast = action.payload.forecast;
      state.index = action.payload.index;
    },
  },
});

export const { setIntensity } = carbonIntensitySlice.actions;
export type RootState = {
    intensity: CarbonIntensityState;
  };
export default carbonIntensitySlice.reducer;
