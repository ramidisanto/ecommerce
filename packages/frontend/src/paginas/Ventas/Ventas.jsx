import React, { useState, useEffect } from "react";
import { MOCK_SALES } from "../../mockData/data";
import { getVentasPorVendedor, marcarPedidoEnviado } from "../../services/vendedorService";
import { OrderStatus } from "../../types";
import { ChevronLeftIcon, ChevronDownIcon } from "../../componentes/icons";
import { Button } from "../../componentes/Button/Button";
import "./Ventas.css";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useNotification } from "../../componentes/Context/NotificationContext";

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
    sale.estado === OrderStatus.SHIPPED ||
    sale.estado === OrderStatus.DELIVERED ||
    sale.estado === OrderStatus.CANCELLED;

  const saleId = sale._id;

  return (
    <div className="sale-card">
      <div className="sale-header">
        <div>
          <h3>Pedido NRO. {sale._id.slice(-6).toUpperCase()}</h3>
          <p>Fecha compra: {new Date(sale.fechaCreacion).toLocaleDateString()}</p>
          <p>Comprador: {sale.comprador.nombre}</p>
        </div>
        {getStatusChip(sale.estado)}
      </div>

      <div className="sale-body">
        <p className="cart-title">Carrito:</p>
        <div className="cart-items">
          {sale.items.map((item) => (
            <p key={item.producto.id || item.producto._id}>
              {item.cantidad} x {item.producto.titulo}
            </p>
          ))}
        </div>
      </div>

      <div className="sale-footer">
        <span className="total">${sale.total.toFixed(2)}</span>
        {isShippedOrBeyond ? (
          <Button variant="secondary" size="sm" disabled>
            {sale.estado === OrderStatus.CANCELLED ? 'Cancelado' : 'Enviado'}
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
  const { addNotification } = useNotification();
  const [ventas, setVentas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null); 

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

  useEffect(() => {
    fetchVentas();
  }, []); 
  const handleMarcarEnviado = async (pedidoId) => {
    if (!window.confirm("¿Estás seguro de que deseas marcar este pedido como enviado?")) {
      return;
    }

    setUpdatingId(pedidoId);
    try {
      await marcarPedidoEnviado(pedidoId);
      addNotification("Pedido marcado como enviado.", 'success');
      fetchVentas(); 

    } catch (err) {
      console.error("Error al marcar como enviado:", err);
      addNotification("No se pudo actualizar el pedido. Intenta nuevamente.", 'error');
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
        key={sale._id} 
        sale={sale} 
        onMarcarEnviado={handleMarcarEnviado}
        isUpdating={updatingId === sale._id} 
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