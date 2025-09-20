export class NoExisteException extends Error {
    constructor(id, entidad) {
        super();
        this.mensaje = entidad + ' con id ' + id + ' no existe';
    }
}