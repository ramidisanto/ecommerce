import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import ProductoCarousel from '../../componentes/CarouselProductos/ProductosCarousel';
import { getProductosDestacados } from '../../services/productoService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useKeycloak } from '@react-keycloak/web';


function Home() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    const fetchProductosDestacados = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProductosDestacados();

        // Solo filtrar si Keycloak está inicializado y el usuario está autenticado
        if (initialized && keycloak.authenticated && keycloak.tokenParsed?.sub) {
          const usuarioLogeado = keycloak.tokenParsed.sub;
          const productosFiltrados = data.filter(producto => {
            return producto.vendedorId && producto.vendedorId !== usuarioLogeado;
          });
          setProductos(productosFiltrados);
        } else {
          // Sin autenticación o Keycloak no disponible, mostrar todos
          setProductos(data);
        }
      } catch (err) {
        console.error("Error en Home.jsx al cargar productos destacados:", err);
        setError("No se pudieron cargar los productos destacados.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductosDestacados();
  }, [initialized, keycloak]);

  const renderContent = () => {
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

    if (error) return <p className={styles.errorText}>{error}</p>;
    if (!productos || productos.length === 0)
      return <p className={styles.homeSubtitle}>No hay productos destacados disponibles.</p>;

    return <ProductoCarousel productos={productos} />;
  };

  return (
    <section className={styles.homeSection}>
      <div className={styles.hero}>
        <img src="/images/banner.png" alt="Banner Tienda Sol" className={styles.heroImage} />
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Tienda Sol - E-commerce de Productos</h1>
          <p className={styles.heroSubtitle}>
            Comprá y vendé de forma rápida, segura y sin complicaciones.
          </p>
        </div>
      </div>

      <div className={styles.homeContent}>
        <div className={styles.carousel}>{renderContent()}</div>
      </div>
    </section>
  );
}

export default Home;
