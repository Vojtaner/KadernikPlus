import { useState, useEffect } from 'react'
import { Stack, IconButton, Typography, type SxProps } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import ClearIcon from '@mui/icons-material/Clear'
import { useForm, type Control } from 'react-hook-form'
import { useSearchClientsQuery } from '../../queries'
import TextField from './TextField'
import { useIntl } from 'react-intl'
import { useDebounce } from '../../hooks'

type SearchBarProps = {
  isActive?: boolean
  onToggleActive?: (active: boolean) => void
  sx?: SxProps
}

const SearchBar = ({ isActive, onToggleActive, sx }: SearchBarProps) => {
  const [internalActive, setInternalActive] = useState(false)
  const active = isActive ?? internalActive

  const { control, watch, reset } = useForm<{ searchValue: string }>({
    defaultValues: { searchValue: '' },
  })

  const searchValue = watch('searchValue')
  const debouncedSearch = useDebounce(searchValue, 500)
  const { refetch } = useSearchClientsQuery({ nameOrPhone: debouncedSearch }, !!debouncedSearch)

  useEffect(() => {
    if (debouncedSearch) {
      refetch()
    }
  }, [debouncedSearch, refetch])

  const toggleActive = () => {
    const next = !active
    setInternalActive(next)
    onToggleActive?.(next)
  }

  return (
    <SearchBarView
      isActive={active}
      value={searchValue}
      control={control}
      onToggle={toggleActive}
      onReset={() => reset({ searchValue: '' })}
      onInputClick={(e) => e.stopPropagation()}
      sx={sx}
    />
  )
}

type SearchBarViewProps = {
  isActive: boolean
  value: string
  onToggle: () => void
  onReset: () => void
  onInputClick: (e: React.MouseEvent) => void
  control: Control<
    {
      searchValue: string
    },
    {
      searchValue: string
    }
  >
  sx?: SxProps
}

const SearchBarView = ({ isActive, value, onToggle, onReset, onInputClick, control, sx }: SearchBarViewProps) => {
  const intl = useIntl()
  const searchInActivePlaceholder = intl.formatMessage({
    defaultMessage: 'Vyhledej zákazníka...',
    id: 'searchInactivePlaceholder',
  })
  const searchActivePlaceholder = intl.formatMessage({
    defaultMessage: 'Zadejte jméno, příjmení...',
    id: 'searchActivePlaceholder',
  })

  return (
    <Stack
      onClick={onToggle}
      direction="row"
      sx={{ flex: 85, bgcolor: '#140f1124', borderRadius: '10px' }}
      justifyContent="space-between">
      <IconButton sx={{ ...sx, width: 48 }}>
        {isActive ? <SearchOffIcon sx={{ color: '#f0f0f0' }} /> : <SearchIcon sx={{ color: '#f0f0f0' }} />}
      </IconButton>

      {!isActive ? (
        <Typography color="#ffffff91" sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          {searchInActivePlaceholder}
        </Typography>
      ) : (
        <TextField
          fieldPath="searchValue"
          control={control}
          type="search"
          placeholder={searchActivePlaceholder}
          onClick={onInputClick}
          slotProps={{
            input: {
              endAdornment: value && (
                <IconButton onClick={onReset} edge="end" size="small">
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
