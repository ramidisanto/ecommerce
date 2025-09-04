import "dotenv/config";
import express from "express";
import cors from "cors";
import {startServer} from "./App/server.js";
import {buildAppContext} from "./App/context.js";

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
