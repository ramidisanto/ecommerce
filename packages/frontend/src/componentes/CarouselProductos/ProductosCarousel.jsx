import React, { useState, useEffect } from "react";
import "./ProductosCarousel.css";
import ProductoItem from "./ProductoItem.jsx";

export default function ProductoCarousel({ productos }) {
  const [index, setIndex] = useState(0);
  const [itemsVisibles, setItemsVisibles] = useState(4);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth < 600) setItemsVisibles(1);
      else if (window.innerWidth < 900) setItemsVisibles(2);
      else if (window.innerWidth < 1200) setItemsVisibles(3);
      else setItemsVisibles(4);
    };

    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  // Resetear índice al cambiar productos
  useEffect(() => {
    setIndex(0);
  }, [productos]);

  if (!Array.isArray(productos) || productos.length === 0) {
    return <p className="carousel-empty">No hay productos disponibles</p>;
  }

  const maxIndex = Math.max(0, productos.length - itemsVisibles);

  const siguiente = () => {
    if (index < maxIndex) setIndex(index + 1);
  };

  const anterior = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">Productos Destacados</h2>

      <div className="carousel-wrapper">
        <div className="carousel-viewport">
          <div
            className="carousel-track"
            style={{
              width: `${(productos.length * 100) / itemsVisibles}%`,
              transform: `translateX(-${index * (100 / itemsVisibles)}%)`,
            }}
          >
            {productos.map((producto) => (
              <div
                key={producto._id || producto.id}
                className="carousel-item"
                style={{ flex: `0 0 ${100 / itemsVisibles}%` }}
              >
                <ProductoItem producto={producto} />
              </div>
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
          disabled={index >= maxIndex}
          className={`carousel-btn right-btn ${index >= maxIndex ? "disabled" : ""}`}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
