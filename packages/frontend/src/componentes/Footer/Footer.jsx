import React from 'react';
import style from './Footer.module.css';

function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.footerContenido}>
        <div className={style.column}>
          <h4>Tienda Sol</h4>
          <p>El lugar para comprar y vender, a tu manera.</p>
        </div>
        <div className={style.column}>
          <h4>Navegación</h4>
          <ul>
            <li><a href="/productos">Explorar</a></li>
            <li><a href="/nosotros">Nosotros</a></li>
          </ul>
        </div>
        <div className={style.column}>
          <h4>Legal</h4>
          <ul>
            <li><a href="/terminos">Términos y Condiciones</a></li>
            <li><a href="/privacidad">Políticas de Privacidad</a></li>
          </ul>
        </div>
      </div>
      <div className={style.footerBoton}>
        <p>© 2025 Tienda Sol. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;