import React from "react";
import { MOCK_ORDERS } from "../../mockData/data";
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

const OrderCard = ({ order }) => {
  const canCancel =
    order.status === OrderStatus.PENDING ||
    order.status === OrderStatus.CONFIRMED;

  return (
    <div className="order-card">
      <div className="order-header">
        <div>
          <h3>Pedido NRO. {order.id.slice(-6).toUpperCase()}</h3>
          <p>Fecha compra: {new Date(order.creationDate).toLocaleDateString()}</p>
        </div>
        {getStatusChip(order.status)}
      </div>

      <div className="order-body">
        <p className="cart-title">Carrito:</p>
        <div className="cart-items">
          {order.items.map((item) => (
            <p key={item.product.id}>
              {item.quantity} x {item.product.title}
            </p>
          ))}
        </div>
      </div>

      <div className="order-footer">
        <span className="total">${order.total.toFixed(2)}</span>
        {canCancel ? (
          <Button variant="danger" size="sm">
            Cancelar
          </Button>
        ) : (
          <Button variant="secondary" size="sm" disabled>
            {order.status === OrderStatus.SHIPPED
              ? "Enviado"
              : "No cancelable"}
          </Button>
        )}
      </div>
    </div>
  );
};

export const OrdersPage = () => (
  <div className="orders-container">
    <div className="orders-header">
      <Link to="/" className="back-link">
        <ChevronLeftIcon className="icon-md" />
      </Link>
      <h1>Mis Pedidos</h1>
    </div>

    <div>
      {MOCK_ORDERS.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  </div>
);
