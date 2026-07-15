// components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;          // The page/component to render if authorized
  allowedRoles?: string[];            // Optional: restrict to specific roles (e.g., ['admin'])
  redirectTo?: string;                // Optional: custom redirect path (defaults to '/login')
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, user, loading } = useAuthStore();

  // 1. While auth is loading, show nothing or a spinner to avoid flash of redirect
  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  // 2. Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // 3. Authenticated but role not allowed → redirect to login or profile
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // You could redirect to "/unauthorized" if you have that page, 
    // but redirecting to login is safe and forces re-auth.
    return <Navigate to="/profile" replace />; 
  }

  // 4. All good → render the children
  return <>{children}</>;
};

export default ProtectedRoute;