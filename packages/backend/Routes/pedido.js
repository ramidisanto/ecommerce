import express from 'express'; 
import { PedidoController, PedidosController } from '../Controllers/PedidoController.js';
const authMiddleware = require('../Middlewares/authMiddleware.js');

function pedidoRoutes(getController){
    const router = express.Router();

// 1) Creación de un pedido, validando el stock disponible de cada producto
    router.get("/alojamientos/lugares", (req, res, next) =>{
        getController(AlojamientoController).obtenerPaisesYCiudades(req, res, next);
    });

    router.get("/alojamientosPrueba/usuarios", authMiddleware , async (req, res, next) => {
        getController(AlojamientoController).obtenerAlojamientosPorUsuario(req, res, next);
    });
    
    router.get("/alojamientos/:id", (req, res, next) => {
        getController(AlojamientoController).obtenerAlojamientosPorId(req, res, next);
    });     

    router.get("/alojamientos", (req, res, next) => {
        getController(AlojamientoController).buscarAlojamientos(req, res, next);
    });   


    router.delete("/alojamientos/:id", (req, res, next) => {
        const controller = getController(AlojamientoController);
        controller.eliminarAlojamiento(req, res, next);
    });

    router.patch("/alojamientos/:id", (req, res, next) => {
        const controller = getController(AlojamientoController);
        controller.modificarAlojamiento(req, res, next);
    });


// 2) Creación de un pedido, validando el stock disponible de cada producto

    router.post("/pedidos", authMiddleware , async (req, res, next) => {
        const controller = getController(PedidoController);
        controller.crearPedido(req, res, next);
    });

    
    return router;
}

module.exports = { alojamientoRoutes };