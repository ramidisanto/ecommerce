import React from 'react';
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak"; // Asegúrate de que este archivo se llame Keycloak.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './componentes/Context/CartContext'; 
import { Header } from './componentes/Header/Header';
import { Footer } from './componentes/Footer/Footer';
import { Checkout } from './paginas/checkout/Checkout';
import CartPage from './paginas/Carrito/Carrito';
import { SalesPage } from './paginas/Ventas/Ventas';
import { OrdersPage } from './paginas/Pedidos/Pedidos';
import Notificaciones from './paginas/notificaciones/Notificaciones';
import { TiendaVendedor } from './paginas/TiendaVendedor/TiendaVendedor';
import ProductoDetalle from './paginas/DetalleProducto/DetalleProducto';
import NotificationProvider from './componentes/Context/NotificationContext';
import { ToastContainer } from './componentes/Toast/ToastContainer';
import Home from './paginas/Home/Home';
import PrivateRoute from "./helpers/PrivateRoute";
import './App.css';

function App() {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <NotificationProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="app-wrapper">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/vendedor/:id/productos" element={<TiendaVendedor />} />
                  <Route path="/carrito" element={<CartPage/>} />
                  <Route path="/productos/:productoId" element={<ProductoDetalle/>} />
                  <Route path="/checkout" element={<PrivateRoute><Checkout/></PrivateRoute>} />
                  <Route path="/notificationes" element={<PrivateRoute><Notificaciones/></PrivateRoute>} />
                  <Route path="/ventas" element={<PrivateRoute><SalesPage/></PrivateRoute>} />
                  <Route path="/pedidos" element={<PrivateRoute><OrdersPage/></PrivateRoute>} />
                  
                  
                  
                </Routes>
                <ToastContainer />
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </NotificationProvider>
    </ReactKeycloakProvider>
  );
}

export default App;