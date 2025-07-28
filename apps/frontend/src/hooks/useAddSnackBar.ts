import { useDispatch } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import { addedSnackbarMessage, removedSnackbarMessage, type SnackbarMessage } from '../store/snackBarReducer'
import type { RootState } from '../store'
import { v4 as uuidv4 } from 'uuid'

export const useAddSnackbarMessage = () => {
  const dispatch = useDispatch()

  return (message: Omit<SnackbarMessage, 'unique'> & Partial<Pick<SnackbarMessage, 'unique'>>, timeout = 5000) => {
    const newMessage = { ...(message ?? 'Neznámá chyba'), unique: message.unique || uuidv4() }

    dispatch(addedSnackbarMessage(newMessage))
    setTimeout(() => dispatch(removedSnackbarMessage({ messageUnique: newMessage.unique })), timeout)
  }
}

export const selectSnackbarMessages = createSelector(
  [(state: RootState) => state.snackbarMessage.messages],
  (messages) => messages
)
