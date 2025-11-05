import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import ProductoCarousel from '../../componentes/CarouselProductos/ProductosCarousel'; 
import { getProductosDestacados } from '../../services/productoService'; 
import { Spinner } from 'react-bootstrap'; 
import { Button } from '../../componentes/Button/Button';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


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
    // if (isLoading) {
    //   return (
    //     <div className={styles.spinnerContainer}>
    //       <Spinner animation="border" role="status" variant="light" />
    //     </div>
    //   );
    // }
    if (isLoading) {
    return (
    <div className={styles.skeletonContainer}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <Skeleton height={180} className={styles.skeletonImage} />
          <Skeleton height={25} width="80%" className={styles.skeletonTitle} />
          <Skeleton height={20} width="60%" className={styles.skeletonPrice} />
          <Skeleton height={40} width="100%" className={styles.skeletonButton} />
        </div>
      ))}
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