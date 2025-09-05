import { Estado } from "./Estado.js";

export class EstadoConfirmado extends Estado {
    constructor() {
        super("El pedido ha sido confirmado.");
    }
}