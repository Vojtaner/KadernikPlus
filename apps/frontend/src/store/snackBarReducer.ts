import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SnackbarMessage = {
  type: 'success' | 'error' | 'warning';
  text: string | undefined;
  unique: string;
};

export type SnackbarMessageStoreState = {
  messages: SnackbarMessage[];
};

export const initialSnackbarMessageStoreState: SnackbarMessageStoreState = {
  messages: [],
};

export const snackbarMessageSlice = createSlice({
  name: 'snackbarMessage',
  initialState: initialSnackbarMessageStoreState,
  reducers: {
    addedSnackbarMessage: (state, action: PayloadAction<SnackbarMessage>) => {
      state.messages.push(action.payload);
    },
    removedSnackbarMessage: (state, action: PayloadAction<{ messageUnique: string }>) => {
      state.messages = state.messages.filter(
        filterMessage => filterMessage.unique !== action.payload.messageUnique,
      );
    },
  },
});

export const { removedSnackbarMessage, addedSnackbarMessage } = snackbarMessageSlice.actions;

export default snackbarMessageSlice.reducer;
