import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  return (
    <Stack
      direction={'row'}
      sx={{ flex: 85, bgcolor: '#ffffff38', borderRadius: '10px' }}
      justifyContent={'space-between'}
    >
      <Typography
        alignContent={'center'}
        color="#f0f0f0"
        sx={{
          textAlign: 'left',
          paddingY: 1,
          paddingX: 2,
        }}
      >
        Vyhledej zákazníka...
      </Typography>
      <Box
        sx={{
          width: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SearchIcon sx={{ color: '#f0f0f0' }} fontSize="medium" />
      </Box>
    </Stack>
  );
};

export default SearchBar;
