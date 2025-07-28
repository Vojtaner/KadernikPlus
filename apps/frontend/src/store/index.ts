import { configureStore } from '@reduxjs/toolkit'

import appUiSlice from './appUiSlice'
import snackBarReducer from './snackBarReducer'

const rootReducer = {
  appUi: appUiSlice,
  snackbarMessage: snackBarReducer,
}

const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
