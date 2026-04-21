// src/pages/RegisterPage.tsx

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Select, { StylesConfig, SingleValue } from 'react-select';
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

// ─── SELECT OPTION TYPE ───────────────────────────────────────────────────────

interface SelectOption {
  value: string;
  label: string;
}

const buildSelectStyles = (hasError: boolean, isDark: boolean): StylesConfig<SelectOption, false> => ({
  control: (_, state) => ({
    display: 'flex',
    alignItems: 'center',
    height: '44px',
    padding: '0',
    border: `2px solid ${hasError ? '#ef4444' : state.isFocused ? '#3b82f6' : isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: '8px',
    backgroundColor: hasError
      ? (isDark ? '#1a0a0a' : '#fef2f2')
      : state.isFocused
        ? (isDark ? '#0d1526' : '#ffffff')
        : (isDark ? '#0f172a' : '#f8fafc'),
    boxShadow: state.isFocused && !hasError ? '0 0 0 3px rgba(59,130,246,0.15)' : 'none',
    fontSize: '0.95rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: isDark ? '#f1f5f9' : '#1e293b',
    cursor: 'default',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
    '&:hover': { borderColor: hasError ? '#ef4444' : state.isFocused ? '#3b82f6' : (isDark ? '#475569' : '#cbd5e1') },
  }),
  valueContainer: (base) => ({ ...base, padding: '0 0.75rem', height: '100%' }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: isDark ? '#f1f5f9' : '#1e293b' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({ ...base, padding: '0 10px', color: isDark ? '#94a3b8' : '#64748b' }),
  clearIndicator: (base) => ({ ...base, padding: '0 4px', color: isDark ? '#64748b' : '#94a3b8' }),
  placeholder: (base) => ({ ...base, color: isDark ? '#475569' : '#94a3b8', fontSize: '0.95rem', margin: 0 }),
  singleValue: (base) => ({ ...base, color: isDark ? '#f1f5f9' : '#1e293b', margin: 0 }),
  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.14)',
    zIndex: 9999,
    marginTop: '4px',
    backgroundColor: isDark ? '#1e293b' : 'white',
    border: isDark ? '1px solid #334155' : 'none',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
        ? (isDark ? '#0f172a' : '#f0f9ff')
        : (isDark ? '#1e293b' : 'white'),
    color: state.isSelected ? 'white' : (isDark ? '#f1f5f9' : '#1e293b'),
    fontSize: '0.92rem',
    cursor: 'pointer',
    padding: '0.55rem 1rem',
  }),
});

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

function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const isDark = useDarkMode();

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
    country: '',
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          // Mapa de campos snake_case del backend → camelCase del formulario
          const fieldMap: Record<string, keyof FormErrors> = {
            'company.name':    'companyName',
            'company.nit':     'nit',
            'company.sector':  'sector',
            'company.phone':   'phone',
            'company.address': 'address',
            'company.city':    'city',
            'company.country': 'country',
            'user.first_name': 'firstName',
            'user.last_name':  'lastName',
            'user.email':      'email',
            'user.password':   'password',
            'user.role':       'role',
          };
          const serverErrors: FormErrors = {};
          Object.entries(data.errors).forEach(([key, msgs]) => {
            const mapped = fieldMap[key] ?? key.replace('user.', '').replace('company.', '') as keyof FormErrors;
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
            <div
              className="brand-logo"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            >K</div>
            <div
              className="brand-name"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            >Kardex CO</div>
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
                  <Select<SelectOption>
                    inputId="sector"
                    placeholder="Seleccionar sector..."
                    isClearable
                    isSearchable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    options={[
                      { value: 'retail',        label: 'Comercio / Retail' },
                      { value: 'food',          label: 'Alimentos y Bebidas' },
                      { value: 'manufacturing', label: 'Manufactura' },
                      { value: 'services',      label: 'Servicios' },
                      { value: 'technology',    label: 'Tecnología' },
                      { value: 'healthcare',    label: 'Salud' },
                      { value: 'education',     label: 'Educación' },
                      { value: 'construction',  label: 'Construcción' },
                      { value: 'agriculture',   label: 'Agropecuario' },
                      { value: 'other',         label: 'Otro' },
                    ]}
                    value={company.sector ? { value: company.sector, label: {
                      retail: 'Comercio / Retail', food: 'Alimentos y Bebidas',
                      manufacturing: 'Manufactura', services: 'Servicios',
                      technology: 'Tecnología', healthcare: 'Salud',
                      education: 'Educación', construction: 'Construcción',
                      agriculture: 'Agropecuario', other: 'Otro',
                    }[company.sector] ?? company.sector } : null}
                    onChange={(opt: SingleValue<SelectOption>) =>
                      setCompany(prev => ({ ...prev, sector: opt?.value ?? '' }))
                    }
                    styles={buildSelectStyles(!!errors.sector, isDark)}
                    noOptionsMessage={() => 'Sin resultados'}
                  />
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

              {/* País + Ciudad */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country">País *</label>
                  <Select<SelectOption>
                    inputId="country"
                    placeholder="Buscar país..."
                    isClearable
                    isSearchable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    options={[
                      { value: 'Colombia', label: 'Colombia' },
                      { value: 'México', label: 'México' },
                      { value: 'Venezuela', label: 'Venezuela' },
                      { value: 'Ecuador', label: 'Ecuador' },
                      { value: 'Perú', label: 'Perú' },
                      { value: 'Argentina', label: 'Argentina' },
                      { value: 'Chile', label: 'Chile' },
                      { value: 'Bolivia', label: 'Bolivia' },
                      { value: 'Paraguay', label: 'Paraguay' },
                      { value: 'Uruguay', label: 'Uruguay' },
                      { value: 'Otro', label: 'Otro' },
                    ]}
                    value={company.country ? { value: company.country, label: company.country } : null}
                    onChange={(opt: SingleValue<SelectOption>) =>
                      setCompany(prev => ({ ...prev, country: opt?.value ?? '' }))
                    }
                    styles={buildSelectStyles(!!errors.country, isDark)}
                    noOptionsMessage={() => 'Sin resultados'}
                  />
                  {errors.country && (
                    <div className="error-message show">{errors.country}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="city">Ciudad *</label>
                  <Select<SelectOption>
                    inputId="city"
                    placeholder="Buscar ciudad..."
                    isClearable
                    isSearchable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    options={[
                      { value: 'Bogotá', label: 'Bogotá' },
                      { value: 'Medellín', label: 'Medellín' },
                      { value: 'Cali', label: 'Cali' },
                      { value: 'Barranquilla', label: 'Barranquilla' },
                      { value: 'Cartagena', label: 'Cartagena' },
                      { value: 'Cúcuta', label: 'Cúcuta' },
                      { value: 'Bucaramanga', label: 'Bucaramanga' },
                      { value: 'Pereira', label: 'Pereira' },
                      { value: 'Santa Marta', label: 'Santa Marta' },
                      { value: 'Ibagué', label: 'Ibagué' },
                      { value: 'Manizales', label: 'Manizales' },
                      { value: 'Pasto', label: 'Pasto' },
                      { value: 'Neiva', label: 'Neiva' },
                      { value: 'Armenia', label: 'Armenia' },
                      { value: 'Villavicencio', label: 'Villavicencio' },
                    ]}
                    value={company.city ? { value: company.city, label: company.city } : null}
                    onChange={(opt: SingleValue<SelectOption>) =>
                      setCompany(prev => ({ ...prev, city: opt?.value ?? '' }))
                    }
                    styles={buildSelectStyles(!!errors.city, isDark)}
                    noOptionsMessage={() => 'Sin resultados'}
                  />
                  {errors.city && (
                    <div className="error-message show">{errors.city}</div>
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
                  <Select<SelectOption>
                    inputId="role"
                    placeholder="Seleccionar rol..."
                    isClearable
                    isSearchable
                    isDisabled={isLoading}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    options={[
                      { value: 'owner',     label: 'Propietario / Dueño' },
                      { value: 'admin',     label: 'Administrador' },
                      { value: 'manager',   label: 'Gerente' },
                      { value: 'accountant',label: 'Contador' },
                      { value: 'warehouse', label: 'Encargado de Bodega' },
                    ]}
                    value={user.role ? { value: user.role, label: {
                      owner: 'Propietario / Dueño', admin: 'Administrador',
                      manager: 'Gerente', accountant: 'Contador',
                      warehouse: 'Encargado de Bodega',
                    }[user.role] ?? user.role } : null}
                    onChange={(opt: SingleValue<SelectOption>) =>
                      setUser(prev => ({ ...prev, role: opt?.value ?? '' }))
                    }
                    styles={buildSelectStyles(!!errors.role, isDark)}
                    noOptionsMessage={() => 'Sin resultados'}
                  />
                  {errors.role && (
                    <div className="error-message show">{errors.role}</div>
                  )}
                </div>

                {/* Contraseña */}
                <div className="form-group">
                  <label htmlFor="password">Contraseña *</label>
                  <div className="input-password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Mínimo 8 caracteres"
                      value={user.password}
                      onChange={handleUserChange}
                      className={errors.password ? 'error' : ''}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="btn-toggle-password"
                      onClick={() => setShowPassword(p => !p)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
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
                  <div className="input-password-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Repite tu contraseña"
                      value={user.confirmPassword}
                      onChange={handleUserChange}
                      className={errors.confirmPassword ? 'error' : ''}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="btn-toggle-password"
                      onClick={() => setShowConfirmPassword(p => !p)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showConfirmPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
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