import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import api from './api/axios';
import Home from './pages/Home';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import Register from './pages/Register';
import Pedidos from './pages/Pedidos';
import AdminProductos from './pages/AdminProductos';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cantidadCarrito, setCantidadCarrito] = useState(0);

  const sincronizarSesion = async () => {
    const usuarioGuardado = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');
    setUsuario(usuarioGuardado ? JSON.parse(usuarioGuardado) : null);

    if (!token) {
      setCantidadCarrito(0);
      return;
    }

    try {
      const res = await api.get('/carrito');
      setCantidadCarrito(res.data.cantidadTotal || 0);
      localStorage.setItem('cantidadCarrito', String(res.data.cantidadTotal || 0));
    } catch {
      setCantidadCarrito(0);
    }
  };

  useEffect(() => {
    sincronizarSesion();
    window.addEventListener('storage', sincronizarSesion);
    window.addEventListener('carritoActualizado', sincronizarSesion);

    return () => {
      window.removeEventListener('storage', sincronizarSesion);
      window.removeEventListener('carritoActualizado', sincronizarSesion);
    };
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('cantidadCarrito');
    window.dispatchEvent(new Event('carritoActualizado'));
    window.location.href = '/';
  };

  return (
    <>
      <nav className="navbar">
        <Link className="logo" to="/">
          <span className="logo-orb">🏍️</span>
          <span>MotoStore Ecuador</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/productos">Catálogo</NavLink>
          <NavLink className="cart-link" to="/carrito">
            Carrito <span className="cart-count">{cantidadCarrito}</span>
          </NavLink>
          {usuario?.rol === "admin" && <Link to="/pedidos">Pedidos</Link>}
          {usuario?.rol === 'admin' && (
            <NavLink className="admin-link" to="/admin/productos">Panel Admin</NavLink>
          )}
          {!usuario && (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Registro</NavLink>
            </>
          )}
          {usuario && <button className="logout-btn" onClick={cerrarSesion}>Salir</button>}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/login" element={<Login onLogin={sincronizarSesion} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/productos" element={<ProtectedAdminRoute><AdminProductos /></ProtectedAdminRoute>} />
      </Routes>
    </>
  );
}

export default App;
