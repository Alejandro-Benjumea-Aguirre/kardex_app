
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterUser';
import Home from './pages/Home';
import CreateProduct from './pages/CreateProduct';
import RegisterSale from './pages/RegisterSale';
import RegisterPurchase from './pages/RegisterPurchase';
import ReportsPage from './pages/ReportsPage';

// Layout / Guards
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

export function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas protegidas — guard + navbar del dashboard */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/products/new" element={<CreateProduct />} />
        <Route path="/sales/new" element={<RegisterSale />} />
        <Route path="/payments/new" element={<RegisterPurchase />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      {/* Ruta no encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}