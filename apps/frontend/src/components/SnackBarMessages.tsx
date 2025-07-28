import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { selectSnackbarMessages } from '../hooks/useAddSnackBar'
import { removedSnackbarMessage } from '../store/snackBarReducer'
import MultipleSnackbars from './MultipleSnackbars'

export const SnackbarMessages = () => {
  const dispatch = useDispatch()
  const snackbarMessages = useSelector((state: RootState) => selectSnackbarMessages(state))

  return (
    <MultipleSnackbars>
      {snackbarMessages.map((message) => (
        <Snackbar
          open
          key={message.unique}
          onClick={() => dispatch(removedSnackbarMessage({ messageUnique: message.unique }))}
          sx={{ cursor: 'pointer' }}>
          <Alert severity={message.type}>{message.text}</Alert>
        </Snackbar>
      ))}
    </MultipleSnackbars>
  )
}
