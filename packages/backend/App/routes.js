export const configureRoutes = (app, {NotificacionController}) => {

    //RUTAS DE PEDIDOS
    app.post('/pedidos', PedidoController.crearPedido.bind(PedidoController));

    //RUTAS DE NOTIFICACIONES
    
    // GET /usuarios/:id/notificaciones?leida=true|false
    app.get('/usuarios/:id/notificaciones', NotificacionController.obtenerNotificacionesDeUsuario.bind(NotificacionController)); // EL .BIND(NotificacionController) ES PARA QUE EL THIS DENTRO DE LA FUNCION APUNTE AL CONTROLADOR
    app.patch('/notificacion/:id', NotificacionController.marcarNotificacionLeida.bind(NotificacionController));

}
