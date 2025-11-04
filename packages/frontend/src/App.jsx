import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './componentes/Context/CartContext'; 
import  Landing  from './paginas/Landing';
import { Header } from './componentes/Header/Header';
import { Footer } from './componentes/Footer/Footer';
import { Checkout } from './paginas/checkout/Checkout';
import CartPage from './paginas/Carrito/Carrito';
import {SalesPage} from './paginas/Ventas/Ventas';
import {OrdersPage} from './paginas/Pedidos/Pedidos';
import  Notificaciones  from './paginas/notificaciones/Notificaciones';

import './App.css';

function App() {
  return (
    <CartProvider>
      <HashRouter>
        <div className="app-wrapper">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/carrito" element={<CartPage/>} />
              <Route path="/checkout" element={<Checkout/>} />
              <Route path="/notificationes" element={<Notificaciones/>} />
              <Route path="/ventas" element={<SalesPage/>} />
              <Route path="/pedidos" element={<OrdersPage/>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </CartProvider>
  );
}

export default App;


