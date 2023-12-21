import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType, UserRole } from '../types/user';
import Splash from '../components/Splash';

export interface IAdminRouteProps {
  children: JSX.Element;
}

const AdminRoute = ({ children }: IAdminRouteProps) => {
  const { user, isLoading } = useContext(AuthContext) as UserContextType;
  const location = useLocation();

  if (isLoading) return <Splash />;

  if (!user || user.role !== UserRole.admin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

export default AdminRoute;
