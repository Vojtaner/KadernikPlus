import { Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type DetailColumnProps = {
  label: string
  input: string | ReactNode
  fontSize?: number
}

const DetailColumn = (props: DetailColumnProps) => {
  const { label, input, fontSize } = props
  const valueFontSize = fontSize ?? 14
  const labelFontSize = valueFontSize - 2

  return (
    <Stack direction="column">
      <Typography variant="caption" color="text.secondary" fontSize={labelFontSize}>
        {label}
      </Typography>
      <Typography variant="h6" color={'text.primary'} fontSize={valueFontSize}>
        {input}
      </Typography>
    </Stack>
  )
}
export default DetailColumn
