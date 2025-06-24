import Stack from '@mui/material/Stack'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton } from '@mui/material'
import TextField from './TextField'

type SearchBarProps = {
  onClick: () => void
}

const SearchBar = (props: SearchBarProps) => {
  const { onClick } = props

  return (
    <Stack
      direction={'row'}
      sx={{ flex: 85, bgcolor: '#ffffff38', borderRadius: '10px' }}
      justifyContent={'space-between'}>
      <IconButton
        sx={{
          width: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClick}>
        <SearchIcon sx={{ color: '#f0f0f0' }} fontSize="medium" />
      </IconButton>
      <TextField
        fieldPath="searchBar"
        placeholder="Vyhledej zákazníka..."
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
