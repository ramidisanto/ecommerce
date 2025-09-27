import "dotenv/config";
import dotenv from "dotenv"
import express from "express"
import { Server } from "./server.js"
import routes from "./Routes/routes.js"
import cors from "cors";

import { NotificacionController } from "./Controllers/NotificacionController.js"
import { NotificacionService } from "./Services/NotificacionService.js"
import { NotificacionRepository } from "./Repositories/NotificacionRepository.js"
import { MongoDBClient } from "./config/database.js";

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

const port = process.env.SERVER_PORT 
dotenv.config();

// Se envía al server el puerto
const server = new Server(app, port)

const notificacionRepository = new NotificacionRepository()
const notificacionService = new NotificacionService(notificacionRepository)
const notificacionController = new NotificacionController(notificacionService)

server.setController(NotificacionController, notificacionController)

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