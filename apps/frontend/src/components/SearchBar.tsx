import Stack from '@mui/material/Stack'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton } from '@mui/material'
import TextField from './TextField'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useState } from 'react'

type SearchBarProps = {
  onClick: () => void
  isSearchActive: boolean
  onFocus: () => void
}

const SearchBar = (props: SearchBarProps) => {
  const { onClick, onFocus, isSearchActive } = props
  const [isFieldFocused, setIsFieldFocused] = useState(false)

  return (
    <Stack direction="row" sx={{ flex: 85, bgcolor: '#140f1124', borderRadius: '10px' }} justifyContent="space-between">
      <IconButton
        sx={{
          width: 48,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isFieldFocused ? 'rotate(-180deg)' : 'rotate(0deg)',
        }}
        onClick={onClick}>
        {isFieldFocused || isSearchActive ? (
          <ArrowForwardIosIcon sx={{ color: '#f0f0f0' }} fontSize="medium" />
        ) : (
          <SearchIcon sx={{ color: '#f0f0f0' }} fontSize="medium" />
        )}
      </IconButton>
      {/* <TextField
        fieldPath=""
        placeholder="Vyhledej zákazníka..."
        onFocus={() => {
          setIsFieldFocused(true)
          onFocus()
        }}
        onBlur={() => setIsFieldFocused(false)}
        sx={{
          width: '100%',
          background: 'none',
          '& .MuiInputBase-root': {
            color: 'white',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
      /> */}
    </Stack>
  )
}

export default SearchBar
