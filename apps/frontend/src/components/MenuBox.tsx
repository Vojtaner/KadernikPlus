import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';

const MenuBox = () => {
  return (
    <Box
      sx={{
        width: 48,
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#ffffff38',
        borderRadius: '10px',
        justifyContent: 'center',
      }}
    >
      <MenuIcon fontSize="large" sx={{ color: '#f0f0f0' }} />
    </Box>
  );
};

export default MenuBox;
