export class CambioEstadoPedido{
    fecha;
    estado;
    usuario;
    motivo;

    constructor(estado, usuario, motivo){
        this.fecha = new Date().toISOString().split("T")[0];
        this.estado = estado;
        this.usuario = usuario;
        this.motivo = motivo;
    }

    getEstado(){
        return this.estado;
    }
}