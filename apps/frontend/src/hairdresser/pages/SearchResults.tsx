import { Typography } from '@mui/material'
import { useAppSelector } from '../../store/store'
import SearchResult from '../SearchResult'

const SearchResults = () => {
  const isSearchActive = useAppSelector((state) => state.appUi.isSearchActive)
  const searchResults = useAppSelector((state) => state.searchResults)

  if (isSearchActive && !searchResults.searchResults.length) {
    return <Typography>Data nenalezena</Typography>
  }

  return (
    <>
      {searchResults.searchResults.map((client) => {
        return (
          <SearchResult
            key={client.id}
            sx={{
              transform: `${!isSearchActive ? 'translateX(-160%)' : 'translateX(0)'}`,
              transition: 'transform 0.5s ease-in-out',
            }}
            clientData={client}
          />
        )
      })}
    </>
  )
}

export default SearchResults

// doladit dotahování návštěv
