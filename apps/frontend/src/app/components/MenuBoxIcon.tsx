import { IconButton, Typography } from '@mui/material';
import type { AppPaletteColor } from '../../entity';

type MenuIconButtonProps = {
  title: string;
  icon: React.ReactNode;
  color?: AppPaletteColor;
  onClick?: () => void;
};

const MenuIconButton = (props: MenuIconButtonProps) => {
  const { title, icon, color = 'common.white', onClick } = props;

  return (
    <IconButton
      aria-label={title}
      onClick={onClick}
      sx={{
        flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1,
        gap: 0.5,
        color: `${color}`,
      }}
    >
      {icon}
      <Typography fontWeight={400} fontSize="0.7rem" color={color}>
        {title}
      </Typography>
    </IconButton>
  );
};

export default MenuIconButton;
