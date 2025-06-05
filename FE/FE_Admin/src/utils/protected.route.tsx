import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './auth.context';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Check if user is authenticated
    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Check if user role is included in allowed roles
    const hasRequiredRole = user.roles.some((role: string) => allowedRoles.includes(role));

    if (!hasRequiredRole) {
        // User doesn't have the required role
        // Redirect based on their actual role
        if (user.roles.indexOf('Admin') !== -1) {
            return <Navigate to="/admin" replace />;
        } else if (user.roles.indexOf('Seller') !== -1) {
            return <Navigate to="/shop" replace />;
        } else {
            // Fallback for unknown roles
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // User is authenticated and has required role
    return <>{children}</>;
};

export default ProtectedRoute;