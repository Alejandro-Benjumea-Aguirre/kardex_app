// src/pages/RegisterPage.tsx

import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';
import {useDarkMode} from '../hooks/useDarkMode';
import {useRegisterForm} from '../hooks/useRegisterForm';
import { CompanyForm } from '../components/CompanyForm';
import { UseForm } from '../components/UserForm';
import { RegisterBrand } from '../components/RegisterBrand';
import { buildSelectStyles } from '../styles/RegisterSelect.styles';

export default function RegisterPage() {
  const navigate = useNavigate();
  const isDark = useDarkMode();
  const form = useRegisterForm();

  return (
    <div className="main-wrapper-register">
      <div className="register-container">

        {/* ── LADO IZQUIERDO ── */}
        <RegisterBrand currentStep={form.currentStep} />

        {/* ── LADO DERECHO ── */}
        <div className="register-form-section">

          {/* Encabezado dinámico */}
          <div className="form-header">
            <h2>
              {form.currentStep === 1
                ? 'Información de la Empresa'
                : 'Datos del Usuario Administrador'}
            </h2>
            <p>
              {form.currentStep === 1
                ? 'Paso 1 de 2 — Completa los datos de tu empresa'
                : 'Paso 2 de 2 — Crea tu cuenta de acceso'}
            </p>
          </div>

          {/* Barra de progreso */}
          <div className="progress-bar-wrapper">
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${form.progressPct}%` }}
              />
            </div>
            <div className="progress-label">
              <span className="active-step-label">
                {form.currentStep === 1 ? 'Empresa' : 'Usuario'}
              </span>
              <span>{form.progressPct}% completado</span>
            </div>
          </div>

          {/* Mensaje de éxito global */}
          <div className={`success-message ${form.showSuccess ? 'show' : ''}`}>
            ✓ Cuenta creada exitosamente. Redirigiendo al inicio de sesión...
          </div>

          {/* Error general */}
          {form.errors.general && (
            <div className="error-message show" style={{ marginBottom: '1rem' }}>
              {form.errors.general}
            </div>
          )}

          {/* ──────────────── PASO 1: EMPRESA ──────────────── */}
          {form.currentStep === 1 && (
            <CompanyForm 
            data={form.company}
            errors={form.errors}
            onChange={form.handleCompanyChange}
            onSelectChange={form.setCompany} // Pasamos el setter para el Select
            onNext={form.handleNextStep}
            styles={buildSelectStyles(!!form.errors.sector, isDark)}
            isDark={isDark}
            />
          )}

          {/* ──────────────── PASO 2: USUARIO ──────────────── */}
          {form.currentStep === 2 && (
            <UseForm 
              data={form.company}
              errors={form.errors}
              onChange={form.handleCompanyChange}
              onSelectChange={form.setCompany} // Pasamos el setter para el Select
              onNext={form.handleNextStep}
              onSubmit={form.handleSubmit}
              styles={buildSelectStyles(!!form.errors.sector, isDark)}
              isDark={isDark}
              isLoading={form.isLoading}
            />
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