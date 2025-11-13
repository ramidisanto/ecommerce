import React from 'react';
import styles from './PaginaProtegida.css';

const PaginaProtegida = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Página Protegida</h1>
      <p className={styles.subtitle}>
        Si puedes ver este mensaje, significa que has iniciado sesión
        correctamente con Keycloak.
      </p>
    </div>
  );
};

export default PaginaProtegida;