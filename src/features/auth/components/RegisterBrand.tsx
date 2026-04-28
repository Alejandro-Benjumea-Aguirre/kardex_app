import { useNavigate } from 'react-router-dom';

export const RegisterBrand = ({ currentStep }: any) => {
    const navigate = useNavigate();
    return (
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
    )
}