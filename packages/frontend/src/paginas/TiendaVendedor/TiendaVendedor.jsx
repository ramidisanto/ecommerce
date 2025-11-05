import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductosPorVendedor } from '../../services/productoService';
import { ProductoCard } from '../../componentes/ProductoCard/ProductoCard';
import { ChevronLeftIcon } from '../../componentes/icons';
import { Spinner } from 'react-bootstrap';
import './TiendaVendedor.css';

export const TiendaVendedor = () => {
    const { id } = useParams(); 
    const [productos, setProductos] = useState([]);
    const [vendedorNombre, setVendedorNombre] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                setError(null);
                const data = await getProductosPorVendedor(id);

                if (data && data.length > 0) {
                    setProductos(data);
                    setVendedorNombre(data[0].vendedorId.nombre);
                } else {
                    setProductos([]);
                    setVendedorNombre('Vendedor');
                }
            } catch (err) {
                console.error("Error cargando productos de la tienda:", err);
                setError("No se pudieron cargar los productos.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductos();
    }, [id]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="tienda-spinner">
                    <Spinner animation="border" role="status" variant="dark" />
                </div>
            );
        }

        if (error) {
            return <p className="tienda-error">{error}</p>;
        }

        if (productos.length === 0) {
            return <p className="tienda-empty">Esta tienda aún no tiene productos.</p>;
        }

        return (
            <div className="producto-grid">
                {productos.map(producto => (
                    <ProductoCard key={producto._id} producto={producto} />
                ))}
            </div>
        );
    };

    return (
        <div className="tienda-container">
            <div className="tienda-header">
                <Link to="/" className="tienda-back-link">
                    <ChevronLeftIcon className="icon-md" />
                    Volver
                </Link>
                <h1 className="tienda-title">
                    Tienda de {vendedorNombre || '...'}
                </h1>
            </div>
            {renderContent()}
        </div>
    );
};