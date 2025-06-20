import { Stack, Typography } from '@mui/material'

type DetailColumnProps = {
  label: string
  value: string
}

const DetailColumn = (props: DetailColumnProps) => {
  const { label, value } = props

  return (
    <Stack direction="column">
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" color={'text.primary'}>
        {value}
      </Typography>
    </Stack>
  )
}
export default DetailColumn
