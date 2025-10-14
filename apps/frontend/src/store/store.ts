import { configureStore } from '@reduxjs/toolkit'
import appUiSlice from './appUiSlice'
import snackBarReducer from './snackBarReducer'
import { useDispatch, useSelector, useStore } from 'react-redux'
import searchResultsReducer from './searchResultsReducer'

const rootReducer = {
  appUi: appUiSlice,
  snackbarMessage: snackBarReducer,
  searchResults: searchResultsReducer,
}

const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store

export type AppDispatch = typeof store.dispatch
export type AppSelector = ReturnType<typeof store.getState>

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()

export default store
