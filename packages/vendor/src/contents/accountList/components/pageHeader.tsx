import { Typography, Grid } from '@mui/material';

const AccountListContentPageHeader = () => {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 2 }}>
          請求書一覧
        </Typography>
        <Typography
          variant="body1"
          component="body"
          sx={{ mb: 2, color: 'darkred' }}
        >
          ※ 表示されている支払日から3営業日以内に支払いが行われます。
          <br />
          例えば、表示されている支払日が金曜日で、土日が営業日でなく、月火曜日が営業日である場合、火曜日までに支払いが行われます。
          <br />
          銀行の営業日の関係などで支払いができない場合は支払い可能な最初の営業日に支払いが行われます。
        </Typography>
        {/* TODO: #127 支払期限関連のドキュメントへのリンク */}
      </Grid>
    </Grid>
  );
};

export default AccountListContentPageHeader;