import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={styles.loaderWrapper}>
        <div style={styles.spinner} />
        <p style={styles.loaderText}>Verificando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && user) {
    const userRoleNames = user.roles?.map(r => r.name) ?? [];
    if (!userRoleNames.some(r => allowedRoles.includes(r))) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}

const styles: Record<string, React.CSSProperties> = {
  loaderWrapper: {
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    minHeight:      '100vh',
    gap:            '1rem',
    background:     '#f8fafc',
  },
  spinner: {
    width:        '40px',
    height:       '40px',
    border:       '3px solid #e2e8f0',
    borderTop:    '3px solid #3b82f6',
    borderRadius: '50%',
    animation:    'spin 0.7s linear infinite',
  },
  loaderText: {
    color:      '#64748b',
    fontSize:   '0.9rem',
    fontFamily: 'Segoe UI, sans-serif',
  },
};
