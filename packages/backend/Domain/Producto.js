import {DatosInsuficientesException} from "../Excepciones/DatosInsuficientesException.js";
import {StockInsuficienteException} from "../Excepciones/StockInsuficienteException.js";
export class Producto{
    id;
    vendedorId;
    titulo;
    descripcion;
    categorias= [];
    precio;
    moneda;
    stock;
    fotos;
    activo;
    ventas;

    constructor(vendedorId, titulo, descripcion, categorias, precio, moneda, stock, fotos, activo){

        this.vendedorId = vendedorId;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.categorias = categorias;
        this.precio = precio;
        this.moneda = moneda;
        this.stock = stock;
        this.fotos = fotos;
        this.activo = activo;
        this.ventas = 0;
    }

    validarCantidad(cantidad){
        if(cantidad == null || cantidad <0){
            throw new DatosInsuficientesException ('Para conocer si el stock del producto es suficiente, se debe conocer la cantidad solicitad. La misma debe ser un valor mayor a 0')
        }
    }

    estaDisponible(cantidad){
        this.validarCantidad(cantidad);
        return this.getStock() >= cantidad
    }

    validarDisponible(cantidad){
        if(!this.estaDisponible(cantidad)){
            throw new StockInsuficienteException ('No hay suficiente stock')
        }
    }
    reducirStock(cantidad){
        this.validarDisponible(cantidad);
        this.stock -= cantidad;
        this.ventas += cantidad;
    }

    aumentarStock(cantidad){
        this.validarCantidad(cantidad);
        this.stock += cantidad;
    }

    getVendedor(){
        return this.vendedorId;
    }

    getNombre(){
        return this.titulo;
    }

    getId(){
        return this.id;
    }


    getPrecio(){
        return this.precio;
    }

    getStock(){
        return this.stock;
    }
}