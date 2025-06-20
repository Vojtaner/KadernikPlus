import { Stack, Typography } from '@mui/material'

type DetailColumnProps = {
  label: string
  input: React.ReactNode
}

const DetailColumn = (props: DetailColumnProps) => {
  const { label, input } = props

  return (
    <Stack direction="column">
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" color={'text.primary'}>
        {input}
      </Typography>
    </Stack>
  )
}
export default DetailColumn
