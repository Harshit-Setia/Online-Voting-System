import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * PrivateRoute protects routes that require authentication.
 * If the user is not authenticated, they are redirected to /login.
 */
export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    // Render a simple loading placeholder while auth status resolves
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
