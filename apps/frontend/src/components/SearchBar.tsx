import Stack from '@mui/material/Stack'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton } from '@mui/material'
import TextField from './TextField'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

type SearchBarProps = {
  onClick: () => void
  isSearchActive: boolean
  onFocus: () => void
}

const SearchBar = (props: SearchBarProps) => {
  const { onClick, isSearchActive, onFocus } = props

  return (
    <Stack direction="row" sx={{ flex: 85, bgcolor: '#ffffff38', borderRadius: '10px' }} justifyContent="space-between">
      <IconButton
        sx={{
          width: 48,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isSearchActive ? 'rotate(-180deg)' : 'rotate(0deg)',
        }}
        onClick={onClick}>
        {isSearchActive ? (
          <ArrowForwardIosIcon sx={{ color: '#f0f0f0' }} fontSize="medium" />
        ) : (
          <SearchIcon sx={{ color: '#f0f0f0' }} fontSize="medium" />
        )}
      </IconButton>
      <TextField
        fieldPath="searchBar"
        placeholder="Vyhledej zákazníka..."
        onClick={onFocus}
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
      />
    </Stack>
  )
}

export default SearchBar
