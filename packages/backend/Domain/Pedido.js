import { Usuario } from "./Usuario.js";
import { ItemPedido } from "./ItemPedido.js";
import { Notificacion } from "./Notificacion.js";
import { factoryNotificacion } from "./FactoryNotificacion.js";
import { CambioEstadoPedido } from "./CambioEstadoPedido.js";
import { EstadoPedido } from "./EstadoPedido.js";
import { NoSePuedeCambiarDeEstadoException } from "../Excepciones/NoSePuedeCambiarDeEstadoException.js";

export class Pedido{
    id;
    comprador;
    items = [];
    total;
    moneda;
    direccionEntrega;
    estado;
    fechaCreacion;
    historialEstados = [];

    constructor(comprador, items, moneda, direccionEntrega){
        this.comprador = comprador;
        this.items = items;
        this.total = this.calcularTotal();
        this.moneda = moneda;
        this.direccionEntrega = direccionEntrega;
        this.estado = EstadoPedido.Pendiente;
        this.fechaCreacion = new Date();
        this.historialEstados = [];
    }

/*/////////////// SETTERS ///////////////*/
  setEstado(nuevoEstado) {
    this.estado = nuevoEstado;
  }


/*/////////////// GETTERS ///////////////*/
  getEstado() {
    return this.estado;
  }

  getComprador() {
    return this.comprador;
  }

  getDireccionEntrega(){
    return this.direccionEntrega
  }

  getVendedor(){
    return this.items[0].getVendedor(); // Asumiendo que todos los productos son del mismo vendedor
  }

  getTotal() {
    return this.total;
  }

  getHistorialEstados() {
    return this.historialEstados;
  }

  getItems() {
    return this.items;
  }

  getNombreComprador() {
    return this.comprador.getNombre();
  }
  
  getNombreItems(){
    return this.items.map(item => item.getNombre());
  }

  getMoneda(){
    return this.moneda;
  }

  
/*/////////////// METODOS ///////////////*/
    // calcularTotal(): Double
  calcularTotal() {
    return this.items.reduce((total, item) => total + item.subtotal(), 0);
  }

  // validarStock(): boolean
  validarStock() {
    return this.items.every(item => item.tieneStockSuficiente());
  }

  // actualizarEstado(nuevoEstado: EstadoPedido, quien: Usuario, motivo: String): void
  actualizarEstado(estado, usuario, motivo){
      this.setEstado(estado);
      const nuevoEstado = new CambioEstadoPedido(estado, usuario, motivo);
      this.historialEstados.push(nuevoEstado);
  }

  notificar(){
    return factoryNotificacion.crearSegunPedido(this);
  }

  validarSePuedeCancelar(){
    if(this.getEstado() != EstadoPedido.Pendiente && this.getEstado() != EstadoPedido.Confirmado && this.getEstado() != EstadoPedido.En_Preparacion){
        throw new NoSePuedeCambiarDeEstadoException("El pedido no se puede cancelar en su estado actual.");
    }
    return true;
  }

}