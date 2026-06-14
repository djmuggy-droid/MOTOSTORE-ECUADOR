import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    telefono: '',
    direccion: '',
  });

  const [mensaje, setMensaje] = useState('');

  const cambiar = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registrar = async (e) => {
    e.preventDefault();

    try {
      await api.post('/auth/register', form);

      setMensaje('Usuario registrado correctamente. Ahora puedes iniciar sesión.');

      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje || 'No se pudo registrar el usuario.'
      );
    }
  };

  return (
    <main className="register-page-wrap">
      <section className="register-visual-side">
        <div className="register-visual-overlay"></div>

        <div className="register-visual-content">
          <span className="register-chip">🏁 Nuevo acceso MotoStore</span>

          <h1>
            Tu ruta empieza
            <span> con una cuenta hecha para riders</span>
          </h1>

          <p>
            Crea tu espacio dentro de MotoStore y descubre una experiencia
            pensada para quienes buscan repuestos, accesorios y estilo con
            personalidad.
          </p>

          <div className="register-visual-cards">
            <div className="register-mini-card">
              <strong>⚡</strong>
              <span>Explora productos de forma ágil</span>
            </div>

            <div className="register-mini-card">
              <strong>🛒</strong>
              <span>Guarda tus compras en un carrito dinámico</span>
            </div>

            <div className="register-mini-card">
              <strong>📦</strong>
              <span>Genera pedidos con factura simulada</span>
            </div>

            <div className="register-mini-card">
              <strong>🗺️</strong>
              <span>Compra con cobertura nacional</span>
            </div>
          </div>

          <div className="register-floating-points">
            <span>Garaje digital</span>
            <span>Compra segura</span>
            <span>Experiencia MotoStore</span>
          </div>
        </div>
      </section>

      <section className="register-form-side">
        <div className="register-form-card">
          <span className="register-chip small">📝 Crear perfil</span>

          <h2>Crea tu cuenta</h2>

          <p className="register-subtext">
            Completa tus datos y empieza a comprar desde la tienda.
          </p>

          <form onSubmit={registrar} className="register-form-grid">
            <div className="register-input-box full">
              <label>Nombre completo</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={cambiar}
                placeholder="Ejemplo: Juan Pérez"
                required
              />
            </div>

            <div className="register-input-box full">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={cambiar}
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>

            <div className="register-input-box full">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={cambiar}
                placeholder="Crea una contraseña segura"
                required
              />
            </div>

            <div className="register-input-box">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={cambiar}
                placeholder="0999999999"
              />
            </div>

            <div className="register-input-box">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={cambiar}
                placeholder="Tu dirección de entrega"
              />
            </div>

            <button type="submit" className="register-submit-btn">
              Crear cuenta
            </button>

            {mensaje && <p className="register-error-text">{mensaje}</p>}
          </form>

          <div className="register-bottom-links">
            <span>¿Ya tienes acceso?</span>
            <Link to="/login">Inicia sesión</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;