export class CambioEstadoPedido{
    fecha;
    estado;
    usuario;
    motivo;

    constructor(fecha, estado, usuario, motivo){
        this.fecha = fecha;
        this.estado = estado;
        this.usuario = usuario;
        this.motivo = motivo;
    }

    getEstado(){
        return this.estado;
    }
}