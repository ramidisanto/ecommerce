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
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [vendedorNombre, setVendedorNombre] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');

    useEffect(() => {
        const fetchProductos = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                setError(null);
                const data = await getProductosPorVendedor(id);

                if (data && data.length > 0) {
                    setProductos(data);
                    setProductosFiltrados(data);
                    setVendedorNombre(data[0].vendedorId.nombre);
                } else {
                    setProductos([]);
                    setProductosFiltrados([]);
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

    useEffect(() => {
        let filtrados = productos.filter((p) => {
            const coincideNombre = p.titulo.toLowerCase().includes(nombre.toLowerCase());
            const coincideCategoria = categoria ? p.categoria?.toLowerCase().includes(categoria.toLowerCase()) : true;
            const coincideDescripcion = p.descripcion?.toLowerCase().includes(descripcion.toLowerCase());
            const coincidePrecioMin = precioMin ? p.precio >= parseFloat(precioMin) : true;
            const coincidePrecioMax = precioMax ? p.precio <= parseFloat(precioMax) : true;

            return coincideNombre && coincideCategoria && coincideDescripcion && coincidePrecioMin && coincidePrecioMax;
        });

        setProductosFiltrados(filtrados);
    }, [nombre, categoria, descripcion, precioMin, precioMax, productos]);

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
                {productosFiltrados.map(producto => (
                <ProductoCard producto={producto} />
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
            {/* FILTROS */}
            <div className="filtros-container">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Categoría"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Precio mínimo"
                    min="0"
                    value={precioMin}
                    onChange={(e) => {
                    const value = Math.max(0, Number(e.target.value));
                    setPrecioMin(value);
                    }}
                />
                <input
                    type="number"
                    placeholder="Precio máximo"
                    min="0"
                    value={precioMax}
                    onChange={(e) => {
                    const value = Math.max(0, Number(e.target.value));
                    setPrecioMax(value);
                    }}
                />
            </div>
            {renderContent()}
        </div>
    );
};