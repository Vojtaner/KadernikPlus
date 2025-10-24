import { Stack, IconButton, type SxProps } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setSearchState } from '../../store/appUiSlice';
import ClientSearch from './ClientSearch';

type SearchBarProps = {
  sx?: SxProps;
};

const SearchBar = ({ sx }: SearchBarProps) => {
  const isSearchActive = useAppSelector(state => state.appUi.isSearchActive);
  const dispatch = useAppDispatch();

  return (
    <Stack
      onClick={() => dispatch(setSearchState(!isSearchActive))}
      direction="row"
      sx={{ flex: 85, bgcolor: '#140f1124', borderRadius: '10px', height: '2.8rem' }}
      justifyContent="space-between"
    >
      <IconButton sx={{ ...sx, width: 48 }}>
        {isSearchActive ? (
          <SearchOffIcon sx={{ color: '#f0f0f0' }} />
        ) : (
          <SearchIcon sx={{ color: '#f0f0f0' }} />
        )}
      </IconButton>
      <ClientSearch />
    </Stack>
  );
};

export default SearchBar;
