// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'

import appSlice from './appSlice'

const rootReducer = {
  app: appSlice,
}

const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
