import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <main>
      <section className="hero">
        <video className="hero-video-bg" autoPlay muted loop playsInline>
          <source src="/videos/moto-hero.mp4" type="video/mp4" />
        </video>

        <div className="hero-video-overlay"></div>

        <div className="hero-content">
          <span className="hero-badge">🏁 Tienda especializada en motos</span>

          <h1>Potencia tu moto con estilo, seguridad y rendimiento</h1>

          <p>
            Cascos, aceites, llantas, frenos, repuestos y accesorios en un solo lugar.
          </p>

          <div className="hero-actions">
            <Link className="btn-primary" to="/productos">
              Explorar catálogo →
            </Link>

            <Link className="btn-glass" to="/login">
              Ingresar
            </Link>
          </div>
        </div>

        <div className="national-delivery-card">
          <div className="national-card-top">
            <span className="live-dot"></span>
            <strong>Cobertura nacional activa</strong>
          </div>

          <div className="ecuador-premium-map">
            <img
              src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-map-of-ecuador-filled-with-flag-travel-picture-image_13045754.png"
              alt="Mapa del Ecuador"
            />

            <div className="map-glow-line"></div>
            <div className="map-bike">🏍️</div>
          </div>

          <div className="national-info">
            <h2>Envíos a todo el Ecuador</h2>
            <p>
              Compra desde cualquier ciudad y recibe repuestos y accesorios con
              una experiencia rápida, moderna y conectada.
            </p>
          </div>

          <div className="national-tags">
            <span>Costa</span>
            <span>Sierra</span>
            <span>Amazonía</span>
            <span>Galápagos</span>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <strong>+40</strong>
          <span>productos disponibles</span>
        </div>

        <div className="stat-card">
          <strong>5</strong>
          <span>categorías de inventario</span>
        </div>

        <div className="stat-card">
          <strong>24/7</strong>
          <span>catálogo en línea</span>
        </div>

        <div className="stat-card">
          <strong>Contacto</strong>
          <span>0998393045</span>
        </div>
      </section>

      <section className="section dark-section">
        <div className="section-head">
          <span className="badge">🏍️ Garaje digital</span>
          <h2>Todo lo que necesita una moto en un solo lugar</h2>
          <p>
            Encuentra productos seleccionados para seguridad, rendimiento,
            mantenimiento y estilo.
          </p>
        </div>

        <div className="category-preview">
          <div className="category-box">
            <div className="icon">🪖</div>
            <h3>Cascos</h3>
            <p>Protección para ciudad y carretera.</p>
          </div>

          <div className="category-box">
            <div className="icon">🛢️</div>
            <h3>Aceites</h3>
            <p>Lubricantes para cuidar el motor.</p>
          </div>

          <div className="category-box">
            <div className="icon">🛞</div>
            <h3>Llantas</h3>
            <p>Agarre, durabilidad y control.</p>
          </div>

          <div className="category-box">
            <div className="icon">⚙️</div>
            <h3>Repuestos</h3>
            <p>Frenos, bujías, cadenas y piezas.</p>
          </div>

          <div className="category-box">
            <div className="icon">🧤</div>
            <h3>Accesorios</h3>
            <p>Comodidad y estilo para motociclistas.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div>
          <span className="badge">🔥 Compra inteligente</span>
          <h2>Elige, agrega al carrito y genera tu pedido en línea</h2>
        </div>

        <Link className="btn-primary" to="/productos">
          Comprar ahora →
        </Link>
      </section>
    </main>
  );
}

export default Home;