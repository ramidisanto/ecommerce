import { NotificacionService } from "../../Services/NotificacionService.js";
import { Notificacion } from "../../Domain/Notificacion.js"
import { jest } from "@jest/globals";


describe('NotificacionService', () => {
    const mockRepo = {
        obtenerNotificacionesDeUsuarioLeidas: jest.fn(),
        obtenerNotificacionesDeUsuario: jest.fn(),
        save: jest.fn(),
        findById: jest.fn(),
    };

    const notificacionService = new NotificacionService(mockRepo);

    test('obtener notificaciones leidas de un usuario', async () => {
        const mockNotificaciones = [{ id: 1, leida: true }];
        mockRepo.obtenerNotificacionesDeUsuarioLeidas.mockResolvedValue(mockNotificaciones);

        const result = await notificacionService.obtenerNotificacionesDeUsuarioLeidas(1, true);

        expect(mockRepo.obtenerNotificacionesDeUsuarioLeidas).toHaveBeenCalledWith(1, true);
        expect(result).toEqual(mockNotificaciones);
    });

    test('obtener notificaciones de un usuario', async () => {
        const mockNotificaciones = [{ id: 2, leida: false }];
        mockRepo.obtenerNotificacionesDeUsuario.mockResolvedValue(mockNotificaciones);

        const result = await notificacionService.obtenerNotificacionesDeUsuario(2);

        expect(mockRepo.obtenerNotificacionesDeUsuario).toHaveBeenCalledWith(2);
        expect(result).toEqual(mockNotificaciones);
    });

    test('marcar notificacion como leida', async () => {
        const notificacion = {
            marcarComoLeida: jest.fn(),
        };
        const updatedNotificacion = { id: 3, leida: true };
        mockRepo.save.mockResolvedValue(updatedNotificacion);

        const result = await notificacionService.marcarNotificacionComoLeida(notificacion);

        expect(notificacion.marcarComoLeida).toHaveBeenCalled();
        expect(mockRepo.save).toHaveBeenCalledWith(notificacion);
        expect(result).toEqual(updatedNotificacion);
    });

    test('enviar notificacion', async () => {
        const notificacion = { id: 4, leida: false };
        mockRepo.save.mockResolvedValue(notificacion);

        const result = await notificacionService.enviarNotificacion(notificacion);

        expect(mockRepo.save).toHaveBeenCalledWith(notificacion);
        expect(result).toEqual(notificacion);
    });

    test('findById returns notificacion', async () => {
        const notificacion = { id: 5, leida: false };
        mockRepo.findById.mockResolvedValue(notificacion);

        const result = await notificacionService.findById(5);

        expect(mockRepo.findById).toHaveBeenCalledWith(5);
        expect(result).toEqual(notificacion);
    });
});