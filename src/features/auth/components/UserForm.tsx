import Select, { SingleValue } from 'react-select';
import { SelectOption } from "../types/register.types"
import { useState } from 'react';


export const UseForm = ({ data, errors, onChange, onNext, onSubmit, onSelectChange, styles, isDark, isLoading }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const ROLE_OPTIONS: SelectOption[] = [
        { value: 'owner',      label: 'Propietario / Dueño' },
        { value: 'admin',      label: 'Administrador' },
        { value: 'manager',    label: 'Gerente' },
        { value: 'accountant', label: 'Contador' },
        { value: 'warehouse',  label: 'Encargado de Bodega' },
    ];

    const getPasswordStrength = (
        pwd: string
    ): { level: 0 | 1 | 2 | 3; label: string } => {
        if (!pwd || pwd.length === 0) return { level: 0, label: '' };
        
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;

        const labels = ['', 'Débil', 'Media', 'Fuerte'];
        return { level: score as 0 | 1 | 2 | 3, label: labels[score] };
    };

    const pwdStrength = getPasswordStrength(data.password);


    return (
        <form onSubmit={onSubmit} key="step2">
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
                      value={data.firstName}
                      onChange={onChange}
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
                      value={data.lastName}
                      onChange={onChange}
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
                    value={data.email}
                    onChange={onChange}
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
                    options={ROLE_OPTIONS}
                    value={ROLE_OPTIONS.find(opt => opt.value === data.role) || null}
                    onChange={(opt: SingleValue<SelectOption>) =>
                        onSelectChange((prev: any) => ({ ...prev, role: opt?.value ?? '' }))
                    }
                    styles={styles(!!errors.role, isDark)}
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
                      value={data.password}
                      onChange={onChange}
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
                  {data.password.length > 0 && (
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
                      value={data.confirmPassword}
                      onChange={onChange}
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
                    onClick={() => onNext(1)}
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
    )
}