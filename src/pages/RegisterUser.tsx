// src/pages/RegisterPage.tsx

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterUser.css';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

interface CompanyData {
  companyName: string;
  nit: string;
  sector: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  website: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface FormErrors {
  // Paso 1
  companyName?: string;
  nit?: string;
  sector?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  // Paso 2
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  // General
  general?: string;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getPasswordStrength = (
  pwd: string
): { level: 0 | 1 | 2 | 3; label: string } => {
  if (pwd.length === 0) return { level: 0, label: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ['', 'Débil', 'Media', 'Fuerte'];
  return { level: score as 0 | 1 | 2 | 3, label: labels[score] };
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function RegisterPage() {
  const navigate = useNavigate();

  // Paso actual: 1 = empresa, 2 = usuario
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Estado Paso 1 — Empresa
  const [company, setCompany] = useState<CompanyData>({
    companyName: '',
    nit: '',
    sector: '',
    phone: '',
    address: '',
    city: '',
    country: 'Colombia',
    website: '',
  });

  // Estado Paso 2 — Usuario
  const [user, setUser] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const pwdStrength = getPasswordStrength(user.password);

  // ── Body class ────────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.className = 'register-body';
    return () => { document.body.className = ''; };
  }, []);

  // ── Handlers Paso 1 ───────────────────────────────────────────────────────
  const handleCompanyChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!company.companyName.trim())
      newErrors.companyName = 'El nombre de la empresa es requerido';
    if (!company.nit.trim())
      newErrors.nit = 'El NIT / RUC es requerido';
    if (!company.sector)
      newErrors.sector = 'Selecciona un sector';
    if (!company.phone.trim())
      newErrors.phone = 'El teléfono es requerido';
    if (!company.address.trim())
      newErrors.address = 'La dirección es requerida';
    if (!company.city.trim())
      newErrors.city = 'La ciudad es requerida';
    if (!company.country.trim())
      newErrors.country = 'El país es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) setCurrentStep(2);
  };

