import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import bgLocale from 'date-fns/locale/bg';
import { useRoutes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import router from './router';
import ThemeProvider from './theme/ThemeProvider';

function App() {
  const content = useRoutes(router);

  return (
    <RecoilRoot>
      <ThemeProvider>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={bgLocale}
        >
          <CssBaseline />
          {content}
        </LocalizationProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;