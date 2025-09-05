// Estado.js
export class Estado {
    constructor(mensaje) {
        this.mensaje = mensaje;
    }

    emitirMensajeEstadoPedido() {
        return this.mensaje;
    }
}