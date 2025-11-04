import React from 'react';
import { useCart } from '../../componentes/Context/CartContext';
import { PlusIcon, MinusIcon, TrashIcon, ChevronLeftIcon } from '../../componentes/icons';
import { Button } from '../../componentes/Button/Button';
import { Link } from 'react-router-dom';
import './Carrito.css';


const CartPage = () => {
    const { cartItems, cartTotal, updateQuantity, removeItem, clearCart } = useCart();

    return (
        <div className="cart-container">
            <div className="cart-header">
                <Link to="/" className="cart-back-link">
                    <ChevronLeftIcon className="icon" />
                </Link>
                <h1 className="cart-title">Carrito de Compras</h1>
            </div>

            <div className="cart-box">
                {cartItems.length > 0 ? (
                    <>
                        <div className="cart-table-header">
                            <div className="cart-col-product">Producto</div>
                            <div className="cart-col-quantity">Cantidad</div>
                            <div className="cart-col-price">Precio</div>
                            <div className="cart-col-subtotal">Subtotal</div>
                        </div>

                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-product">
                                    <img src={item.photos[0]} alt={item.title} className="cart-product-img" />
                                    <div>
                                        <p className="cart-product-title">{item.title}</p>
                                        <p className="cart-product-seller">{item.seller.name}</p>
                                    </div>
                                </div>

                                <div className="cart-quantity">
                                    <Button size="sm" variant="ghost" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                        <MinusIcon className="icon-small" />
                                    </Button>
                                    <span className="cart-quantity-value">{item.quantity}</span>
                                    <Button size="sm" variant="ghost" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                        <PlusIcon className="icon-small" />
                                    </Button>
                                </div>

                                <div className="cart-price">${item.price.toFixed(2)}</div>
                                <div className="cart-subtotal">${(item.price * item.quantity).toFixed(2)}</div>

                                <div className="cart-remove-mobile">
                                    <Button size="sm" variant="danger" onClick={() => removeItem(item.id)}>
                                        <TrashIcon className="icon-small mr-1" /> Quitar
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <div className="cart-summary">
                            <div className="cart-total">
                                <span className="cart-total-label">Total (ARS):</span>
                                <span className="cart-total-value">${cartTotal.toFixed(2)}</span>
                            </div>

                            <div className="cart-actions">
                                <Link to="/">
                                    <Button variant="secondary">Seguir Comprando</Button>
                                </Link>
                                <div className="cart-action-buttons">
                                    <Button variant="ghost" onClick={clearCart}>Cancelar</Button>
                                    <Link to="/checkout">
                                        <Button variant="primary">Iniciar Compra</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="cart-empty">
                        <h2 className="cart-empty-title">Tu carrito está vacío</h2>
                        <p className="cart-empty-text">¡Añade productos para empezar a comprar!</p>
                        <Link to="/">
                            <Button variant="primary">Ir a la tienda</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
export default CartPage;
