// src/store/appSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type AppLanguage = 'cs' | 'en'

interface AppState {
  isDrawerOpen: boolean
  language: AppLanguage
  searchText: string
}

const initialState: AppState = {
  isDrawerOpen: true,
  language: 'cs',
  searchText: '',
}

const appSlice = createSlice({
  name: 'app',
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

export const { toggleDrawer, setDrawerOpen, setLanguage, setSearchText } = appSlice.actions

export default appSlice.reducer
