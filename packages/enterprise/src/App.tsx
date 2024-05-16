import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import bgLocale from 'date-fns/locale/bg';
import { useRoutes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import MaintainanceStateChecker from './components/maintainanceStateChecker';
import router from './router';
import ThemeProvider from './theme/ThemeProvider';

function App() {
  const content = useRoutes(router);

  return (
    <RecoilRootWrapper>
      <ThemeProvider>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={bgLocale}
        >
          <CssBaseline />
          <MaintainanceStateChecker>{content}</MaintainanceStateChecker>
        </LocalizationProvider>
      </ThemeProvider>
    </RecoilRootWrapper>
  );
}

export default App;

// useRouteより前のタイミングでRecoilRootを読み込む
interface RecoilRootWrapperProps {
  children: React.ReactNode;
}
const RecoilRootWrapper = (props: RecoilRootWrapperProps) => {
  const { children } = props;

  return <RecoilRoot>{children}</RecoilRoot>;
};