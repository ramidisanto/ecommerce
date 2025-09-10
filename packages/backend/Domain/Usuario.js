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

}