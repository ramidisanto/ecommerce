export class Notificacion{
    id;
    usuarioDestino;
    mensaje;
    fechaAlta;
    leida;
    fechaLeida;

    constructor(usuarioDestino, mensaje, fechaAlta){
        this.usuarioDestino = usuarioDestino
        this.mensaje = mensaje
        this.fechaAlta = fechaAlta
        this.leida = false
        this.fechaLeida = null
    }

    setMensaje(valor) {
        this.mensaje = valor;
    }
    setUsuarioDestino(valor) {
        this.usuarioDestino = valor;
    }
    getUsuarioDestino() {
        return usuarioDestino;
    }

    marcarComoLeida(){
        this.leida = true
        this.fechaLeida = new Date()
    }
}