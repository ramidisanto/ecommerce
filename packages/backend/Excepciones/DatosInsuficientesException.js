export class DatosInsuficientesException extends Error {
    constructor(message) {
        super(message);
        this.name = "DatosInsuficientesException";
    }
}