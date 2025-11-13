import React from 'react';
import './Footer.css'; 

export const Footer = () => {
  return (
    <footer className="footer-principal">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Derechos Reservados - Tienda Sol</p>
      </div>
    </footer>
  );
};