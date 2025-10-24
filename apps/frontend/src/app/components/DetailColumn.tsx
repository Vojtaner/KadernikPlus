import { Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type DetailColumnProps = {
  label: string | ReactNode;
  input: string | ReactNode;
  fontSize?: number;
  helperText?: string | ReactNode;
};

const DetailColumn = (props: DetailColumnProps) => {
  const { label, input, fontSize, helperText } = props;
  const valueFontSize = fontSize ?? 14;
  const labelFontSize = valueFontSize - 2;
  const helperTextFontSize = valueFontSize - 5;

  return (
    <Stack direction="column">
      <Typography variant="caption" color="text.secondary" fontSize={labelFontSize}>
        {label}
      </Typography>
      <Typography variant="h6" color={'text.primary'} fontSize={valueFontSize}>
        {input}
      </Typography>
      <Typography variant="body2" color={'text.secondary'} fontSize={helperTextFontSize}>
        {helperText}
      </Typography>
    </Stack>
  );
};
export default DetailColumn;
