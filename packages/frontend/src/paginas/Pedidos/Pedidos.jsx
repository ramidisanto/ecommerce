import React from "react";
import { getPedidosPorUsuario, marcarPedidoCancelado } from "../../services/pedidosService";
import { ChevronLeftIcon } from "../../componentes/icons";
import { OrderStatus } from "../../types";
import { Button } from "../../componentes/Button/Button";
import "./Pedidos.css";
import { Link } from "react-router-dom";


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

const OrderCard = ({ order, onCancel }) => {
  const canCancel =
    order.estado === OrderStatus.PENDING ||
    order.estado === OrderStatus.CONFIRMED;

  return (
    <div className="order-card">
      <div className="order-header">
        <div>
          <h3>Pedido NRO. {String(order.id).slice(-6).toUpperCase()}</h3>
          <p>Fecha compra: {new Date(order.fechaCreacion).toLocaleDateString()}</p>
        </div>
        {getStatusChip(order.estado)}
      </div>

      <div className="order-body">
        <p className="cart-title">Carrito:</p>
        <div className="cart-items">
          {order.items.map((item) => (
            <p key={item.producto.id}>
              {item.cantidad} x {item.producto.titulo}
            </p>
          ))}
        </div>
      </div>

      <div className="order-footer">
        <span className="total">${order.total.toFixed(2)}</span>
        {canCancel ? (
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => onCancel(order.id)}
          >
            Cancelar
          </Button>
        ) : (
          <Button variant="secondary" size="sm" disabled>
            {order.estado === OrderStatus.SHIPPED
              ? "Enviado"
              : "No cancelable"}
          </Button>
        )}
      </div>
    </div>
  );
};

export const OrdersPage = () => {
  const [orders, setOrders] = React.useState([]);

  const [loading, setLoading] = React.useState(true);

  const [error, setError] = React.useState(null);

  const fetchOrders = async () => {
    try{
      setLoading(true);
      const data = await getPedidosPorUsuario();
      setOrders(data);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setError("No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (! window.confirm("¿Estás seguro de que deseas cancelar este pedido?")) {
      return;
    }
    try {
      await marcarPedidoCancelado(orderId);
      alert("Pedido cancelado con éxito.");
      fetchOrders();
    } catch (err) {
      console.error("Error al cancelar el pedido:", err);
      alert("No se pudo cancelar el pedido. Intenta nuevamente.");
    }
  };

  if (loading) {
    return <div>Cargando pedidos...</div>;
  } 
  if (error) {
    return <div className="error-message">{error}</div>;
  } 

  return (
  
  <div className="orders-container">
    <div className="orders-header">
      <Link to="/" className="back-link">
        <ChevronLeftIcon className="icon-md" />
      </Link>
      <h1>Mis Pedidos</h1>
    </div>

    <div>
      {orders.length > 0 ?(
        orders.map((order) => (
        <OrderCard key={order.id} order={order} onCancel={handleCancelOrder}/>
      ))
      ) : (
        <p>No tienes pedidos realizados.</p>
      )}
    </div>
  </div>
  );
};
