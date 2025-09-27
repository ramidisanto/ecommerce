export class NoExisteException extends Error {
    constructor(id, entidad) {
        super();
        this.message = entidad + ' con id ' + id + ' no existe';
        this.name = "NoExisteException";
    }
}