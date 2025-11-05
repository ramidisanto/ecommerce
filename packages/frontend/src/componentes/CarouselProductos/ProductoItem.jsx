import React from "react";
import "./ProductoItem.css";
import { Link } from "react-router-dom";
import { Button } from "../Button/Button";
import "../../index.css";

const ProductoItem = ({ producto, itemsVisibles }) => {

    const idVendedor = producto.vendedorId._id;
    const imagenProducto = producto.fotos && producto.fotos.length > 0
        ? producto.fotos[0]
        : "/images/LOGOSOL.png";

    return (
        <div
            key={producto._id}
            className="carousel-card"
            style={{ flexBasis: `calc(100% / ${itemsVisibles})` }}
        >
            <div className="producto-card">
                <img
                    src={imagenProducto}
                    alt={producto.titulo}
                    className="producto-image"
                />
                <div className="producto-info">
                    <h3 className="producto-name">{producto.titulo}</h3>
                    
                    <div className="producto-details">
                        
                        <span className="producto-price">
                            ${producto.precio.toLocaleString("es-AR")}
                        </span>
                    </div>

                    <div className="ver-detalles-container">
                        <Link to={`/vendedor/${idVendedor}/productos`} className="link-no-style">
                            <Button variant="primary" size="md" className="w-full">
                                Ver Tienda
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductoItem;