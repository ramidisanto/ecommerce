import {StockInsuficiente} from "../Excepciones/StockInsuficiente";

export class Producto{
    id;
    vendedor;
    titulo;
    descripcion;
    categorias;
    precio;
    moneda;
    stock;
    fotos;
    activo;

    constructor({vendedor, titulo, descripcion, categorias, precio, moneda, stock, fotos, activo}){

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

    estaDisponible(cantidad){
        if(cantidad == null){
            throw new Exception ('Para conocer si el stock del producto es suficiente, se debe conocer la cantidad solicitad')
        }
        else{
            if (this.stock >= cantidad)
                return true;
            else
                return false;
        }
    }

    reducirStock(cantidad){
        if(cantidad == null || cantidad <0){
            throw new Exception ('Para conocer si el stock del producto es suficiente, se debe conocer la cantidad solicitad. La misma debe ser un valor mayor a 0')
        }
        else{
            if(this.estaDisponible(cantidad))
            {
                this.stock -= cantidad;
            }
            else{
                throw new StockInsuficiente ('No hay sufiente stock')
            }
        }
    }

    aumentarStock(cantidad){
        if(cantidad == null || cantidad < 0){
            throw new Exception ('Para conocer si el stock del producto es suficiente, se debe conocer la cantidad solicitad')
        }
        else{
            this.stock += cantidad;
        }
    }
}