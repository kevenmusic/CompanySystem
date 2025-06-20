// src/Context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const roles = localStorage.getItem('roles');
    console.log('Debug - AuthContext initializing:', { accessToken, userId, username, roles });
    if (accessToken && userId && username) {
      setUser({ id: userId, username, roles: JSON.parse(roles) || ['User'] });
    }
    setIsLoading(false);
  }, []);

  const authLogin = (userData, token) => {
    console.log('Debug - AuthContext login:', userData, token);
    setUser(userData);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('roles', JSON.stringify(userData.roles));
  };

  const logout = () => {
    console.log('Debug - AuthContext logout');
    setUser(null);
    localStorage.clear();
  };

  const hasRole = (role) => {
    console.log('Debug - Checking role:', role, 'for user:', user);
    return user?.roles?.includes(role) || false;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, authLogin, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};