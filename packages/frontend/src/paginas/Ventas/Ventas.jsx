import React, { useState, useEffect } from "react";
import { MOCK_SALES } from "../../mockData/data";
import { getVentasPorVendedor, marcarPedidoEnviado } from "../../services/vendedorService";
import { OrderStatus } from "../../types";
import { ChevronLeftIcon, ChevronDownIcon } from "../../componentes/icons";
import { Button } from "../../componentes/Button/Button";
import "./Ventas.css";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const getStatusChip = (status) => {
  const classNames = {
    [OrderStatus.PENDING]: "chip gray",
    [OrderStatus.CONFIRMED]: "chip blue",
    [OrderStatus.PREPARING]: "chip yellow",
    [OrderStatus.SHIPPED]: "chip green",
    [OrderStatus.DELIVERED]: "chip purple",
    [OrderStatus.CANCELLED]: "chip red",
  };
  return <span className={classNames[status]}>{status.replace("_", " ")}</span>;
};

const SaleCard = ({ sale, onMarcarEnviado, isUpdating }) => {
  const isShippedOrBeyond =
    sale.status === OrderStatus.SHIPPED ||
    sale.status === OrderStatus.DELIVERED ||
    sale.status === OrderStatus.CANCELLED;

  const saleId = sale.id;

  return (
    <div className="sale-card">
      <div className="sale-header">
        <div>
          <h3>Pedido NRO. {sale.id.slice(-6).toUpperCase()}</h3>
          <p>Fecha compra: {new Date(sale.creationDate).toLocaleDateString()}</p>
          <p>Comprador: {sale.buyer.name}</p>
        </div>
        {getStatusChip(sale.status)}
      </div>

      <div className="sale-body">
        <p className="cart-title">Carrito:</p>
        <div className="cart-items">
          {sale.items.map((item) => (
            <p key={item.product.id || item.product._id}>
              {item.quantity} x {item.product.title}
            </p>
          ))}
        </div>
      </div>

      <div className="sale-footer">
        <span className="total">${sale.total.toFixed(2)}</span>
        {isShippedOrBeyond ? (
          <Button variant="secondary" size="sm" disabled>
            {sale.status === OrderStatus.CANCELLED ? 'Cancelado' : 'Enviado'}
          </Button>
        ) : (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onMarcarEnviado(saleId)}
            isLoading={isUpdating} 
          >
            Marcar como enviado
          </Button>
        )}
      </div>
    </div>
  );
};

export const SalesPage = () => {
  const [ventas, setVentas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null); 

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setIsLoading(true);
        const data = await getVentasPorVendedor();
        setVentas(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar ventas:", err);
        setError("No se pudieron cargar las ventas.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVentas();
  }, []);

  const handleMarcarEnviado = async (pedidoId) => {
      setUpdatingId(pedidoId);
      try {
        const ventaActualizada = await marcarPedidoEnviado(pedidoId);
        setVentas(prevVentas =>
          prevVentas.map(venta =>
            venta.id === pedidoId ? ventaActualizada : venta
          )
        );
      } catch (err) {
        console.error("Error al marcar como enviado:", err);
    
      } finally {
        setUpdatingId(null); 
      }
    };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Spinner animation="border" variant="dark" />
        </div>
      );
    }

    if (error) {
      return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
    }

    if (ventas.length === 0) {
      return <p style={{ textAlign: 'center' }}>Todavia no tenes ninguna venta.</p>;
    }

    return ventas.map((sale) => (
      <SaleCard 
        key={sale.id} 
        sale={sale} 
        onMarcarEnviado={handleMarcarEnviado}
        isUpdating={updatingId === sale.id} 
      />
    ));
  };

  return (
    <div className="sales-container">
      <div className="sales-header">
        <Link to="/" className="back-link">
          <ChevronLeftIcon className="icon-md" />
        </Link>
        <h1>Mis Ventas</h1>
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
};