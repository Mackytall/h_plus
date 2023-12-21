import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../types/user';
import Splash from '../components/Splash';

export interface IPrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: IPrivateRouteProps) => {
  const { user, isLoading } = useContext(AuthContext) as UserContextType;
  const location = useLocation();

  if (isLoading) return <Splash />;

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

export default PrivateRoute;
