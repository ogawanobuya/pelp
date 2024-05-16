import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import UploadIcon from '@mui/icons-material/Upload';
import { Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router';

const AccountListContentPageHeader = () => {
  const navigate = useNavigate();

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 2 }}>
          請求書一覧
        </Typography>
        <Typography variant="h5" component="h5">
          割引率はAPRに基づいて計算されます。現在、APRは{6}
          %と設定されています。
        </Typography>
      </Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 }, mr: 2 }}
          variant="contained"
          startIcon={<UploadIcon fontSize="small" />}
          onClick={() => navigate('/dashboards/import-csv')}
        >
          CSV取り込み
        </Button>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={() => navigate('/dashboards/add-account')}
        >
          追加
        </Button>
      </Grid>
    </Grid>
  );
};

export default AccountListContentPageHeader;