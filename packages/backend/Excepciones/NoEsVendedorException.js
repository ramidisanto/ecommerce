export class NoEsVendedorException extends Error {
    constructor(message) {
        super(message);
        this.name = "NoEsVendedorException";
    }
}