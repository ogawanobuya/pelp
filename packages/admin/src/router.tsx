import { Suspense, lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import SuspenseLoader from 'src/components/suspenseLoader';
import BaseLayout from 'src/layouts/baseLayout';
import SidebarLayout from 'src/layouts/sidebarLayout';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const Status404 = Loader(lazy(() => import('src/contents/status404')));
const SignIn = Loader(lazy(() => import('src/contents/signIn')));

const AddEnterpriseGroup = Loader(
  lazy(() => import('src/contents/addEnterpriseGroup'))
);
const EditEnterpriseGroup = Loader(
  lazy(() => import('src/contents/editEnterpriseGroup'))
);

const routes: RouteObject[] = [
  {
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/sign-in" />
      },
      {
        path: 'sign-in',
        element: <SignIn />
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
  },
  {
    path: 'dashboards',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/dashboards/add-enterprise-group" />
      },
      {
        path: 'account-list',
        element: <Navigate to="/dashboards/add-enterprise-group" />
      },
      {
        path: 'confirmed-account-list',
        element: <Navigate to="/dashboards/add-enterprise-group" />
      },
      {
        path: 'add-enterprise-group',
        element: <AddEnterpriseGroup />
      },
      {
        path: 'edit-enterprise-group',
        element: <EditEnterpriseGroup />
      },
      {
        path: '*',
        element: <Navigate to="account-list" />
      }
    ]
  }
];

export default routes;