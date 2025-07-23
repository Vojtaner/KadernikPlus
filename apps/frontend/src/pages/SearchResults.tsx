import SearchResult from '../components/SearchResult'
import { useSearchClientsQuery } from '../queries'
import { useAppCurrentWatch } from '../reactHookForm/store'

const SearchResults = (props: { isSearchActive: boolean }) => {
  const { isSearchActive } = props
  const searchValue = useAppCurrentWatch('searchValue')
  const { data: searchData } = useSearchClientsQuery({ nameOrPhone: searchValue as string }, !!searchValue)

  if (!searchData?.length) {
    return <></>
  }

  return (
    <>
      {searchData.map((client) => {
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
