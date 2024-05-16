import { Suspense, lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

import SuspenseLoader from './components/suspenseLoader';
import BaseLayout from './layouts/baseLayout';
import SidebarLayout from './layouts/sidebarLayout';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const Status404 = Loader(lazy(() => import('./contents/status404')));
const SignIn = Loader(lazy(() => import('./contents/signIn')));
const SignUp = Loader(lazy(() => import('./contents/signUp')));
const CreateGroup = Loader(lazy(() => import('./contents/createGroup')));
const AccountList = Loader(lazy(() => import('./contents/accountList')));
const ConfirmedAccountList = Loader(
  lazy(() => import('./contents/confirmedAccountList'))
);
const EditGroup = Loader(lazy(() => import('src/contents/editGroup')));
const EditUsers = Loader(lazy(() => import('src/contents/editUsers')));

const routes: RouteObject[] = [
  {
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="sign-in" />
      },
      {
        path: 'sign-in',
        element: <SignIn />
      },
      {
        path: 'sign-up',
        element: <SignUp />
      },
      {
        path: 'create-group',
        element: <CreateGroup />
      },
      {
        path: '404',
        element: <Status404 />
      },
      {
        path: '*',
        element: <Navigate to="404" />
      }
    ]
  },
  {
    path: 'dashboards',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="account-list" />
      },
      {
        path: 'account-list',
        element: <AccountList />
      },
      {
        path: 'confirmed-account-list',
        element: <ConfirmedAccountList />
      },
      {
        path: 'edit-group',
        element: <EditGroup />
      },
      {
        path: 'edit-users',
        element: <EditUsers />
      },
      {
        path: '*',
        element: <Navigate to="account-list" />
      }
    ]
  }
];

export default routes;