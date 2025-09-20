// importamos los Excepciones/error que tengamos

export function pedidoErrorHandler(err, _req, res, _next) {
  console.log(err.message);

  /*if (err.constructor.name == PedidoDoesNotExist.name) {
    res.status(404).json({ id: err.id, message: err.message });
    return;
  } */ // a modo de ejemplo dsp vemos que errores van en el pedido

 // agregar aca todos los errores vinculados con las pedidoes

  res.status(500).json({ error: "Ups. Algo sucedio en el servidor." });
}