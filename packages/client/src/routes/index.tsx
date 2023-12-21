import { lazy, ReactNode } from 'react';
import uniqid from 'uniqid';
import Customers from '../pages/customers/Customers';

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
  // {
  //   id: uniqid(),
  //   path: '/',
  //   component: (
  //     <Wrapper>
  //       <Auth />
  //     </Wrapper>
  //   ),
  // },
  {
    id: uniqid(),
    path: '/',
    component: (
      <Wrapper>
        <Customers/>
      </Wrapper>
    ),
  },

];
