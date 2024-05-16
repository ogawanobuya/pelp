import UploadIcon from '@mui/icons-material/Upload';
import { Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router';

const AccountListContentPageHeader = () => {
  const navigate = useNavigate();

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 2 }}>
          請求書の追加
        </Typography>
        <Typography variant="body1" align="left">
          入力項目が全く同じ請求書を複数登録したい場合はIDを設定してください。
        </Typography>
      </Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<UploadIcon fontSize="small" />}
          onClick={() => navigate('/dashboards/import-csv')}
        >
          CSV取り込み
        </Button>
      </Grid>
    </Grid>
  );
};
export default AccountListContentPageHeader;