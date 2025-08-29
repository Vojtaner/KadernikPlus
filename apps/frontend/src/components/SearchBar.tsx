import { useState, useEffect } from 'react'
import { Stack, IconButton, type SxProps, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import TextField from './TextField'
import { useSearchClientsQuery } from '../queries'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import { useForm } from 'react-hook-form'
import ClearIcon from '@mui/icons-material/Clear'

type SearchBarProps = {
  onClick?: () => void
  onFocus?: () => void
  sx?: SxProps
  isActive: boolean
  onToggleActive?: (active: boolean) => void
}

const SearchBar = (props: SearchBarProps) => {
  const { onClick, onFocus, isActive, onToggleActive } = props
  const [internalActive, setInternalActive] = useState(false)
  const isFieldFocused = isActive ?? internalActive
  const { control, watch, reset } = useForm<{ searchValue: string }>({ defaultValues: { searchValue: '' } })
  const searchValue = watch('searchValue')
  const { refetch } = useSearchClientsQuery({ nameOrPhone: searchValue }, !!searchValue)

  useEffect(() => {
    if (!searchValue) {
      return
    }

    const handler = setTimeout(() => {
      refetch()
    }, 500)

    return () => clearTimeout(handler)
  }, [searchValue])

  const handleOpenField = () => {
    onClick?.()
    onFocus?.()
    setInternalActive((prev) => {
      onToggleActive?.(!prev)
      return !prev
    })
  }

  const handleFocusField = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const searchPlaceholder = 'Vyhledej zákazníka...'
  const searchPlaceholderHint = 'Zadejte jméno, přijmení...'

  return (
    <Stack
      onClick={handleOpenField}
      direction="row"
      sx={{ flex: 85, bgcolor: '#140f1124', borderRadius: '10px' }}
      justifyContent="space-between">
      <IconButton
        sx={{
          ...props.sx,
          width: 48,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}>
        {isFieldFocused ? (
          <SearchOffIcon sx={{ color: '#f0f0f0' }} fontSize="medium" />
        ) : (
          <SearchIcon sx={{ color: '#f0f0f0' }} fontSize="medium" />
        )}
      </IconButton>
      {!isFieldFocused && (
        <Typography
          display="flex"
          alignItems="center"
          color="#ffffff91"
          sx={{
            width: '100%',
          }}>
          {isFieldFocused ? searchPlaceholderHint : searchPlaceholder}
        </Typography>
      )}

      {isFieldFocused && (
        <TextField
          fieldPath="searchValue"
          control={control}
          type="search"
          placeholder={isFieldFocused ? searchPlaceholderHint : searchPlaceholder}
          onClick={(e) => handleFocusField(e)}
          slotProps={{
            input: {
              endAdornment: (
                <IconButton onClick={() => reset({ searchValue: '' })} edge="end" size="small">
                  <ClearIcon fontSize="small" sx={{ color: 'white' }} />
                </IconButton>
              ),
            },
          }}
          sx={{
            width: '100%',
            alignSelf: 'center',
            background: 'none',
            '& .MuiInputBase-root': {
              color: '#ffffffb5',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '& .MuiOutlinedInput-input': {
              padding: '0',
            },
            '& input[type="search"]::-webkit-search-cancel-button': {
              display: 'none',
            },
          }}
        />
      )}
    </Stack>
  )
}

export default SearchBar
