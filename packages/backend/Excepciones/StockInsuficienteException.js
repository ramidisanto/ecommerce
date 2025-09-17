export class StockInsuficienteException extends Error {
    constructor(message) {
        super(message);
        this.name = "StockInsuficienteException";
    }
}