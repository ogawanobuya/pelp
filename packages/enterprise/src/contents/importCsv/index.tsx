import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import AuthStateChecker from 'src/components/authStateChecker';
import PageTitleWrapper from 'src/components/pageTitleWrapper';
import { randomString } from 'src/utils/functions/randomString';
import { useFilePicker } from 'use-file-picker';

import {
  DateFormat,
  dateFormats,
  useDateFormatState,
  useHandleCsv,
  useLoadingValue,
  useErrorMessagesValue,
  useWarningMessagesValue,
  useSkipFirstRowState,
  useSnackbarContentValue,
  useSnackbarOpenState
} from './localState';

const SelectWrapper = styled(Select)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
    text-align: center;
`
);

const ImportCsvContent = () => {
  const [openFileSelector, filePickerConfig] = useFilePicker({
    accept: '.csv'
  });
  const { filesContent } = filePickerConfig;
  const filePickerLoading = filePickerConfig.loading;

  const [dateFormat, setDateFormat] = useDateFormatState();
  const [skipFirstRow, setSkipFirstRow] = useSkipFirstRowState();
  const loading = useLoadingValue();
  const errorMessages = useErrorMessagesValue();
  const warningMessages = useWarningMessagesValue();
  const [snackbarOpen, setSnackbarOpen] = useSnackbarOpenState();
  const snackbarContent = useSnackbarContentValue();
  const handleCsv = useHandleCsv();

  return (
    <AuthStateChecker>
      <Helmet>
        <title>Pelp ― CSVインポート</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 2 }}>
              請求書CSVインポート
            </Typography>
          </Grid>
        </Grid>
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <FormControl variant="outlined" fullWidth sx={{ mb: 3 }}>
          <Typography variant="h5" align="left" sx={{ my: 1 }}>
            日付のフォーマット
          </Typography>
          <Box width={120}>
            <SelectWrapper
              value={dateFormat}
              onChange={(event) =>
                setDateFormat(event.target.value as DateFormat)
              }
              autoWidth
            >
              {dateFormats.map((format) => (
                <MenuItem key={format} value={format}>
                  {format}
                </MenuItem>
              ))}
            </SelectWrapper>
          </Box>
        </FormControl>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                value={skipFirstRow}
                onChange={(event, checked) => setSkipFirstRow(checked)}
              />
            }
            label="CSVの先頭の行をスキップする"
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Button
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                onClick={() => openFileSelector()}
              >
                {filePickerLoading ? (
                  <CircularProgress color="inherit" size={19} />
                ) : (
                  'ファイル選択'
                )}
              </Button>
            }
            label={
              <Typography variant="body1" align="left" sx={{ ml: 2, mt: 2 }}>
                {filesContent.length === 0 ? '' : filesContent[0].name}
              </Typography>
            }
          />
        </Box>
        <Box>
          <Button
            onClick={() => handleCsv(filesContent[0].content)}
            disabled={filesContent.length === 0}
            variant="contained"
            size="medium"
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 120, height: 30 }}
            >
              {loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                'インポート'
              )}
            </Box>
          </Button>
        </Box>
        <Box sx={{ mt: 3 }}>
          {errorMessages.map((message) => (
            <Typography
              key={randomString()}
              variant="body2"
              component="p"
              gutterBottom
              sx={{ mb: 0.5, color: 'darkred' }}
            >
              {message}
            </Typography>
          ))}
          {warningMessages.map((message) => (
            <Typography
              key={randomString()}
              variant="body2"
              component="p"
              gutterBottom
              sx={{ mb: 0.5, color: '#EF6C00' }}
            >
              {message}
            </Typography>
          ))}
        </Box>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        onClick={() => setSnackbarOpen(false)}
        message={snackbarContent}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      />
    </AuthStateChecker>
  );
};

export default ImportCsvContent;