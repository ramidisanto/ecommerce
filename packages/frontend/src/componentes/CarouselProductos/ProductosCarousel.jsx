import React, { useState, useEffect } from "react";
import './ProductosCarousel.css';
import ProductoItem from "./ProductoItem.jsx";

export default function ProductoCarousel({ productos, itemsVisibles = 4 }) {
    useEffect(() => {
        setIndex(0);
    }, [productos]);

    const [index, setIndex] = useState(0);

    const siguiente = () => {
        if (index < productos.length - itemsVisibles) {
            setIndex(index + 1);
        }
    };

    const anterior = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

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
                            transform: `translateX(-${index * (100 / itemsVisibles)}%)`,
                        }}
                    >
                        {productos.map((producto) => (
                            <ProductoItem
                                producto={producto}
                                key={producto._id || producto.id}
                                itemsVisibles={itemsVisibles}
                            />
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
                    disabled={index >= productos.length - itemsVisibles}
                    className={`carousel-btn right-btn ${index >= productos.length - itemsVisibles ? "disabled" : ""
                        }`}
                >
                    ▶
                </button>
            </div>
        </div>
    );
}