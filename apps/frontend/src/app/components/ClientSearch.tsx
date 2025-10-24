import { InputBase } from '@mui/material';
import Fuse from 'fuse.js';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useClientsQuery, useSearchClientsQuery } from '../../hairdresser/client/queries';
import { setSearchResults } from '../../store/searchResultsReducer';
import { useAppDispatch } from '../../store/store';
import { useIntl } from 'react-intl';
import { setSearchState } from '../../store/appUiSlice';
import { queryClient } from '../../reactQuery/reactTanstackQuerySetup';
import { useDebounce } from '../../hooks';

const ClientSearch = () => {
  const { data: clients } = useClientsQuery();
  const [query, setQuery] = useState('');
  const intl = useIntl();
  const debouncedQuery = useDebounce(query, 200);
  const dispatch = useAppDispatch();

  const prevResultsRef = useRef<string>('');

  const fuse = useMemo(
    () =>
      new Fuse(clients ?? [], {
        keys: ['firstName', 'lastName', 'phone'],
        threshold: 0.3,
      }),
    [clients],
  );

  const defaultClients = useMemo(() => clients?.slice(0, 20).map(client => client.id), []);

  const results = debouncedQuery
    ? fuse.search(debouncedQuery).map(r => r.item.id)
    : (defaultClients ?? []);

  const resultsKey = JSON.stringify(results);
  const { data: clientsWithVisits } = useSearchClientsQuery(results, !!results.length);

  useEffect(() => {
    if (resultsKey !== prevResultsRef.current) {
      prevResultsRef.current = resultsKey;
      queryClient.invalidateQueries({ queryKey: ['searchClients'] });
    }

    if (clientsWithVisits) {
      dispatch(setSearchResults(clientsWithVisits));
    }
  }, [resultsKey, clientsWithVisits, dispatch]);

  return (
    <InputBase
      placeholder={intl.formatMessage({
        defaultMessage: 'Zadejte jméno, příjmení...',
        id: 'searchPlaceholder',
      })}
      fullWidth
      onBlur={() => setQuery('')}
      onClick={e => {
        dispatch(setSearchState(true));
        e.stopPropagation();
      }}
      value={query}
      onChange={e => setQuery(e.target.value)}
      sx={{ color: '#ffffff' }}
    />
  );
};

export default ClientSearch;
