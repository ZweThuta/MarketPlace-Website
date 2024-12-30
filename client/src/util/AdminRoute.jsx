import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Error from '../pages/Error';

const AdminRoute = ({ children }) => {
  const { userRole } = useAuth();

  if (userRole === "admin") {
    return children;
  } else {
    return <Error/>;
  }
};

export default AdminRoute;
