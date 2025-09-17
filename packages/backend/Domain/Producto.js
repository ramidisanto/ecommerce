import {DatosInsuficientesException} from "../Exceptions/DatosInsuficientesException.js";
import {StockInsuficienteException} from "../Exceptions/StockInsuficienteException.js";
export class Producto{
    id;
    vendedor;
    titulo;
    descripcion;
    categorias= [];
    precio;
    moneda;
    stock;
    fotos;
    activo;

    constructor(vendedor, titulo, descripcion, categorias, precio, moneda, stock, fotos, activo){

        this.vendedor = vendedor;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.categorias = categorias;
        this.precio = precio;
        this.moneda = moneda;
        this.stock = stock;
        this.fotos = fotos;
        this.activo = activo;
    }

    validarCantidad(cantidad){
        if(cantidad == null || cantidad <0){
            throw new DatosInsuficientesException ('Para conocer si el stock del producto es suficiente, se debe conocer la cantidad solicitad. La misma debe ser un valor mayor a 0')
        }
    }

    estaDisponible(cantidad){
        this.validarCantidad(cantidad);
        return this.stock >= cantidad
    }

    validarDisponible(cantidad){
        if(!this.estaDisponible(cantidad)){
            throw new StockInsuficienteException ('No hay suficiente stock')
        }
    }
    reducirStock(cantidad){
        this.validarDisponible(cantidad);
        this.stock -= cantidad;
    }

    aumentarStock(cantidad){
        this.validarCantidad(cantidad);
        this.stock += cantidad;
    }

    getVendedor(){
        return this.vendedor;
    }

    getNombre(){
        return this.titulo;
    }

    getId(){
        return this.id;
    }

    
}