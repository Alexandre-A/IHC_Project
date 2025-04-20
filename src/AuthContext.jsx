// AuthContext.js
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(() => {return localStorage.getItem("userType");}); // 'tenant', 'landlord', or null

  const login = (type) => {
    setUserType(type);
    localStorage.setItem("userType", type);
  };

  const logout = () => {
    setUserType(null);
    localStorage.removeItem("userType");
  };

  return (
    <AuthContext.Provider value={{ userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
