export class StockInsuficiente extends Error{
    constructor(mensaje){
        super(`Stock insuficiente: ${mensaje}`)
    }
}