// AuthContext.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const login = () => {
      setLoggedIn(true);
      console.log("login " + isLoggedIn);
  }
  const logout = () => setLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

