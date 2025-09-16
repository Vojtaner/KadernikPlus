import * as React from 'react'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export default function InputFileUpload(props: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  label: string
}) {
  return (
    <Button component="label" role={undefined} tabIndex={-1} startIcon={<CloudUploadIcon />}>
      {props.label}
      <VisuallyHiddenInput type="file" onChange={(event) => props.onChange(event)} multiple />
    </Button>
  )
}
