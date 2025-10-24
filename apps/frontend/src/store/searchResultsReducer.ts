import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ClientWithVisitsWithVisitServices } from '../entities/client';

export type SearchResultsStoreStateType = {
  searchResults: ClientWithVisitsWithVisitServices[];
};

export const initialsearchResultsStoreState: SearchResultsStoreStateType = {
  searchResults: [],
};

export const searchResultsSlice = createSlice({
  initialState: initialsearchResultsStoreState,
  name: 'searchResult',
  reducers: {
    setSearchResults: (state, action: PayloadAction<ClientWithVisitsWithVisitServices[]>) => {
      state.searchResults = action.payload;
    },
  },
});

export const { setSearchResults } = searchResultsSlice.actions;

export default searchResultsSlice.reducer;
