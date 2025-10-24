import { Box, Typography } from '@mui/material';

type StockAllowanceProps = {
  quantity: number | null;
  name: string;
  id: string;
};

const StockAllowance = (props: StockAllowanceProps) => {
  const { name, quantity, id } = props;

  return (
    <Box boxShadow="0px 1px 7px 0px rgba(0,0,0,0.12)" padding={1} key={id} borderRadius={2}>
      <Typography fontSize="11px" fontWeight={600} color="secondary">
        {`${name} ${quantity}`}
      </Typography>
    </Box>
  );
};

export default StockAllowance;
