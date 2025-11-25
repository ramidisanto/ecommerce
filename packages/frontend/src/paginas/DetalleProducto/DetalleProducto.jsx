import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductoPorId, getProductosPorVendedor } from '../../services/productoService'; 
import { ProductoCard } from '../../componentes/ProductoCard/ProductoCard'; 
import { Button } from '../../componentes/Button/Button';
import { useCart } from '../../componentes/Context/CartContext';
import { ChevronLeftIcon, ChevronRightIcon } from '../../componentes/icons';
import { ProductDetailSkeleton, ProductCardSkeleton } from '../../componentes/Skeleton/SkeletonCard';
import './DetalleProducto.css'; 

const ProductoDetalle = () => {
    const { productoId } = useParams();
    const { addItem } = useCart();
    const navigate = useNavigate();
    const [loadingRelated, setLoadingRelated] = useState(true);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productoId) return;
            
            setLoading(true);
            setError(false);
            setProduct(null);
            try {
                
                const data = await getProductoPorId(productoId);
                setProduct(data);
            } catch (err) {
                console.error("Error al buscar el producto:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productoId]); 

    
    useEffect(() => {
    const fetchRelatedProducts = async () => {
        if (product && product.vendedorId) {
            try {
                setLoadingRelated(true);
                const data = await getProductosPorVendedor(product.vendedorId._id);
                const related = data.productos
                    .filter(p => p._id !== product._id)
                    .slice(0, 4);
                setRelatedProducts(related);
            } catch (err) {
                console.error("Error al buscar productos relacionados:", err);
            } finally {
                setLoadingRelated(false);
            }
        }
    };

    fetchRelatedProducts();
}, [product]);
    

    
    const goToPrevious = () => {
        const isFirstImage = currentImageIndex === 0;
        const newIndex = isFirstImage ? product.fotos.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(newIndex);
    };

    const goToNext = () => {
        const isLastImage = currentImageIndex === product.fotos.length - 1;
        const newIndex = isLastImage ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(newIndex);
    };
    
    const handleAddToCart = () => {
        addItem(product, quantity);
        console.log("Producto añadido!");
    }

    const increaseQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(q => q + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(q => q - 1);
        }
    };


    if (loading) {
    return (
        <div className="product-detail-container">
            <div className="product-detail-header">
                <button onClick={() => navigate(-1)} className="product-back-button">
                    <ChevronLeftIcon className="icon-sm" />
                    Volver
                </button>
            </div>
            <ProductDetailSkeleton />
        </div>
    );
}

    if (error || !product) {
        return (
            <div className="product-not-found">
                <h1>Producto no encontrado</h1>
                <p>No pudimos encontrar el producto que buscás.</p>
                <Link to="/">
                    <Button variant="primary">Volver al inicio</Button>
                </Link>
            </div>
        );
    }


    return (
        <div className="product-detail-container">
            <div className="product-detail-header">
                <button onClick={() => navigate(-1)} className="product-back-button">
                    <ChevronLeftIcon className="icon-sm" />
                    Volver
                </button>
            </div>

            <div className="product-detail-content">
                <div className="product-detail-grid">
                  
                    <div className="product-images">
                        <div className="product-thumbnails">
                            {product.fotos && product.fotos.map((photo, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`thumbnail-button ${currentImageIndex === index ? 'active' : ''}`}
                                >
                                   
                                    <img src={photo} alt={`${product.titulo} thumbnail ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                         
                        <div className="product-main-image">
                            <img 
                                src={product.fotos && product.fotos.length > 0 ? product.fotos[currentImageIndex] : "/images/LOGOSOL.png"} 
                                alt={product.titulo} 
                            />
                            {product.fotos && product.fotos.length > 1 && (
                                <>
                                    <button onClick={goToPrevious} className="image-nav-button left" aria-label="Imagen anterior">
                                        <ChevronLeftIcon className="icon-md" />
                                    </button>
                                     <button onClick={goToNext} className="image-nav-button right" aria-label="Siguiente imagen">
                                        <ChevronRightIcon className="icon-md" />
                                     </button>
                                </>
                            )}
                        </div>
                    </div>

                    
                    <div className="product-info">
                        <h1 className="product-title">{product.titulo}</h1>
                       
                        <Link to={`/vendedor/${product.vendedorId._id}/productos`} className="product-seller-link">
                            Vendido por {product.vendedorId.nombre}
                        </Link>
                        
                        <p className="product-price">${product.precio.toLocaleString("es-AR")}</p>
                        
                        <div className="product-description">
                            <p>{product.descripcion}</p>
                        </div>
                        <div className="product-categories">
                            {product.categorias && product.categorias.map((cat, index) => (
                            <span key={index} className="product-category">
                                {cat}
                            </span>
                        ))}
                        </div>
                        
                        <div className="product-actions">
                            <p className="product-stock">{product.stock} unidades disponibles</p>
                             <div className="product-purchase">
                                <div className="quantity-selector">
                                    <Button variant="ghost" size="sm" onClick={decreaseQuantity} aria-label="Disminuir cantidad">-</Button>
                                    <span className="quantity-display" aria-live="polite">{quantity}</span>
                                    <Button variant="ghost" size="sm" onClick={increaseQuantity} aria-label="Aumentar cantidad">+</Button>
                                </div>
                                <Button onClick={handleAddToCart} size="lg" className="add-to-cart-btn" disabled={product.stock === 0}>
                                    {product.stock === 0 ? "Sin Stock" : "Añadir al carrito"}
                                </Button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            
            {relatedProducts.length > 0 && (
    <div className="related-products">
        <h2>Más de {product.vendedorId.nombre}</h2>
        {loadingRelated ? (
            <div className="related-products-grid">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
            </div>
        ) : (
            <div className="related-products-grid">
                {relatedProducts.map(p => <ProductoCard key={p._id} producto={p} />)}
            </div>
        )}
    </div>
)}
        </div>
    );
};

export default ProductoDetalle;