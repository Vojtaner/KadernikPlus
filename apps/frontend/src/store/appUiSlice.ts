import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type AppLanguage = 'cs' | 'en';

type AppUiState = {
  isDrawerOpen: boolean;
  searchText: string;
  isSearchActive: boolean;
  currentLocationAppendix: string;
};

const initialState: AppUiState = {
  isDrawerOpen: false,
  isSearchActive: false,
  searchText: '',
  currentLocationAppendix: '',
};

const appUiSlice = createSlice({
  name: 'appUi',
  initialState,
  reducers: {
    toggleDrawer: state => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    setSearchState: (state, action: PayloadAction<boolean>) => {
      state.isSearchActive = action.payload;
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },

    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setCurrentLocationAppendix: (state, action: PayloadAction<string>) => {
      state.currentLocationAppendix = action.payload;
    },
  },
});

export const {
  toggleDrawer,
  setSearchState,
  setDrawerOpen,
  setSearchText,
  setCurrentLocationAppendix,
} = appUiSlice.actions;

export default appUiSlice.reducer;
