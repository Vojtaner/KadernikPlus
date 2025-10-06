import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type AppLanguage = 'cs' | 'en'

type AppUiState = {
  isDrawerOpen: boolean
  searchText: string
  currentLocationAppendix: string
}

const initialState: AppUiState = {
  isDrawerOpen: false,
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

    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload
    },
    setCurrentLocationAppendix: (state, action: PayloadAction<string>) => {
      state.currentLocationAppendix = action.payload
    },
  },
})

export const { toggleDrawer, setDrawerOpen, setSearchText, setCurrentLocationAppendix } = appUiSlice.actions

export default appUiSlice.reducer
