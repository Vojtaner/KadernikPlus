import { Box, TextField, InputAdornment, Button, Popover } from '@mui/material'
import { useState, useRef } from 'react'
import { type ColorResult, ChromePicker } from 'react-color'
import { useIntl } from 'react-intl'
import { useUpdateUserMutation, useUserDataQuery } from '../../queries'

const MuiColorPicker = () => {
  const { data: userData } = useUserDataQuery()
  const [color, setColor] = useState<string>(userData?.colorScheme ?? '#c81f5b')
  const [open, setOpen] = useState(false)
  const intl = useIntl()
  const anchorRef = useRef<HTMLButtonElement | null>(null)

  const { mutation: updateUserData } = useUpdateUserMutation()

  const handleChange = (newColor: ColorResult) => {
    setColor(newColor.hex)
  }

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <TextField
        label="Color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: color,
                  border: '1px solid rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      <Button variant="outlined" ref={anchorRef} onClick={() => setOpen((v) => !v)}>
        {intl.formatMessage({ defaultMessage: 'Zvolit', id: 'muiPicker.choose' })}
      </Button>
      <Button variant="outlined" onClick={() => updateUserData.mutate({ colorScheme: color })}>
        {intl.formatMessage({ defaultMessage: 'Uložit barvu', id: 'muiPicker.save' })}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <ChromePicker color={color} onChange={handleChange} />
      </Popover>
    </Box>
  )
}

export default MuiColorPicker
