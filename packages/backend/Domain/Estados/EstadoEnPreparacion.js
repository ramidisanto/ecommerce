import { Estado } from "./Estado.js";

export class EstadoEnPreparacion extends Estado {
    constructor() {
        super("El pedido está en preparación.");
    }
}