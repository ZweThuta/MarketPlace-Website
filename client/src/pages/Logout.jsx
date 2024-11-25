import { useEffect } from 'react';
import { useAuth } from "../util/AuthContext";
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();  
    navigate('/login');  
  }, [logout, navigate]);

  return null;  
};

export default Logout;