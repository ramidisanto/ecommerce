import React from 'react';
import styles from './Home.module.css';

function Home() {
  return (
    <section className={styles.homeSection}>
      <div className={styles.homeContent}>
        <h1 className={styles.homeTitle}>
          Tu tienda online, simple y poderosa
        </h1>
        <p className={styles.homeSubtitle}>
          Rama, tu novia te está engañando.
        </p>
        <div className={styles.homeButtons}>
          <button className={styles.primaryButton}>Buscar Productos</button>
        </div>
      </div>
    </section>
  );
}

export default Home;
