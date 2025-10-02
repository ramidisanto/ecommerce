import { NoExisteIdException } from "../Excepciones/NoExisteIdException.js";
import { NoEsVendedorException } from "../Excepciones/NoEsVendedorException.js";

export function productoErrorHandler(err, _req, res, _next) {
  console.log(err.message);

  if (err.constructor.name == NoExisteIdException.name) {
    res.status(404).json({ id: err.id, message: err.message });
    return;
  }

  if (err.constructor.name == NoEsVendedorException.name) {
    res.status(403).json({ id: err.id, message: err.message });
    return;
  }

  res.status(500).json({ error: "Ups. Algo sucedio en el servidor." });
  

}