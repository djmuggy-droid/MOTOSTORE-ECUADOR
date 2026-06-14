import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/login', { correo, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));

      window.dispatchEvent(new Event('carritoActualizado'));

      onLogin?.();

      navigate(
        res.data.usuario.rol === 'admin' ? '/admin/productos' : '/productos'
      );
    } catch {
      setMensaje('Correo o contraseña incorrectos.');
    }
  };

  return (
    <main className="login-page-wrap">
      <section className="login-experience">
        <div className="login-experience-overlay"></div>

        <div className="login-experience-content">
          <span className="login-badge">🏍️ Acceso MotoStore</span>

          <h1>
            Entra a una experiencia
            <span> más rápida, potente y segura</span>
          </h1>

          <p>
            Gestiona tus compras, revisa productos para tu moto y accede a una
            plataforma pensada para motociclistas que buscan estilo, rendimiento
            y confianza.
          </p>

          <div className="login-highlights">
            <div className="login-highlight-card">
              <strong>+40</strong>
              <span>Productos</span>
            </div>

            <div className="login-highlight-card">
              <strong>5</strong>
              <span>Categorías</span>
            </div>

            <div className="login-highlight-card">
              <strong>24/7</strong>
              <span>Compra online</span>
            </div>
          </div>

          <div className="login-features">
            <span>⚡ Compra ágil</span>
            <span>🛡️ Acceso seguro</span>
            <span>📦 Seguimiento de pedidos</span>
            <span>🏁 Enfocado en motociclistas</span>
          </div>
        </div>
      </section>

      <section className="login-panel-side">
        <div className="login-panel-card">
          <span className="login-badge small">🔐 Acceso seguro</span>

          <h2>Iniciar sesión</h2>

          <p className="login-subtext">
            Ingresa como cliente o administrador autorizado.
          </p>

          <form onSubmit={iniciarSesion} className="login-form-modern">
            <div className="login-input-group">
              <label>Correo electrónico</label>

              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="admin@motostore.com"
                required
              />
            </div>

            <div className="login-input-group">
              <label>Contraseña</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            <button type="submit" className="login-submit-btn">
              Ingresar
            </button>

            {mensaje && <p className="login-error-text">{mensaje}</p>}
          </form>

          <div className="login-bottom-links">
            <span>¿No tienes cuenta?</span>
            <Link to="/register">Regístrate</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;