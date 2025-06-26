import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const roles = JSON.parse(localStorage.getItem('roles'));
    const employeeName = localStorage.getItem('employeeName');

    if (accessToken && userId && username) {
      setUser({
        id: userId,
        username,
        roles: roles || ['User'],
        employeeName: employeeName || null,
      });
    }

    setIsLoading(false);
  }, []);

  const authLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('roles', JSON.stringify(userData.roles));
    if (userData.employeeName) {
      localStorage.setItem('employeeName', userData.employeeName);
    } else {
      localStorage.removeItem('employeeName');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, authLogin, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};
