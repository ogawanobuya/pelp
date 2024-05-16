import {
  Box,
  Card,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface HomeNotificationsListItemProps {
  text: string;
  to?: string;
}
const HomeNotificationsListItem = (props: HomeNotificationsListItemProps) => {
  const { text, to } = props;
  const navigate = useNavigate();
  return (
    <>
      <ListItem sx={{ m: 0, p: 0 }}>
        <ListItemButton
          onClick={() => navigate(to)}
          sx={{ borderRadius: 0, p: 2 }}
        >
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
};

const HomeNotifications = () => {
  const texts = [
    '未処理の売掛金があります',
    '2日後の7月26日にVendor1株式会社への¥1,000,000の支払いがあります',
    '2日後の7月26日にVendor2株式会社への¥1,000,000の支払いがあります',
    '2日後の7月26日にVendor3株式会社への¥1,000,000の支払いがあります',
    '2日後の7月26日にVendor4株式会社への¥1,000,000の支払いがあります'
  ];

  return (
    <Card>
      <Typography
        variant="h3"
        component="h3"
        gutterBottom
        sx={{ mt: 2, mb: 2, pl: 2 }}
      >
        通知
      </Typography>
      <Divider />
      <List sx={{ p: 0 }}>
        {texts.map((text) => (
          <HomeNotificationsListItem key={text} text={text} />
        ))}
      </List>
      <Box sx={{ mt: 2 }} />
    </Card>
  );
};

export default HomeNotifications;