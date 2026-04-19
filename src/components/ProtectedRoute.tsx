// src/components/ProtectedRoute.tsx
// Guarda rutas privadas — usa useAuth con JWT

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Roles permitidos. Si está vacío o no se pasa, cualquier usuario autenticado puede acceder. */
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Mientras se verifica la sesión con el servidor — mostrar loader
  if (isLoading) {
    return (
      <div style={styles.loaderWrapper}>
        <div style={styles.spinner} />
        <p style={styles.loaderText}>Verificando sesión...</p>
      </div>
    );
  }

  // No autenticado — redirigir al login guardando la ruta de origen
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Control de roles (opcional)
  if (allowedRoles.length > 0 && user) {
    const userRoleNames = user.roles?.map(r => r.name) ?? [];
    if (!userRoleNames.some(r => allowedRoles.includes(r))) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}

// ─── Estilos inline mínimos para el loader ────────────────────────────────────
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
    width:       '40px',
    height:      '40px',
    border:      '3px solid #e2e8f0',
    borderTop:   '3px solid #3b82f6',
    borderRadius:'50%',
    animation:   'spin 0.7s linear infinite',
  },
  loaderText: {
    color:     '#64748b',
    fontSize:  '0.9rem',
    fontFamily:'Segoe UI, sans-serif',
  },
};