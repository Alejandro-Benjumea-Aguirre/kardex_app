import Select, { SingleValue } from 'react-select';
import { SelectOption } from '../types/register.types';

export const CompanyForm = ({ data, errors, onChange, onNext, onSelectChange, styles, isDark }: any) => {

  const SECTOR_OPTIONS: SelectOption[] = [
    { value: 'retail', label: 'Comercio / Retail' },
    { value: 'food', label: 'Alimentos y Bebidas' },
    { value: 'manufacturing', label: 'Manufactura' },
    { value: 'services', label: 'Servicios' },
    { value: 'technology', label: 'Tecnología' },
    { value: 'healthcare', label: 'Salud' },
    { value: 'education', label: 'Educación' },
    { value: 'construction', label: 'Construcción' },
    { value: 'agriculture', label: 'Agropecuario' },
    { value: 'other', label: 'Otro' },
  ];

  return (
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
                    value={data.companyName}
                    onChange={onChange}
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
                    value={data.nit}
                    onChange={onChange}
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
                    options={SECTOR_OPTIONS}
                    value={SECTOR_OPTIONS.find(opt => opt.value === data.sector) || null}
                    onChange={(opt: SingleValue<SelectOption>) =>
                      onSelectChange((prev: any) => ({ ...prev, sector: opt?.value ?? '' }))
                    }
                    styles={styles(!!errors.sector, isDark)}
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
                    value={data.phone}
                    onChange={onChange}
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
                  value={data.address}
                  onChange={onChange}
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
                    value={data.country ? { value: data.country, label: data.country } : null}
                    onChange={(opt: SingleValue<SelectOption>) =>
                      onSelectChange((prev: any) => ({ ...prev, country: opt?.value ?? '' }))
                    }
                    styles={styles(!!errors.country, isDark)}
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
                    value={data.city ? { value: data.city, label: data.city } : null}
                    onChange={(opt: SingleValue<SelectOption>) =>
                      onSelectChange((prev: any) => ({ ...prev, city: opt?.value ?? '' }))
                    }
                    styles={styles(!!errors.city, isDark)}
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
                  value={data.website}
                  onChange={onChange}
                />
              </div>

              {/* Acción */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-next"
                  onClick={onNext}
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
  );
};