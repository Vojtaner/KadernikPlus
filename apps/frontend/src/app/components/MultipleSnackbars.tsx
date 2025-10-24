import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

interface MultipleSnackbarsProps {
  children: ReactNode;
  [key: string]: unknown;
}

const MultipleSnackbarsRoot = styled(Box, {
  name: 'MultipleSnackbars',
  slot: 'Root',
})(({ theme }) => ({
  position: 'fixed',
  left: theme.spacing(1),
  right: theme.spacing(1),
  bottom: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    left: theme.spacing(3),
    right: theme.spacing(3),
    bottom: theme.spacing(3),
  },
  maxWidth: 600,
  zIndex: theme.zIndex.snackbar,
  '& .MuiSnackbar-root': {
    position: 'relative',
    left: 'auto',
    bottom: 'auto',
    right: 'auto',
  },
  '& .MuiAlert-root': {
    borderRadius: '0.5rem',
    boxShadow: theme.shadows[6],
  },
}));

const MultipleSnackbars = ({ children, ...other }: MultipleSnackbarsProps) => {
  return (
    <MultipleSnackbarsRoot {...other}>
      <Stack spacing={2} direction="column-reverse">
        {children}
      </Stack>
    </MultipleSnackbarsRoot>
  );
};

export default MultipleSnackbars;
