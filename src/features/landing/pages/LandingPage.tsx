import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import logoDark  from '../../../assets/img/logo-dark.png';
import logoLight from '../../../assets/img/logo-light.png';
import ThemeToggle from '../../../components/ui/ThemeToggle';
import { useTheme } from '../../../hooks/useTheme';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const logo = isDark ? logoDark : logoLight;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    document.body.className = 'landing-body';
    return () => { document.body.className = ''; };
  }, []);

  return (
    <div className="main-wrapper-landing">
      <header>
        <div className="header-content">
          <div className="logo">
            <img src={logo} alt="Kardex CO" className="h-14 w-auto object-contain" />
          </div>
          <nav>
            <a href="#features">Características</a>
            <a href="#cta">Planes</a>
            <a href="#contact">Contacto</a>
            <ThemeToggle />
            <button className="nav-button" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Bienvenido a Kardex CO: Tu negocio, bajo control</h1>
            <p>Gestiona ventas, compras, inventario y flujo de caja en un solo lugar.</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/register')}>Comenzar ahora</button>
              <button className="btn-secondary" onClick={() => console.log('Ver demo')}>Ver demostración</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="illustration-box">
              <div className="chart-elements">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="features-container">
          <h2 className="section-title">¿Por qué elegir Kardex CO?</h2>
          <p className="section-subtitle">Las herramientas que necesitas para hacer crecer tu negocio</p>
          <div className="features-grid">
            {[
              { icon: '📦', title: 'Inventario Inteligente', desc: 'Controla tu inventario en tiempo real, realiza seguimiento preciso de existencias y evita desabastecimientos.' },
              { icon: '💰', title: 'Gestión Financiera',     desc: 'Visualiza tu flujo de caja con precisión, gestiona facturas y controla tus ingresos y gastos.' },
              { icon: '📊', title: 'Reportes Avanzados',    desc: 'Toma decisiones basadas en datos con nuestros reportes detallados y personalizables.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section" id="cta">
        <div className="cta-content">
          <h2>¿Listo para transformar tu negocio?</h2>
          <p>Únete a cientos de empresas que ya confiaron en Kardex CO para gestionar su inventario y finanzas.</p>
          <button className="cta-button" onClick={() => navigate('/register')}>Crear Cuenta Gratis</button>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-container">
          <h2 className="section-title">Contacto</h2>
          <p className="section-subtitle">¿Tienes alguna pregunta? Escríbeme directamente.</p>
          <div className="contact-card">
            <div className="contact-info">
              <div className="contact-name">Alejandro Benjumea Aguirre</div>
              <a href="mailto:alejo120792120792@hotmail.com" className="contact-link">✉️ alejo120792120792@hotmail.com</a>
              <a href="https://github.com/Alejandro-Benjumea-Aguirre" target="_blank" rel="noopener noreferrer" className="contact-link">🐙 GitHub</a>
              <a href="https://www.linkedin.com/in/alejandrobenjumea/" target="_blank" rel="noopener noreferrer" className="contact-link">💼 LinkedIn</a>
              <a href="https://alejodev.cloud" target="_blank" rel="noopener noreferrer" className="contact-link">🌐 alejodev.cloud</a>
            </div>
          </div>
        </div>
      </section>

      <footer id="footer">
        <div className="footer-content">
          {[
            { title: 'Producto',  links: [['#features','Características'],['#cta','Precios'],['#demo','Demo']] },
            { title: 'Empresa',   links: [['#about','Sobre nosotros'],['#blog','Blog'],['#careers','Carreras']] },
            { title: 'Soporte',   links: [['#help','Centro de ayuda'],['#contact','Contacto'],['#docs','Documentación']] },
            { title: 'Legal',     links: [['#privacy','Privacidad'],['#terms','Términos'],['#cookies','Cookies']] },
          ].map(section => (
            <div key={section.title} className="footer-section">
              <h4>{section.title}</h4>
              {section.links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Kardex CO. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
