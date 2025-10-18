import React from 'react';
import './Header.css'; 
import BarraBuscador from '../BuscadorBarra/BarraBuscador';

function Header() {
  return (
    <header className="navbarHeader">
      <div className="navbarContent">
        <div className="logo">
          <a href="/">Tienda Sol</a> 
        </div>

        <div className="centerSearch">
          <BarraBuscador />
        </div>

        <div className="actionBoton">
          <button className="carritoBoton">Carrito</button>
          <button className="loginBoton">Iniciar Sesión</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
