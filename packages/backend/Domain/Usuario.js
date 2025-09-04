export class Usuario{
    id;
    nombre;
    email;
    telefono;
    tipo;
    fechaAlta;
    notificaciones;


    constructor({ nombre, email, telefono, tipo, fechaAlta }) {
        this.nombre = nombre
        this.email = email
        this.telefono = telefono
        this.tipo = tipo
        this.fechaAlta = fechaAlta
        this.notificaciones = [];
    }

    agregarNotificacion(notificacion) {
        this.notificaciones.push(notificacion);
    }

    getNotificaciones() {   
        return this.notificaciones;
    }  

}