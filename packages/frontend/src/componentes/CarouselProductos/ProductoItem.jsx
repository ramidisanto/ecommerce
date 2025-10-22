import React from "react"; // Importar React es buena práctica en archivos JSX
import "./ProductoItem.css";
import { Link } from "react-router-dom";
import "../../index.css"; // Asumo que este sigue siendo necesario

const ProductoItem = ({ producto }) => {
    return (
        <div key={producto.id} className="carousel-card">
            <div className="producto-card">
                <img
                    src={producto.fotos[0]} // Usamos el primer item del array 'fotos'
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
                            <Link to={`/productos/${producto.id}`} className="link-no-style">
                                Ver Detalles
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductoItem;