import { Paper as MuiPaper, type PaperProps as MuiPaperProps } from '@mui/material';
import type { ReactNode } from 'react';

type PaperProps = MuiPaperProps & { children: ReactNode };

const Paper = (props: PaperProps) => {
  return (
    <MuiPaper
      {...props}
      sx={{
        boxShadow: '0px 1px 7px 0px rgba(0,0,0,0.12)',
        padding: 1,
      }}
    >
      {props.children}
    </MuiPaper>
  );
};

export default Paper;
