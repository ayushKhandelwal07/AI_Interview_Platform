"use client"
import React, { createContext, useContext, useState } from 'react';

// Create the context
const AdminContext = createContext();

// Custom hook to use the admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Admin Provider component
export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const value = {
    isAdmin,
    setIsAdmin
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 