import { Usuario } from "./packages/backend/Domain/Usuario.js";
import { ItemPedido } from "./Domain/ItemPedido.js";


export class Pedido{
    id;
    comprador;
    items;
    total;
    moneda;
    direccionEntrega;
    estado;
    fechaCreacion;
    historialEstados = [];

    constructor({comprador, items, moneda, direccionEntrega, fechaCreacion}){
        this.comprador = comprador;
        this.items = items;
        this.total = this.calcularTotal();
        this.moneda = moneda;
        this.direccionEntrega = direccionEntrega;
        this.estado = "PENDIENTE";
        this.fechaCreacion = fechaCreacion;
        this.historialEstados = [];
    }

    // calcularTotal(): Double
  calcularTotal() {
    let cantidadTotal = 0;
    this.items.forEach(item => {
      cantidadTotal += item.subtotal();
    });
    return cantidadTotal;
  }

  total(cantidad) {
    this.total = cantidad;
  }


  // validarStock(): boolean
  validarStock() {
    return this.items.every(item => item.tieneStockSuficiente());
  }

  guardarCambioEstado(cambioEstado) {
    this.historialEstados.push(cambioEstado);
    this.setEstado(cambioEstado.getEstado());
  }

  setEstado(nuevoEstado) {
    this.estado = nuevoEstado;
  }

  getEstado() {
    return this.estado;
  }

  getComprador() {
    return this.comprador;
  }

  //TODO:: ver que hacer con el comprador

}