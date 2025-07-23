import { Stack, Typography } from '@mui/material'

type NoteProps = { note?: string | null }

const Note = (props: NoteProps) => {
  const { note } = props

  return (
    <Stack direction="column" spacing={1} paddingY={1}>
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1, padding: 0, margin: 0 }}>
        Poznámka
      </Typography>
      <Typography variant="body2" textAlign="left" color="text.primary">
        {note}
      </Typography>
    </Stack>
  )
}
export default Note
