// importamos los Excepciones/error que tengamos
import { NoExisteIdException } from "../Excepciones/NoExisteIdException.js";

export function notificacionErrorHandler(err, _req, res, _next) {
    console.log(err.message);

    if (err.constructor.name == NoExisteIdException.name) {
        res.status(404).json({ id: err.id, message: err.message });
        return;
    }

    res.status(500).json({ error: "Ups. Algo sucedio en el servidor." });
}