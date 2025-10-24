import { Stack, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import MenuBox from '../app/components/MenuBox';
import { useUserDataQuery } from '../queries';
import { toggleDrawer } from '../store/appUiSlice';
import { useAppSelector } from '../store/store';
import SearchBar from '../app/components/SearchBar';
import { AppLogo } from '../hairdresser/components/AppLogo';

const TopBar = () => {
  const dispatch = useDispatch();
  const isSearchActive = useAppSelector(state => state.appUi.isSearchActive);
  const { data: userData } = useUserDataQuery();
  const colorScheme = userData?.colorScheme ?? '#c81f5b';

  return (
    <Stack
      spacing={isSearchActive ? 0 : 1}
      sx={{
        height: 100,
        px: 2,
        py: 1,
        pb: isSearchActive ? 0 : 1,
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        transition: 'padding-bottom 0.7s ease',
        background: colorScheme,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <AppLogo
          sx={{
            transform: isSearchActive ? 'translateY(-120%)' : 'translateY(0)',
            transition: 'transform 0.5s ease-in-out',
          }}
        />
        {!isSearchActive && (
          <Button
            href="https://www.youtube.com/channel/UC5SCrgHyD3G0xJZ9Ad5vJ4w"
            variant="contained"
            color="info"
          >
            Video návody
          </Button>
        )}
      </Stack>

      <Stack spacing={4}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            transform: isSearchActive ? 'translateY(-70%)' : 'translateY(0)',
            transition: 'transform 0.5s ease-in-out',
            position: 'relative',
          }}
        >
          <SearchBar />
          <MenuBox onClick={() => dispatch(toggleDrawer())} />
        </Stack>
        {/* <TopBarFilterButtonsStack
          sx={{
            transform: `${!isSearchActive ? 'translateX(-160%)' : 'translateX(0)'}`,
            transition: 'transform 0.5s ease-in-out',
            position: 'absolute',
          }}
        /> */}
      </Stack>
    </Stack>
  );
};

export default TopBar;
