import { TipoUsuario } from "./TipoUsuario.js";
import { NoEsVendedorException } from "../Excepciones/NoEsVendedorException.js";

export class Usuario{
    id;
    nombre;
    email;
    telefono;
    tipo;
    fechaAlta;


    constructor(nombre, email, telefono, tipo, fechaAlta) {
        this.nombre = nombre
        this.email = email
        this.telefono = telefono
        this.tipo = tipo
        this.fechaAlta = fechaAlta
    }

    getNombre(){
        return this.nombre;
    }

    verificarEsVendedor(){
        if (this.tipo !== TipoUsuario.Vendedor) {
            throw new NoEsVendedorException('El usuario no es un Vendedor.');
        }
    }

}