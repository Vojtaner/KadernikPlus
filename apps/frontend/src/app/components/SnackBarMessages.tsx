import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { removedSnackbarMessage } from '../../store/snackBarReducer'
import MultipleSnackbars from './MultipleSnackbars'
import { useDispatch, useSelector } from 'react-redux'
import { selectSnackbarMessages } from '../../hooks/useAddSnackBar'
import type { RootState } from '../../store/store'

export const SnackbarMessages = () => {
  const snackbarMessages = useSelector((state: RootState) => selectSnackbarMessages(state))
  const dispatch = useDispatch()

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
