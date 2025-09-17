export class CambioEstadoPedido{
    fecha;
    estado;
    pedido;
    usuario;
    motivo;

    constructor(fecha, estado, pedido, usuario, motivo){
        this.fecha = fecha;
        this.estado = estado;
        this.pedido = pedido;
        this.usuario = usuario;
        this.motivo = motivo;
    }

    getEstado(){
        return this.estado;
    }
}