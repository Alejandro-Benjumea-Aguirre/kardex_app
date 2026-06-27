import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage        from '../features/landing/pages/LandingPage';
import LoginPage          from '../features/auth/pages/LoginPage';
import RegisterPage       from '../features/auth/pages/RegisterPage';
import DashboardPage      from '../features/dashboard/pages/DashboardPage';
import CreateProductPage  from '../features/products/pages/CreateProductPage';
import RegisterSalePage   from '../features/sales/pages/RegisterSalePage';
import RegisterPurchasePage from '../features/purchases/pages/RegisterPurchasePage';
import ReportsPage        from '../features/reports/pages/ReportsPage';
import CategoriesPage     from '../features/categories/pages/CategoriesPage';

import ProtectedRoute   from '../features/auth/components/ProtectedRoute';
import DashboardLayout  from '../components/layout/DashboardLayout';

const ADMIN_ROLES = ['admin', 'super_admin'];

export function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard"    element={<DashboardPage />} />
        <Route path="/products/new" element={<CreateProductPage />} />
        <Route path="/sales/new"    element={<RegisterSalePage />} />
        <Route path="/payments/new" element={<RegisterPurchasePage />} />
        <Route path="/reports"      element={<ReportsPage />} />
        <Route
          path="/categories"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
