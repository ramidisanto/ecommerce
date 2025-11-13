import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './componentes/Context/CartContext'; 
import { Header } from './componentes/Header/Header';
import { Footer } from './componentes/Footer/Footer';
import { Checkout } from './paginas/checkout/Checkout';
import CartPage from './paginas/Carrito/Carrito';
import {SalesPage} from './paginas/Ventas/Ventas';
import {OrdersPage} from './paginas/Pedidos/Pedidos';
import  Notificaciones  from './paginas/notificaciones/Notificaciones';
import { TiendaVendedor } from './paginas/TiendaVendedor/TiendaVendedor';
import ProductoDetalle from './paginas/DetalleProducto/DetalleProducto';
import NotificationProvider from './componentes/Context/NotificationContext';
import { ToastContainer} from './componentes/Toast/ToastContainer';
import Home from './paginas/Home/Home';

import './App.css';

function App() {
  return (
    <NotificationProvider>
    <CartProvider>
  
      <HashRouter>
        <div className="app-wrapper">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vendedor/:id/productos" element={<TiendaVendedor />} />
              <Route path="/carrito" element={<CartPage/>} />
              <Route path="/checkout" element={<Checkout/>} />
              <Route path="/notificationes" element={<Notificaciones/>} />
              <Route path="/ventas" element={<SalesPage/>} />
              <Route path="/pedidos" element={<OrdersPage/>} />
              <Route path="/productos/:productoId" element={<ProductoDetalle/>} />
            </Routes>
            <ToastContainer />
          </main>
          <Footer />
        </div>
      </HashRouter>
    </CartProvider>
    </NotificationProvider>
  );
}

export default App;


