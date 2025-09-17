import "dotenv/config";
import express from "express";
import cors from "cors";
import {startServer} from "./App/server.js";
import {buildAppContext} from "./App/context.js";
import { Usuario } from "./Domain/Usuario.js";
import { ItemPedido } from "./Domain/ItemPedido.js";
import { Pedido } from "./Domain/Pedido.js";
import { CambioEstadoPedido } from "./Domain/CambioEstadoPedido.js";
import { EstadoPedido } from "./Domain/EstadoPedido.js";
import { DireccionEntrega } from "./Domain/DireccionEntrega.js";
import { Producto } from "./Domain/Producto.js";
import { Moneda } from "./Domain/Moneda.js";

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);
const appContext = buildAppContext()

startServer(app, process.env.SERVER_PORT , appContext);


//PRUEBAS DE CONSTRUCCION DE OBJETOS
const monedaArgentina = Moneda.Peso

const fechaActual = new Date().toISOString().split("T")[0];

const usuario1 = new Usuario("Juan", "juan@email.com", 123456789, "COMPRADOR", fechaActual);

const producto1 = new Producto(usuario1, "Pastas de diente", "Es de muy buena calidad", ["categoria"], 200, monedaArgentina , 1234566, true)

const item1 = new ItemPedido( producto1, 2,  15.99);
const direccion1 = new DireccionEntrega( "Av. Siempre Viva", 742, 1,  "A", "1234", "Ciudad Autonoma de Buenos Aires", "Buenos Aires", "Argentina", -34.6037, -34.6037,);

const pedidoPrueba = new Pedido(usuario1, [item1], monedaArgentina , direccion1);
pedidoPrueba.notificar();

//console.log("Comprador de prueba:", usuario1);
//console.log("Item de prueba 1:", item1);
//console.log("Direccion de entrega de prueba:", direccion1);
//console.log("Pedido de prueba:", pedidoPrueba);

pedidoPrueba.actualizarEstado(EstadoPedido.Confirmado, pedidoPrueba.getComprador(), "Probando");
pedidoPrueba.notificar();


console.log("Pedido de prueba:", pedidoPrueba);
console.log("Historial de estados del pedido de prueba:", pedidoPrueba.getHistorialEstados());

