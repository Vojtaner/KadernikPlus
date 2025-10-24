import { Typography } from '@mui/material';
import { useAppSelector } from '../../store/store';
import SearchResult from '../../components/SearchResult';
import { FormattedMessage } from 'react-intl';

const SearchResults = () => {
  const isSearchActive = useAppSelector(state => state.appUi.isSearchActive);
  const searchResults = useAppSelector(state => state.searchResults);

  if (!isSearchActive) {
    return null;
  }

  if (isSearchActive && !searchResults.searchResults.length) {
    return (
      <Typography>
        <FormattedMessage id="searchResult.noData" defaultMessage="Data nenalezena" />
      </Typography>
    );
  }

  return (
    <>
      {searchResults.searchResults.map(client => {
        return (
          <SearchResult
            key={client.id}
            sx={{
              transform: `${!isSearchActive ? 'translateX(-160%)' : 'translateX(0)'}`,
              transition: 'transform 0.5s ease-in-out',
            }}
            clientData={client}
          />
        );
      })}
    </>
  );
};

export default SearchResults;
