import React, { useState, useEffect, useRef } from "react";
import './ProductosCarousel.css';
import ProductoItem from "./ProductoItem.jsx";

export default function ProductoCarousel({ productos }) {
    const [index, setIndex] = useState(0);
    const trackRef = useRef(null);
    const [cardWidth, setCardWidth] = useState(0);
    const [itemsVisibles, setItemsVisibles] = useState(3);

    // Calcular itemsVisibles según el ancho de la ventana
    useEffect(() => {
        const calculateItemsVisible = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setItemsVisibles(1); // Mobile
            } else if (width < 1024) {
                setItemsVisibles(2); // Tablet
            } else {
                setItemsVisibles(3); // Desktop
            }
        };

        calculateItemsVisible();
        window.addEventListener("resize", calculateItemsVisible);
        return () => window.removeEventListener("resize", calculateItemsVisible);
    }, []);

    // Resetear índice cuando cambian los productos
    useEffect(() => {
        setIndex(0);
    }, [productos]);

    // Medir ancho de la primera tarjeta y recalcular en resize
    useEffect(() => {
        const measure = () => {
            const firstCard = trackRef.current?.children?.[0];
            if (firstCard) {
                const w = firstCard.getBoundingClientRect().width;
                setCardWidth(w);
            }
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [productos]);

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
                        ref={trackRef}
                        style={{
                            transform: `translateX(-${index * cardWidth}px)`,
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