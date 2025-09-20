//import { DatosInsuficientesException } from "../Excepciones/DatosInsuficientesException";
// importamos los Excepciones/error que tengamos

export function productoErrorHandler(err, _req, res, _next) {
  console.log(err.message);

  /*if (err.constructor.name == DatosInsuficientesException.name) {
    res.status(404).json({ id: err.id, message: err.message });
    return;
  }*/ // a modo de ejemplo dsp vemos que errores van en el pedido
 // agregar aca todos los errores vinculados con las notificaciones

  res.status(500).json({ error: "Ups. Algo sucedio en el servidor." });
}