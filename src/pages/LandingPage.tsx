// src/pages/LandingPage.tsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import logoDark  from '../assets/img/logo-dark.png';
import logoLight from '../assets/img/logo-light.png';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useTheme } from '../hooks/useTheme';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const logo = isDark ? logoDark : logoLight;

  const currentYear: number = new Date().getFullYear();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleStart = () => {
    navigate('/register'); // o '/login' si quieres que vaya al login
  };

  const handleDemo = () => {
    // Aquí puedes mostrar un modal de demo o ir a otra página
    console.log('Ver demo');
  };

  useEffect(() => {
    document.body.className = 'landing-body'

    return () => {
      document.body.className = ''
    }
  }, [])

  return (
    <div className="main-wrapper-landing">
      {/* HEADER */}
      <header>
        <div className="header-content">
          <div className="logo">
            <img
              src={logo}
              alt="Kardex CO"
              className="h-14 w-auto object-contain"
            />
          </div>
          <nav>
            <a href="#features">Características</a>
            <a href="#cta">Planes</a>
            <a href="#contact">Contacto</a>
            <ThemeToggle />
            <button className="nav-button" onClick={handleLogin}>
              Iniciar sesión
            </button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Bienvenido a Kardex CO: Tu negocio, bajo control</h1>
            <p>
              Gestiona ventas, compras, inventario y flujo de caja en un solo
              lugar.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={handleStart}>
                Comenzar ahora
              </button>
              <button className="btn-secondary" onClick={handleDemo}>
                Ver demostración
              </button>
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

      {/* FEATURES SECTION */}
      <section className="features" id="features">
        <div className="features-container">
          <h2 className="section-title">¿Por qué elegir Kardex CO?</h2>
          <p className="section-subtitle">
            Las herramientas que necesitas para hacer crecer tu negocio
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Inventario Inteligente</h3>
              <p>
                Controla tu inventario en tiempo real, realiza seguimiento
                preciso de existencias y evita desabastecimientos.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Gestión Financiera</h3>
              <p>
                Visualiza tu flujo de caja con precisión, gestiona facturas y
                controla tus ingresos y gastos.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Reportes Avanzados</h3>
              <p>
                Toma decisiones basadas en datos con nuestros reportes
                detallados y personalizables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section" id="cta">
        <div className="cta-content">
          <h2>¿Listo para transformar tu negocio?</h2>
          <p>
            Únete a cientos de empresas que ya confiaron en Kardex CO para
            gestionar su inventario y finanzas.
          </p>
          <button className="cta-button" onClick={handleStart}>
            Crear Cuenta Gratis
          </button>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact-section" id="contact">
        <div className="contact-container">
          <h2 className="section-title">Contacto</h2>
          <p className="section-subtitle">¿Tienes alguna pregunta? Escríbeme directamente.</p>
          <div className="contact-card">
            <div className="contact-info">
              <div className="contact-name">Alejandro Benjumea Aguirre</div>
              <a
                href="mailto:alejo120792120792@hotmail.com"
                className="contact-link"
              >
                ✉️ alejo120792120792@hotmail.com
              </a>
              <a
                href="https://github.com/Alejandro-Benjumea-Aguirre"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                🐙 GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/alejandrobenjumea/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                💼 LinkedIn
              </a>
              <a
                href="https://alejodev.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                🌐 alejodev.cloud
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Producto</h4>
            <a href="#features">Características</a>
            <a href="#cta">Precios</a>
            <a href="#demo">Demo</a>
          </div>
          <div className="footer-section">
            <h4>Empresa</h4>
            <a href="#about">Sobre nosotros</a>
            <a href="#blog">Blog</a>
            <a href="#careers">Carreras</a>
          </div>
          <div className="footer-section">
            <h4>Soporte</h4>
            <a href="#help">Centro de ayuda</a>
            <a href="#contact">Contacto</a>
            <a href="#docs">Documentación</a>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#privacy">Privacidad</a>
            <a href="#terms">Términos</a>
            <a href="#cookies">Cookies</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; { currentYear } Kardex CO. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}