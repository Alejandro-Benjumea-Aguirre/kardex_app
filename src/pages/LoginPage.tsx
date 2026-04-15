// src/pages/LoginPage.tsx

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/LoginPage.css';

interface FormFields {
  email:    string;
  password: string;
}

interface FormErrors {
  email?:    string;
  password?: string;
  general?:  string;
}

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, isSubmitting, isAuthenticated, error: authError, clearError } = useAuth();

  const [fields,     setFields]     = useState<FormFields>({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors,     setErrors]     = useState<FormErrors>({});

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Mapear errores del servidor a los campos del formulario
  useEffect(() => {
    if (authError) {
      setErrors({
        email:    authError['email'],
        password: authError['password'],
        general:  authError['general'] ?? 'Credenciales inválidas',
      });
    }
  }, [authError]);

  useEffect(() => {
    document.body.className = 'login-body';
    return () => { document.body.className = ''; };
  }, []);

  // ── Validación ─────────────────────────────────────────────────────────────

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!fields.email)                   newErrors.email    = 'El correo es requerido';
    else if (!isValidEmail(fields.email)) newErrors.email   = 'Ingresa un correo válido';
    if (!fields.password)                newErrors.password = 'La contraseña es requerida';
    else if (fields.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailBlur = () => {
    if (!fields.email)                    setErrors(prev => ({ ...prev, email: 'El correo es requerido' }));
    else if (!isValidEmail(fields.email)) setErrors(prev => ({ ...prev, email: 'Ingresa un correo válido' }));
    else                                  setErrors(prev => ({ ...prev, email: undefined }));
  };

  const handlePasswordBlur = () => {
    if (!fields.password)                  setErrors(prev => ({ ...prev, password: 'La contraseña es requerida' }));
    else if (fields.password.length < 6)   setErrors(prev => ({ ...prev, password: 'Mínimo 6 caracteres' }));
    else                                   setErrors(prev => ({ ...prev, password: undefined }));
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
    if (authError) clearError();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login({ email: fields.email, password: fields.password, remember: rememberMe });
    } catch {
      // Los errores ya los maneja el useEffect de authError
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="main-wrapper-login">
      <div className="login-container">

        {/* LEFT SIDE - BRANDING */}
        <div className="login-brand">
          <div className="brand-background"></div>
          <div className="brand-content">
            <Link to="/">
              <div className="brand-logo">K</div>
            </Link>
            <div className="brand-name">Kardex CO</div>
            <p className="brand-description">
              Gestión inteligente de inventario y finanzas para tu negocio
            </p>
            <div className="brand-features">
              <div className="brand-feature">
                <span className="feature-icon">📦</span>
                <span>Control de Inventario</span>
              </div>
              <div className="brand-feature">
                <span className="feature-icon">💰</span>
                <span>Gestión Financiera</span>
              </div>
              <div className="brand-feature">
                <span className="feature-icon">📊</span>
                <span>Reportes Avanzados</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - LOGIN FORM */}
        <div className="login-form-section">
          <div className="form-header">
            <h2>Iniciar Sesión</h2>
            <p>Accede a tu cuenta Kardex CO</p>
          </div>

          {errors.general && (
            <div className="error-message show general-error">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Correo o Usuario</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="ejemplo@correo.com"
                value={fields.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
                className={errors.email ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.email && <div className="error-message show">{errors.email}</div>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={fields.password}
                onChange={handleChange}
                onBlur={handlePasswordBlur}
                className={errors.password ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.password && <div className="error-message show">{errors.password}</div>}
            </div>

            {/* Remember Me */}
            <div className="form-group">
              <div className="form-remember">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isSubmitting}
                />
                <label className="checkbox-custom" htmlFor="remember"></label>
                <label className="remember-label" htmlFor="remember">Recuérdame</label>
              </div>
            </div>

            {/* Submit */}
            <div className="form-group">
              <button type="submit" className="login-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <span>Iniciar Sesión</span>
                )}
              </button>
            </div>

          </form>

          <div className="form-footer">
            <p className="signup-text">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="signup-link">Regístrate aquí</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
