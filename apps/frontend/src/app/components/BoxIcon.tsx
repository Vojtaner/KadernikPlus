import { IconButton } from '@mui/material';
import type { AppPaletteColorString } from '../../entity';

export type BoxIconProps = {
  icon: React.ReactNode;
  boxColor?: AppPaletteColorString | `#${string}`;
  sx?: object;
  size?: 'small' | 'large' | 'medium';
  key?: string | number;
  onClick?: () => void;
  href?: string;
};

const BoxIcon = (props: BoxIconProps) => {
  const { boxColor = 'primary.light', sx, icon, size = 'small', onClick, key, href } = props;

  return (
    <IconButton
      key={key}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '5px',
        boxShadow: '0px 4px 5px 0px rgba(0,0,0,0.32)',
        backgroundColor: boxColor,
        ...sx,
      }}
      size={size}
      {...(href ? { href } : {})}
      onClick={onClick}
    >
      {icon}
    </IconButton>
  );
};

export default BoxIcon;
