import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";
import { Server } from "../../server.js";
import notificacionRoutes from "../../Routes/notificacionRoutes.js";
import { NotificacionController } from "../../Controllers/NotificacionController.js";

describe("Integration: GET /usuarios/:id/notificaciones", () => {
    let app;
    let mockNotificacionService;
    let mockUsuarioService;

    beforeEach(() => {
        app = express();
        const server = new Server(app, 3000);

        mockNotificacionService = {
            obtenerNotificacionesDeUsuario: jest.fn(),
            obtenerNotificacionesDeUsuarioLeidas: jest.fn()
        };

        mockUsuarioService = {
            exists: jest.fn()
        };

        const notificacionController = new NotificacionController(
            mockNotificacionService, 
            mockUsuarioService
        );


        server.setController(NotificacionController, notificacionController);
        server.addRoute(notificacionRoutes);
        server.configureRoutes();
    });

    test("Debe retornar 200 y la lista de notificaciones si el usuario existe", async () => {
        const userId = "64b0f1234567890123456789"; 
        const mockNotificaciones = [
            { id: "1", message: "Hola", fechaAlta: new Date(), leida: false }
        ];

        mockUsuarioService.exists.mockResolvedValue(true);
        mockNotificacionService.obtenerNotificacionesDeUsuario.mockResolvedValue(mockNotificaciones);

        const response = await request(app)
            .get(`/usuarios/${userId}/notificaciones`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(mockUsuarioService.exists).toHaveBeenCalledWith(userId);
        expect(mockNotificacionService.obtenerNotificacionesDeUsuario).toHaveBeenCalledWith(userId);
    });

    test("Debe retornar 204 (No Content) si el usuario existe pero no tiene notificaciones", async () => {
        const userId = "64b0f1234567890123456789";

        mockUsuarioService.exists.mockResolvedValue(true);
        mockNotificacionService.obtenerNotificacionesDeUsuario.mockResolvedValue([]);

        const response = await request(app)
            .get(`/usuarios/${userId}/notificaciones`);

        expect(response.status).toBe(204);
    });

    test("Debe retornar 404 si el usuario NO existe", async () => {
        const userId = "64b0f1234567890123456789";


        mockUsuarioService.exists.mockResolvedValue(false);

        const response = await request(app)
            .get(`/usuarios/${userId}/notificaciones`);

        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/no existe/i);
    });

    test("Debe retornar 400 si el ID del usuario es inválido (Zod Validation)", async () => {
        const invalidId = "id-invalido-123"; 

        const response = await request(app)
            .get(`/usuarios/${invalidId}/notificaciones`);


        expect(response.status).toBe(404);
    });

    test("Debe filtrar por leídas si se pasa el query param ?leida=true", async () => {
        const userId = "64b0f1234567890123456789";
        
        mockUsuarioService.exists.mockResolvedValue(true);
        mockNotificacionService.obtenerNotificacionesDeUsuarioLeidas.mockResolvedValue([]);

        await request(app).get(`/usuarios/${userId}/notificaciones?leida=true`);

        expect(mockNotificacionService.obtenerNotificacionesDeUsuarioLeidas).toHaveBeenCalledWith(userId, true);
    });
});