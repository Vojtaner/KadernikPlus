import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type AppLanguage = 'cs' | 'en'

interface AppUiState {
  isDrawerOpen: boolean
  language: AppLanguage
  searchText: string
}

const initialState: AppUiState = {
  isDrawerOpen: true,
  language: 'cs',
  searchText: '',
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
  },
})

export const { toggleDrawer, setDrawerOpen, setLanguage, setSearchText } = appUiSlice.actions

export default appUiSlice.reducer
