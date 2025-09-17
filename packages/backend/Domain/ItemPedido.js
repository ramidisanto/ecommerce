import { Producto } from "./Producto.js";

export class ItemPedido{
    producto;
    cantidad;
    precioUnitario;

    constructor(producto, cantidad, precioUnitario){
        this.producto = producto
        this.cantidad = cantidad
        this.precioUnitario = precioUnitario
    }

    subtotal(){
        return this.cantidad * this.precioUnitario; 
    }

    tieneStockSuficiente(){
        return this.producto.estaDisponible(this.cantidad);
    }

    getVendedor(){
        return this.producto.getVendedor();
    }

    getNombre(){
        return this.producto.getNombre();
    }

    getProducto(){
        return this.producto;
    }

    getCantidad(){
        return this.cantidad;
    }

    getProductoId(){
        return this.producto.getId();
    }

    getPrecioUnitario(){
        return this.precioUnitario;
    }
}