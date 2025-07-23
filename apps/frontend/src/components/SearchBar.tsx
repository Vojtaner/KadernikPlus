import { useState, useEffect } from 'react'
import { Stack, IconButton, type SxProps } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useAppCurrentWatch, useAppFormContext } from '../reactHookForm/store'
import TextField from './TextField'
import { useSearchClientsQuery } from '../queries'

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
  const { control } = useAppFormContext()
  const searchValue = useAppCurrentWatch('searchValue')
  const { refetch } = useSearchClientsQuery({ nameOrPhone: searchValue as string }, !!searchValue)

  useEffect(() => {
    if (!searchValue) {
      return
    }

    const handler = setTimeout(() => {
      refetch()
    }, 1000)

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

  return (
    <Stack direction="row" sx={{ flex: 85, bgcolor: '#140f1124', borderRadius: '10px' }} justifyContent="space-between">
      <IconButton
        sx={{
          ...props.sx,
          width: 48,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}
        onClick={handleOpenField}>
        <SearchIcon sx={{ color: '#f0f0f0' }} fontSize="medium" />
      </IconButton>

      {isFieldFocused && (
        <TextField
          fieldPath="searchValue"
          control={control}
          type="search"
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
      )}
    </Stack>
  )
}

export default SearchBar
