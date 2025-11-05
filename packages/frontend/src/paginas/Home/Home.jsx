import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import ProductoCarousel from '../../componentes/CarouselProductos/ProductosCarousel'; 
import { getProductosDestacados } from '../../services/productoService'; 
import { Spinner } from 'react-bootstrap'; 
import { Button } from '../../componentes/Button/Button';

function Home() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchProductosDestacados = async () => {
      try {
        setIsLoading(true);
        setError(null); 
        const data = await getProductosDestacados(); 
        setProductos(data);
      } catch (err) {
        console.error("Error en Home.jsx al cargar productos destacados:", err);
        setError("No se pudieron cargar los productos destacados."); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductosDestacados();
  }, []); 

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.spinnerContainer}>
          <Spinner animation="border" role="status" variant="light" />
        </div>
      );
    }

    if (error) {
      return <p className={styles.homeSubtitle} style={{ color: 'red' }}>{error}</p>;
    }

    if (!productos || productos.length === 0) {
      return <p className={styles.homeSubtitle}>No hay productos destacados disponibles.</p>;
    }

    return <ProductoCarousel productos={productos} />;
  };

  return (
    <section className={styles.homeSection}>
      
      <img 
        src="/images/banner.png" 
        alt="Banner Tienda Sol" 
        className={styles.homeBanner} 
      />
      
      <div className={styles.homeContent}>
        
        <h1 className={styles.homeTitle}>
          Tu tienda online, simple y poderosa
        </h1>

        <div className={styles.homeButtons}>
          <Button variant="primary" size="lg">
            Buscar Productos
          </Button>
        </div>
        <div className={styles.carousel}>
          {renderContent()} 
        </div>
      </div>
    </section>
  );
}

export default Home;