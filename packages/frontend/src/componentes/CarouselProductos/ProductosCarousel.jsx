import React, { useState, useEffect } from "react";
import styles from './ProductosCarousel.css';
import ProductoItem from "./ProductoItem.jsx";

export default function ProductoCarousel({ productos }) {
    useEffect(() => {
        // Resetea el índice si la lista de productos cambia
        setIndex(0);
    }, [productos]);

    const [index, setIndex] = useState(0);  //INDEX SE POSICIONA EN EL ITEM NUMERO N 
    const visible = 3; // Cuantos items mostrar a la vez en el carrusel

    const siguiente = () => {
        if (index < productos.length - visible) {
            setIndex(index + 1);
        }
    };

    const anterior = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

    // Verifica si productos es un array válido y tiene items
    if (!Array.isArray(productos) || productos.length === 0) {
        return <p className="carousel-empty">No hay productos disponibles</p>;
    }

    return (
        <div className="carousel-container">
            <h2 className="carousel-title">Productos Destacados</h2>

            <div className="carousel-wrapper">
                <div className="carousel-viewport">
                    <div
                        className="carousel-track"
                        style={{
                            // Mueve el "track" horizontalmente
                            transform: `translateX(-${index * (100 / visible)}%)`,
                        }}
                    >
                        {productos.map((producto) => (
                            <ProductoItem producto={producto} key={producto.id} />
                        ))}
                    </div>
                </div>

                <button
                    onClick={anterior}
                    disabled={index === 0}
                    className={`carousel-btn left-btn ${index === 0 ? "disabled" : ""}`}
                >
                    ◀
                </button>

                <button
                    onClick={siguiente}
                    disabled={index >= productos.length - visible}
                    className={`carousel-btn right-btn ${index >= productos.length - visible ? "disabled" : ""
                        }`}
                >
                    ▶
                </button>
            </div>
        </div>
    );
}