import React from 'react';
import styles from './Navbar.module.css'; 

function Navbar() {
  return (
    <header className={styles.navbarHeader}>
      <div className={styles.logo}>
        <a href="/">Tienda Sol</a> 
      </div>
      <nav>
        <ul className={styles.navList}>
          <li><a href="/products">Explorar</a></li>
          <li><a href="/about">Aca puede ir alguna barra de navegacion</a></li>
        </ul>
      </nav>
      <div className={styles.actionBoton}>
        <button className={styles.carritoBoton}>Carrito</button>
        <button className={styles.loginBoton}>Iniciar Sesión</button>
      </div>
    </header>
  );
}

export default Navbar;
