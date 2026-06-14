import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => { cargarProducto(); }, [id]);

  const cargarProducto = async () => {
    try {
      setCargando(true);
      const res = await api.get(`/productos/${id}`);
      setProducto(res.data);
    } catch {
      setProducto(null);
    } finally {
      setCargando(false);
    }
  };

  const agregarCarrito = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/carrito', { id_producto: producto.id_producto, cantidad: Number(cantidad) });
      setMensaje('Producto agregado al carrito correctamente.');
      window.dispatchEvent(new Event('carritoActualizado'));
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'No se pudo agregar al carrito.');
    }
  };

  if (cargando) return <main className="page-container"><div className="loading-state"><h2>Cargando producto...</h2></div></main>;
  if (!producto) return <main className="page-container"><div className="empty-state"><h2>Producto no encontrado</h2><Link className="btn-primary" to="/productos">Volver al catálogo</Link></div></main>;

  return (
    <main className="page-container">
      <section className="detalle-grid">
        <div className="detalle-imagen">
          <img src={producto.imagen_url || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80'} alt={producto.nombre} />
        </div>
        <div className="detalle-info">
          <span className="badge">{producto.categoria}</span>
          <h1>{producto.nombre}</h1>
          <p>{producto.descripcion}</p>
          <p><strong>Marca:</strong> {producto.marca}</p>
          <p><strong>Modelo compatible:</strong> {producto.modelo_compatible}</p>
          <p><strong>Stock disponible:</strong> {producto.stock}</p>
          <strong className="detalle-precio">${Number(producto.precio).toFixed(2)}</strong>
          <div className="quantity-box">
            <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
            <span>{cantidad}</span>
            <button onClick={() => setCantidad(Math.min(Number(producto.stock), cantidad + 1))}>+</button>
          </div>
          <button className="btn-primary full" onClick={agregarCarrito}>Agregar al carrito 🛒</button>
          {mensaje && <p className={mensaje.includes('correctamente') ? 'success-text' : 'error-text'}>{mensaje}</p>}
        </div>
      </section>
    </main>
  );
}

export default DetalleProducto;
