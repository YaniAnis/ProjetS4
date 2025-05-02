import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    if (email === 'test@example.com' && password === 'password') {
      setUser({ email });
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const register = async (data) => {
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        return { success: true, ...result };
      } else {
        return { success: false, message: result.message || Object.values(result.errors || {}).join(' ') };
      }
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
