import React from "react";
import "./ProductoItem.css";
import { Link } from "react-router-dom";
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
                    <p className="producto-stock">Stock: {producto.stock}</p>
                    <div className="producto-details">
                        <span className="producto-sales">Ventas: {producto.ventas}</span>
                        <span className="producto-price">
                            ${producto.precio.toLocaleString("es-AR")}
                        </span>
                    </div>
                    <div className="ver-detalles-container">
                        <span className="ver-detalles">
                            <Link to={`/vendedor/${idVendedor}/productos`} className="link-no-style">
                                Ver Tienda
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductoItem;