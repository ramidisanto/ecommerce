import React from "react";
import { MOCK_SALES } from "../../mockData/data";
import { OrderStatus } from "../../types";
import { ChevronLeftIcon, ChevronDownIcon } from "../../componentes/icons";
import { Button } from "../../componentes/Button/Button";
import "./Ventas.css";
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

const SaleCard = ({ sale }) => {
  const isShippedOrBeyond =
    sale.status === OrderStatus.SHIPPED ||
    sale.status === OrderStatus.DELIVERED ||
    sale.status === OrderStatus.CANCELLED;

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
            <p key={item.product.id}>
              {item.quantity} x {item.product.title}
            </p>
          ))}
        </div>
      </div>

      <div className="sale-footer">
        <span className="total">${sale.total.toFixed(2)}</span>
        {isShippedOrBeyond ? (
          <Button variant="secondary" size="sm" disabled>
            Enviado
          </Button>
        ) : (
          <Button variant="primary" size="sm">
            Marcar como enviado
          </Button>
        )}
      </div>
    </div>
  );
};

export const SalesPage = () => (
  <div className="sales-container">
    <div className="sales-header">
      <Link to="/" className="back-link">
        <ChevronLeftIcon className="icon-md" />
      </Link>
      <h1>Mis Ventas</h1>
    </div>

    <div>
      {MOCK_SALES.map((sale) => (
        <SaleCard key={sale.id} sale={sale} />
      ))}
    </div>
  </div>
);