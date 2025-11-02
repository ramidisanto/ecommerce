import React from 'react';
import './Header.css'; 
import BarraBuscador from '../BuscadorBarra/BarraBuscador';
import { FaShoppingCart } from 'react-icons/fa';


function Header() {
  return (
    <header className="navbarHeader">
      <div className="navbarContent">
        <div className="logo">
          <a href="/"><img src="/images/LOGOSOL.png" alt="Logo" /></a> 
        </div>

        <div className="centerSearch">
          <BarraBuscador />
        </div>

        <div className="actionBoton">
          <button className="carritoBoton">
            <FaShoppingCart />
          </button>
          <button className="loginBoton">Iniciar Sesión</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
