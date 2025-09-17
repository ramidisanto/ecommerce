import { UsuarioRepository } from "../Repositories/UsuarioRepository.js";
import { ProductoRepository } from "../Repositories/ProductoRepository.js";
import { PedidoRepository } from "../Repositories/PedidoRepository.js";
import { NotificacionRepository } from "../Repositories/NotificacionRepository.js";
import { NotificacionService } from "../Services/NotificacionService.js";
import { NotificacionController } from "../Controllers/NotificacionController.js";

const DB_NAME = "tiendaSol";

export const buildAppContext = (DB_CLIENT) => {

    const db = DB_CLIENT.db(DB_NAME);
    const notificacionRepository = new NotificacionRepository(db);
    const notificacionService = new NotificacionService(notificacionRepository);
    const notificacionController = new NotificacionController(notificacionService);


    return {
        notificacionRepository,
        notificacionService,
        notificacionController
    };
};

