export class NoSePuedeCambiarDeEstadoException extends Error {
    constructor(message) {
        super(message);
        this.name = "NoSePuedeCambiarDeEstadoException";
    }       
} 