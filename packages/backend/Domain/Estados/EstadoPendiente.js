import { Estado } from "./Estado.js";

export class EstadoPendiente extends Estado {
    constructor() {
        super("El pedido está pendiente.");
    }
}