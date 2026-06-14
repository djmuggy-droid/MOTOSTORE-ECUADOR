import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Productos() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const respuestaCategorias = await api.get('/categorias');
      const respuestaProductos = await api.get('/productos');

      setCategorias(respuestaCategorias.data);
      setProductos(respuestaProductos.data);
    } catch (error) {
      console.error('Error al cargar catálogo:', error);
    } finally {
      setCargando(false);
    }
  };

  const iconoCategoria = (nombre) => {
    const nombreLimpio = nombre.toLowerCase();

    if (nombreLimpio.includes('casco')) return '🪖';
    if (nombreLimpio.includes('aceite')) return '🛢️';
    if (nombreLimpio.includes('repuesto')) return '⚙️';
    if (nombreLimpio.includes('accesorio')) return '🧤';
    if (nombreLimpio.includes('llanta')) return '🛞';

    return '🏍️';
  };

  const textoCategoria = (nombre) => {
    const nombreLimpio = nombre.toLowerCase();

    if (nombreLimpio.includes('casco')) {
      return 'Protección, seguridad y estilo para cada recorrido.';
    }

    if (nombreLimpio.includes('aceite')) {
      return 'Lubricantes pensados para rendimiento y vida útil del motor.';
    }

    if (nombreLimpio.includes('repuesto')) {
      return 'Piezas compatibles para mantener tu moto siempre lista.';
    }

    if (nombreLimpio.includes('accesorio')) {
      return 'Detalles funcionales para conducción, comodidad y personalidad.';
    }

    if (nombreLimpio.includes('llanta')) {
      return 'Agarre, control y estabilidad para ciudad o carretera.';
    }

    return 'Productos seleccionados para motociclistas.';
  };

  const seleccionarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria.id_categoria);
    setNombreCategoria(categoria.nombre);
  };

  const volverCategorias = () => {
    setCategoriaSeleccionada(null);
    setNombreCategoria('');
  };

  const productosFiltrados = productos.filter(
    (producto) => producto.id_categoria === categoriaSeleccionada
  );

  if (cargando) {
    return (
      <main className="catalog-premium-page">
        <div className="loading-state">
          <h2>Cargando catálogo...</h2>
          <p>Preparando la vitrina MotoStore para ti.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="catalog-premium-page">
      <section className="catalog-hero-premium">
        <div>
          <span className="catalog-kicker">🏁 MotoStore Ecuador</span>

          {!categoriaSeleccionada ? (
            <>
              <h1>Explora tu garaje digital</h1>
              <p>
                Selecciona una línea de productos y descubre opciones para
                equipar, cuidar y personalizar tu moto.
              </p>
            </>
          ) : (
            <>
              <h1>{nombreCategoria}</h1>
              <p>
                Productos disponibles en esta categoría. Revisa detalles,
                precios, stock y agrega al carrito.
              </p>

              <button className="catalog-back-btn" onClick={volverCategorias}>
                ← Volver a categorías
              </button>
            </>
          )}
        </div>

        <div className="catalog-hero-panel">
          <div className="catalog-panel-orb"></div>
          <strong>Ride Mode</strong>
          <span>Variedad de Categorias</span>
        </div>
      </section>

      {!categoriaSeleccionada && (
        <section className="premium-category-grid">
          {categorias.map((categoria, index) => (
            <button
              key={categoria.id_categoria}
              className="premium-category-card"
              onClick={() => seleccionarCategoria(categoria)}
            >
              <div className="category-number">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="premium-category-icon">
                {iconoCategoria(categoria.nombre)}
              </div>

              <div className="premium-category-content">
                <h3>{categoria.nombre}</h3>
                <p>{textoCategoria(categoria.nombre)}</p>
              </div>

              <div className="category-card-footer">
                <span>Ver productos</span>
                <strong>→</strong>
              </div>
            </button>
          ))}
        </section>
      )}

      {categoriaSeleccionada && (
        <section className="productos-grid premium-products-grid">
          {productosFiltrados.length === 0 ? (
            <div className="empty-state">
              <h2>No hay productos disponibles</h2>
              <p>Esta categoría no tiene productos activos por el momento.</p>
            </div>
          ) : (
            productosFiltrados.map((producto) => (
              <article className="producto-card premium-product-card" key={producto.id_producto}>
                <div className="premium-product-img">
                  <img src={producto.imagen_url} alt={producto.nombre} />
                  <span>{producto.categoria}</span>
                </div>

                <div className="producto-info">
                  <h3>{producto.nombre}</h3>

                  <p>
                    <strong>Marca:</strong> {producto.marca}
                  </p>

                  <p>
                    <strong>Compatible:</strong> {producto.modelo_compatible}
                  </p>

                  <p>
                    <strong>Stock:</strong> {producto.stock}
                  </p>

                  <strong className="precio">
                    ${Number(producto.precio).toFixed(2)}
                  </strong>

                  <Link
                    className="btn-detalle"
                    to={`/productos/${producto.id_producto}`}
                  >
                    Ver detalle →
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      )}
    </main>
  );
}

export default Productos;