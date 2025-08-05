import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type AppLanguage = 'cs' | 'en'

interface AppUiState {
  isDrawerOpen: boolean
  language: AppLanguage
  searchText: string
  currentLocationAppendix: string
}

const initialState: AppUiState = {
  isDrawerOpen: false,
  language: 'cs',
  searchText: '',
  currentLocationAppendix: '',
}

const appUiSlice = createSlice({
  name: 'appUi',
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload
    },
    setLanguage: (state, action: PayloadAction<AppLanguage>) => {
      state.language = action.payload
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload
    },
    setCurrentLocationAppendix: (state, action: PayloadAction<string>) => {
      state.currentLocationAppendix = action.payload
    },
  },
})

export const { toggleDrawer, setDrawerOpen, setLanguage, setSearchText, setCurrentLocationAppendix } =
  appUiSlice.actions

export default appUiSlice.reducer
