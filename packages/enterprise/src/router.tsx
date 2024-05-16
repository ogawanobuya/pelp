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
const Home = Loader(lazy(() => import('src/contents/home')));
const AccountList = Loader(lazy(() => import('src/contents/accountList')));
const ImportCsv = Loader(lazy(() => import('src/contents/importCsv')));
const AddAccount = Loader(lazy(() => import('src/contents/addAccount')));
const ConfirmedAccountList = Loader(
  lazy(() => import('src/contents/confirmedAccountList'))
);
const EditGroup = Loader(lazy(() => import('src/contents/editGroup')));
const EditUsers = Loader(lazy(() => import('src/contents/editUsers')));
const PaymentSchedule = Loader(
  lazy(() => import('src/contents/paymentSchedule'))
);

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
        path: 'home',
        element: <Home />
      },
      {
        path: 'account-list',
        element: <AccountList />
      },
      {
        path: 'import-csv',
        element: <ImportCsv />
      },
      {
        path: 'add-account',
        element: <AddAccount />
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
        path: 'payment-schedule',
        element: <PaymentSchedule />
      },
      {
        path: '*',
        element: <Navigate to="account-list" />
      }
    ]
  }
];

export default routes;