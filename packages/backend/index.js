import "dotenv/config";
import dotenv from "dotenv"
import express from "express"
import { Server } from "./server.js"
import routes from "./Routes/routes.js"
import cors from "cors";

import { NotificacionController } from "./Controllers/NotificacionController.js"
import { NotificacionService } from "./Services/NotificacionService.js"
import { NotificacionRepository } from "./Repositories/NotificacionRepository.js"
import { MongoDBClient } from "./Config/database.js";
import { UsuarioRepository } from "./Repositories/UsuarioRepository.js";
import { UsuarioService } from "./Services/UsuarioService.js";
import { PedidoController } from "./Controllers/PedidoController.js"
import { PedidoService } from "./Services/PedidoService.js"
import { PedidoRepository } from "./Repositories/PedidoRepository.js"
import { factoryNotificacion } from "./Domain/FactoryNotificacion.js";
import { ProductoController } from "./Controllers/ProductoController.js"
import { ProductoService } from "./Services/ProductoService.js"
import { ProductoRepository } from "./Repositories/ProductoRepository.js"

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

const port = process.env.PORT 
dotenv.config();

// Se envía al server el puerto
const server = new Server(app, port)

const usuarioRepository = new UsuarioRepository()
const usuarioService = new UsuarioService(usuarioRepository)

const notificacionRepository = new NotificacionRepository()
const notificacionService = new NotificacionService(notificacionRepository)
const notificacionController = new NotificacionController(notificacionService, usuarioService)

const productoRepository = new ProductoRepository()
const productoService = new ProductoService(productoRepository, usuarioRepository)
const productoController = new ProductoController(productoService)


const pedidoRepository = new PedidoRepository()
const pedidoService = new PedidoService(pedidoRepository, usuarioRepository, productoRepository, notificacionService, factoryNotificacion)
const pedidoController = new PedidoController(pedidoService, notificacionService, usuarioService)






server.setController(NotificacionController, notificacionController)
server.setController(PedidoController, pedidoController)
server.setController(ProductoController, productoController)

routes.forEach(route => server.addRoute(route))
server.configureRoutes();
server.launch()

  app.get('/healthCheck', (req, res) => {
    res.status(200).json({mensaje:'Todo marcha bien!'})
  })

  app.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
  });

MongoDBClient.connect();