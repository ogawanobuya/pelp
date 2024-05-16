import { Suspense, lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import SuspenseLoader from 'src/components/suspenseLoader';
import BaseLayout from 'src/layouts/baseLayout';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const Status404 = Loader(lazy(() => import('src/contents/status404')));
const Contact = Loader(lazy(() => import('src/contents/contact')));

const routes: RouteObject[] = [
  {
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/contact" />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: '404',
        element: <Status404 />
      },
      {
        path: '*',
        element: <Navigate to="/404" />
      }
    ]
  }
];

export default routes;