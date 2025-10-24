import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  Button,
  Box,
  ListItemIcon,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

type PricingCardProps = {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaText: string;
  active?: boolean;
  onClick: () => void;
};

const PricingCard = ({
  title,
  price,
  period,
  description,
  features,
  ctaText,
  onClick,
  active = false,
}: PricingCardProps) => {
  return (
    <Card
      sx={{
        margin: 'auto',
        maxWidth: '300px',
        borderRadius: 4,
        boxShadow: active ? 6 : 2,
        transition: '0.3s',
        '&:hover': {
          boxShadow: 8,
        },
      }}
    >
      <CardHeader
        sx={{ paddingBottom: '0' }}
        title={
          <Typography variant="h6" fontWeight="bold" textAlign="center">
            {title}
          </Typography>
        }
      />
      <CardContent>
        <Box textAlign="center">
          <Typography variant="h4" fontWeight="bold">
            {price}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {period}
          </Typography>
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          {description}
        </Typography>
        <List dense>
          {features.map((feature, idx) => (
            <ListItem key={idx}>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <CheckIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <Typography variant="body2">{feature}</Typography>
            </ListItem>
          ))}
        </List>

        <Box mt={2} textAlign="center">
          <Button
            variant={active ? 'contained' : 'outlined'}
            color="primary"
            onClick={onClick}
            fullWidth
          >
            {ctaText}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
