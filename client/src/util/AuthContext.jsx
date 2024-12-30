import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  const login = (token, role) => {
    setAuthToken(token);
    setUserRole(role);
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", role);  
  };

  const logout = () => {
    setAuthToken(null);
    setUserRole(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");   
  };

  return (
    <AuthContext.Provider value={{ authToken, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);