  // ── Handlers Paso 2 ───────────────────────────────────────────────────────
  const handleUserChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!user.firstName.trim())
      newErrors.firstName = 'El nombre es requerido';
    if (!user.lastName.trim())
      newErrors.lastName = 'El apellido es requerido';
    if (!user.email)
      newErrors.email = 'El correo es requerido';
    else if (!isValidEmail(user.email))
      newErrors.email = 'Ingresa un correo válido';
    if (!user.password)
      newErrors.password = 'La contraseña es requerida';
    else if (user.password.length < 8)
      newErrors.password = 'Mínimo 8 caracteres';
    if (!user.confirmPassword)
      newErrors.confirmPassword = 'Confirma tu contraseña';
    else if (user.password !== user.confirmPassword)
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (!user.role)
      newErrors.role = 'Selecciona un rol';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit final ──────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    setErrors({});

    try {
      /**
       * ⭐ PAYLOAD QUE SE ENVÍA A LARAVEL
       * POST /api/register
       * Headers: Content-Type: application/json
       */
      const payload = {
        // Empresa
        company: {
          name:    company.companyName,
          nit:     company.nit,
          sector:  company.sector,
          phone:   company.phone,
          address: company.address,
          city:    company.city,
          country: company.country,
          website: company.website || null,
        },
        // Usuario administrador
        user: {
          first_name: user.firstName,
          last_name:  user.lastName,
          email:      user.email,
          password:   user.password,
          password_confirmation: user.confirmPassword,
          role:       user.role,
        },
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Laravel devuelve errores de validación en data.errors
        if (data.errors) {
          const serverErrors: FormErrors = {};
          Object.entries(data.errors).forEach(([key, msgs]) => {
            const mapped = key.replace('user.', '').replace('company.', '') as keyof FormErrors;
            serverErrors[mapped] = (msgs as string[])[0];
          });
          setErrors(serverErrors);
          // Volver al paso 1 si el error es de empresa
          const step1Keys: (keyof FormErrors)[] = [
            'companyName','nit','sector','phone','address','city','country',
          ];
          if (Object.keys(serverErrors).some(k => step1Keys.includes(k as keyof FormErrors))) {
            setCurrentStep(1);
          }
        } else {
          setErrors({ general: data.message || 'Error al registrar. Intenta de nuevo.' });
        }
        return;
      }

      // ✅ Registro exitoso
      // Opcional: guardar token si la API lo devuelve
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setShowSuccess(true);
      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      console.error('Error en registro:', error);
      setErrors({ general: 'Error de conexión. Verifica tu red e intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  const progressPct = currentStep === 1 ? 50 : 100;

  return (
    <div className="main-wrapper-register">
      <div className="register-container">

        {/* ── LADO IZQUIERDO ── */}
        <div className="register-brand">
          <div className="brand-background" />
          <div className="brand-content">
            <div className="brand-logo">K</div>
            <div className="brand-name">Kardex CO</div>
            <p className="brand-description">
              Crea tu cuenta y lleva tu negocio al siguiente nivel
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
              <div className="brand-feature">
                <span className="feature-icon">🔒</span>
                <span>Acceso seguro y por roles</span>
              </div>
            </div>

            {/* Indicador de pasos */}
            <div className="steps-indicator">
              <div className="step-item">
                <div className={`step-circle ${currentStep === 1 ? 'active' : 'completed'}`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span className="step-label">Empresa</span>
              </div>

              <div className={`step-connector ${currentStep > 1 ? 'completed' : ''}`} />

              <div className="step-item">
                <div className={`step-circle ${currentStep === 2 ? 'active' : ''}`}>
                  2
                </div>
                <span className="step-label">Usuario</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── LADO DERECHO ── */}
        <div className="register-form-section">

          {/* Encabezado dinámico */}
          <div className="form-header">
            <h2>
              {currentStep === 1
                ? 'Información de la Empresa'
                : 'Datos del Usuario Administrador'}
            </h2>
            <p>
              {currentStep === 1
                ? 'Paso 1 de 2 — Completa los datos de tu empresa'
                : 'Paso 2 de 2 — Crea tu cuenta de acceso'}
            </p>
          </div>

          {/* Barra de progreso */}
          <div className="progress-bar-wrapper">
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="progress-label">
              <span className="active-step-label">
                {currentStep === 1 ? 'Empresa' : 'Usuario'}
              </span>
              <span>{progressPct}% completado</span>
            </div>
          </div>

          {/* Mensaje de éxito global */}
          <div className={`success-message ${showSuccess ? 'show' : ''}`}>
            ✓ Cuenta creada exitosamente. Redirigiendo al inicio de sesión...
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="error-message show" style={{ marginBottom: '1rem' }}>
              {errors.general}
            </div>
          )}

          {/* ──────────────── PASO 1: EMPRESA ──────────────── */}
          {currentStep === 1 && (
            <div className="step-panel" key="step1">

              <div className="info-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Esta información identifica tu empresa dentro de Kardex CO.
                Podrás actualizarla después.
              </div>

              {/* Nombre + NIT */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="companyName">Nombre de la Empresa *</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="Ej. Distribuciones López S.A.S"
                    value={company.companyName}
                    onChange={handleCompanyChange}
                    className={errors.companyName ? 'error' : ''}
                  />
                  {errors.companyName && (
                    <div className="error-message show">{errors.companyName}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="nit">NIT / RUC *</label>
                  <input
                    type="text"
                    id="nit"
                    name="nit"
                    placeholder="Ej. 900.123.456-7"
                    value={company.nit}
                    onChange={handleCompanyChange}
                    className={errors.nit ? 'error' : ''}
                  />
                  {errors.nit && (
                    <div className="error-message show">{errors.nit}</div>
                  )}
                </div>
              </div>

              {/* Sector + Teléfono */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sector">Sector / Industria *</label>
                  <select
                    id="sector"
                    name="sector"
                    value={company.sector}
                    onChange={handleCompanyChange}
                    className={errors.sector ? 'error' : ''}
                  >
                    <option value="">Seleccionar sector</option>
                    <option value="retail">Comercio / Retail</option>
                    <option value="food">Alimentos y Bebidas</option>
                    <option value="manufacturing">Manufactura</option>
                    <option value="services">Servicios</option>
                    <option value="technology">Tecnología</option>
                    <option value="healthcare">Salud</option>
                    <option value="education">Educación</option>
                    <option value="construction">Construcción</option>
                    <option value="agriculture">Agropecuario</option>
                    <option value="other">Otro</option>
                  </select>
                  {errors.sector && (
                    <div className="error-message show">{errors.sector}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Teléfono *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Ej. +57 300 123 4567"
                    value={company.phone}
                    onChange={handleCompanyChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && (
                    <div className="error-message show">{errors.phone}</div>
                  )}
                </div>
              </div>

              {/* Dirección */}
              <div className="form-group">
                <label htmlFor="address">Dirección *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Ej. Cra 15 #80-20"
                  value={company.address}
                  onChange={handleCompanyChange}
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && (
                  <div className="error-message show">{errors.address}</div>
                )}
              </div>

              {/* Ciudad + País */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">Ciudad *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Ej. Bogotá"
                    value={company.city}
                    onChange={handleCompanyChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && (
                    <div className="error-message show">{errors.city}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="country">País *</label>
                  <select
                    id="country"
                    name="country"
                    value={company.country}
                    onChange={handleCompanyChange}
                    className={errors.country ? 'error' : ''}
                  >
                    <option value="Colombia">Colombia</option>
                    <option value="México">México</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Perú">Perú</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {errors.country && (
                    <div className="error-message show">{errors.country}</div>
                  )}
                </div>
              </div>

              {/* Sitio web (opcional) */}
              <div className="form-group">
                <label htmlFor="website">Sitio Web (opcional)</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  placeholder="Ej. https://miempresa.com"
                  value={company.website}
                  onChange={handleCompanyChange}
                />
              </div>

              {/* Acción */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-next"
                  onClick={handleNextStep}
                  style={{ flex: 1 }}
                >
                  Siguiente
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── PASO 2: USUARIO ──────────────── */}
          {currentStep === 2 && (
            <form onSubmit={handleSubmit} key="step2">
              <div className="step-panel">

                <div className="info-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Esta será la cuenta principal con acceso de administrador.
                </div>

                {/* Nombre + Apellido */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Nombre *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Ej. Carlos"
                      value={user.firstName}
                      onChange={handleUserChange}
                      className={errors.firstName ? 'error' : ''}
                      disabled={isLoading}
                    />
                    {errors.firstName && (
                      <div className="error-message show">{errors.firstName}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Apellido *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Ej. López"
                      value={user.lastName}
                      onChange={handleUserChange}
                      className={errors.lastName ? 'error' : ''}
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <div className="error-message show">{errors.lastName}</div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">Correo Electrónico *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="carlos@miempresa.com"
                    value={user.email}
                    onChange={handleUserChange}
                    className={errors.email ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <div className="error-message show">{errors.email}</div>
                  )}
                </div>

                {/* Rol */}
                <div className="form-group">
                  <label htmlFor="role">Rol en la empresa *</label>
                  <select
                    id="role"
                    name="role"
                    value={user.role}
                    onChange={handleUserChange}
                    className={errors.role ? 'error' : ''}
                    disabled={isLoading}
                  >
                    <option value="">Seleccionar rol</option>
                    <option value="owner">Propietario / Dueño</option>
                    <option value="admin">Administrador</option>
                    <option value="manager">Gerente</option>
                    <option value="accountant">Contador</option>
                    <option value="warehouse">Encargado de Bodega</option>
                  </select>
                  {errors.role && (
                    <div className="error-message show">{errors.role}</div>
                  )}
                </div>

                {/* Contraseña */}
                <div className="form-group">
                  <label htmlFor="password">Contraseña *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Mínimo 8 caracteres"
                    value={user.password}
                    onChange={handleUserChange}
                    className={errors.password ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <div className="error-message show">{errors.password}</div>
                  )}

                  {/* Indicador de fuerza */}
                  {user.password.length > 0 && (
                    <div className="password-strength">
                      <div className="strength-bars">
                        {[1, 2, 3].map(i => (
                          <div
                            key={i}
                            className={`strength-bar ${
                              pwdStrength.level >= i
                                ? pwdStrength.level === 1
                                  ? 'weak'
                                  : pwdStrength.level === 2
                                  ? 'medium'
                                  : 'strong'
                                : ''
                            }`}
                          />
                        ))}
                      </div>
                      <span className="strength-text">
                        Fortaleza: <strong>{pwdStrength.label}</strong>
                        {pwdStrength.level < 3 && ' — Añade mayúsculas, números y símbolos'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Repite tu contraseña"
                    value={user.confirmPassword}
                    onChange={handleUserChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <div className="error-message show">{errors.confirmPassword}</div>
                  )}
                </div>

                {/* Acciones */}
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-back"
                    onClick={() => setCurrentStep(1)}
                    disabled={isLoading}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Atrás
                  </button>

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner" />
                        <span>Creando cuenta...</span>
                      </>
                    ) : (
                      <>
                        <span>Crear Cuenta</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="form-footer">
            <p className="signup-text">
              ¿Ya tienes cuenta?{' '}
              <a
                href="#"
                className="signup-link"
                onClick={(e) => { e.preventDefault(); navigate('/login'); }}
              >
                Inicia sesión aquí
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}