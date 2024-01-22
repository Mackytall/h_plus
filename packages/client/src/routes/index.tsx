import { lazy, ReactNode } from 'react';
import uniqid from 'uniqid';
import Customers from '../pages/customers/Customers';
import Dashboard from '../pages/Dashboard';
import Auth from '../pages/auth/Auth';
import EditCustomer from '../pages/customers/EditCustomer';
import PrivateRoute from './PrivateRoute';


//import AdminRoute from './AdminRoute';
//import PrivateRoute from './PrivateRoute';
const Wrapper = lazy(() => import('../components/Wrapper'));
// const Auth = lazy(() => import('../pages/auth/Auth'));

export type Route = {
  id: string;
  path: string;
  component: ReactNode;
};

export const routes: Route[] = [
  {
    id: uniqid(),
    path: '/dashboard',
    component: (
      <PrivateRoute>
        <Wrapper>
          <Dashboard />
        </Wrapper>
      </PrivateRoute>
    ),
  },
  {
    id: uniqid(),
    path: '/login',
    component: (
      <Wrapper>
        <Auth />
      </Wrapper>
    ),
  },

  {
    id: uniqid(),
    path: '/customers',
    component: (
      <PrivateRoute>
        <Wrapper>
          <Customers />
        </Wrapper>
      </PrivateRoute>
    ),
  },
  {
    id: uniqid(),
    path: '/customers/edit',
    component: (
      <PrivateRoute>
        <Wrapper>
          <EditCustomer />
        </Wrapper>
      </PrivateRoute>
    ),
  },

];
