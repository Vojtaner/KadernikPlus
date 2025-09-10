import { useEffect } from 'react'
import SearchResult from '../../components/SearchResult'
import { useAddSnackbarMessage } from '../../hooks/useAddSnackBar'
import { useAppCurrentWatch } from '../../reactHookForm/store'
import Loader from './Loader'
import { useSearchClientsQuery } from '../client/queries'

const SearchResults = (props: { isSearchActive: boolean; onActiveSearch: (state: boolean) => void }) => {
  const { isSearchActive, onActiveSearch } = props
  const searchValue = useAppCurrentWatch('searchValue')
  const {
    data: searchData,
    isSuccess,
    isError,
    isLoading,
  } = useSearchClientsQuery({ nameOrPhone: searchValue as string }, !!searchValue)
  const addSnackBarMessage = useAddSnackbarMessage()

  useEffect(() => {
    if (isSuccess) {
      addSnackBarMessage({ text: 'Výsledky hledání nalezeny.', type: 'success' })
    }

    if (isError) {
      addSnackBarMessage({ text: 'Výsledky hledání nenalezeny.', type: 'error' })
    }
  }, [isSuccess, isError])

  if (isLoading) {
    return <Loader />
  }
  if (!searchData?.length) {
    return null
  }

  return (
    <>
      {searchData.map((client) => {
        return (
          <SearchResult
            onActiveSearch={onActiveSearch}
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
