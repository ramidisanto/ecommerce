import { Estado } from "./Estado.js";

export class EstadoEntregado extends Estado {
    constructor() {
        super("El pedido ha sido entregado.");
    }
}