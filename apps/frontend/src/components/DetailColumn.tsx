import { Stack, Typography } from '@mui/material'

type DetailColumnProps = {
  label: string
  value: string
  fontSize?: number
}

const DetailColumn = (props: DetailColumnProps) => {
  const { label, value, fontSize } = props
  const valueFontSize = fontSize ?? 14
  const labelFontSize = valueFontSize - 2

  return (
    <Stack direction="column">
      <Typography variant="caption" color="text.secondary" fontSize={labelFontSize}>
        {label}
      </Typography>
      <Typography variant="h6" color={'text.primary'} fontSize={valueFontSize}>
        {value}
      </Typography>
    </Stack>
  )
}
export default DetailColumn
