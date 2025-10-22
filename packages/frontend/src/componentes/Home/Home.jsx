import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import ProductoCarousel from '../../componentes/CarouselProductos/ProductosCarousel'; 
import mockProductos from '../../mockData/productos';
import { Spinner } from 'react-bootstrap'; 

function Home() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProductos(mockProductos); 
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer); 
  }, []); 

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

        <div className={styles.carousel}>
          {isLoading ? (
            <div className={styles.spinnerContainer}>
              <Spinner animation="border" role="status" variant="light" />
            </div>
          ) : (
            <ProductoCarousel productos={productos} />
          )}
        </div>
      </div>
    </section>
  );
}

export default Home;