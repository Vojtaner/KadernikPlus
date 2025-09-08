import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { type SnackbarMessage } from '../../store/snackBarReducer'
import MultipleSnackbars from './MultipleSnackbars'

export const SnackbarMessages = (props: {
  snackbarMessages: SnackbarMessage[]
  onRemoveSnackMessage: (uniqueMessage: string) => void
}) => {
  const { snackbarMessages, onRemoveSnackMessage } = props

  return (
    <MultipleSnackbars>
      {snackbarMessages.map((message) => (
        <Snackbar
          open
          key={message.unique}
          onClick={() => onRemoveSnackMessage(message.unique)}
          sx={{ cursor: 'pointer' }}>
          <Alert severity={message.type}>{message.text}</Alert>
        </Snackbar>
      ))}
    </MultipleSnackbars>
  )
}
