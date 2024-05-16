import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import 'nprogress/nprogress.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);

serviceWorker.unregister();