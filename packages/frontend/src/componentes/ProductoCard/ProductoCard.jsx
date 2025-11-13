import React, { useState } from 'react';
import './ProductoCard.css';
import { Button } from '../Button/Button';
import { useCart } from '../Context/CartContext';
import { useNotification } from '../Context/NotificationContext';
import { PlusIcon, MinusIcon } from '../icons';
import { useNavigate } from 'react-router-dom'; 

export const ProductoCard = ({ producto }) => {
  const { addItem } = useCart();
  const { addNotification } = useNotification();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate(); 

  const imagenProducto =
    producto.fotos && producto.fotos.length > 0
      ? producto.fotos[0]
      : "/images/LOGOSOL.png";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (producto.stock > 0) {
      addItem(producto, quantity);
      addNotification(`${producto.titulo} añadido al carrito!`, 'success');
      setQuantity(1);
    }
  };

  const increaseQuantity = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (quantity < producto.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div
      className="producto-tienda-card"
      onClick={() => navigate(`/productos/${producto._id}`)} 
      style={{ cursor: 'pointer' }}
    >
      <img
        src={imagenProducto}
        alt={producto.titulo}
        className="producto-tienda-image"
      />
      <div className="producto-tienda-info">
        <h3 className="producto-tienda-name">{producto.titulo}</h3>
        <div className="product-categories">
            {producto.categorias && producto.categorias.map((cat, index) => (
            <span key={index} className="product-category">
                  {cat}
            </span>
        ))}
        </div>

        <div className="producto-tienda-details">
          <span className="producto-tienda-price">
            ${producto.precio.toLocaleString("es-AR")}
          </span>
        </div>

        <div className="producto-cantidad">
          <Button
            size="sm"
            variant="ghost"
            onClick={decreaseQuantity}
            disabled={quantity === 1}
          >
            <MinusIcon className="icon-small" />
          </Button>
          <span className="producto-cantidad-valor">{quantity}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={increaseQuantity}
            disabled={quantity >= producto.stock}
          >
            <PlusIcon className="icon-small" />
          </Button>
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
