import React from 'react';
import './ProductoCard.css';
import { Button } from '../Button/Button';
import { useCart } from '../Context/CartContext';

export const ProductoCard = ({ producto }) => {
    const { addItem } = useCart();

    const imagenProducto = producto.fotos && producto.fotos.length > 0
        ? producto.fotos[0]
        : "/images/LOGOSOL.png";

    const handleAddToCart = () => {
        addItem(producto);
    };

    return (
        <div className="producto-tienda-card">
            <img
                src={imagenProducto}
                alt={producto.titulo}
                className="producto-tienda-image"
            />
            <div className="producto-tienda-info">
                <h3 className="producto-tienda-name">{producto.titulo}</h3>
                <p className="producto-tienda-stock">Stock: {producto.stock}</p>

                <div className="producto-tienda-details">
                    <span className="producto-tienda-sales">Ventas: {producto.ventas}</span>
                    <span className="producto-tienda-price">
                        ${producto.precio.toLocaleString("es-AR")}
                    </span>
                </div>

                <div className="producto-tienda-actions">
                    <Button
                        variant="primary"
                        size="md"
                        className="w-full"
                        onClick={handleAddToCart}
                        disabled={producto.stock === 0}
                    >
                        {producto.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
                    </Button>
                </div>
            </div>
        </div>
    );
};