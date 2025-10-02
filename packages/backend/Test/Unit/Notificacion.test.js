import {Notificacion} from '../../Domain/Notificacion.js';
import {NotificacionService} from '../../Services/NotificacionService.js';
import {Pedido} from '../../Domain/Pedido.js';

describe('FactoryNotificacion.crearSegunEstado', () => {
    test('debería crear notificación para estado Cancelado', () => {
        const mensaje = this.factoryNotificacion.crearSegunEstado('Cancelado');
        expect(mensaje).toBe('El pedido ha sido cancelado.');
    });
    test('debería crear notificación para estado Enviado', () => {
        const mensaje = this.factoryNotificacion.crearSegunEstado('Enviado');
        expect(mensaje).toBe('El pedido ha sido enviado.');
    }); 
    test('debería crear notificación para estado Entregado', () => {
        const mensaje = this.factoryNotificacion.crearSegunEstado('Entregado');
        expect(mensaje).toBe('El pedido ha sido entregado.');
    });
    test('debería crear notificación para estado Pendiente', () => {
        const mensaje = this.factoryNotificacion.crearSegunEstado('Pendiente');
        expect(mensaje).toBe('El pedido ha sido creado.');
    }); 
    test('debería crear notificación para estado En_Preparacion', () => {
        const mensaje = this.factoryNotificacion.crearSegunEstado('En_Preparacion');
        expect(mensaje).toBe('El pedido está en preparación.');
    });
    test('debería crear notificación para estado Confirmado', () => {
        const mensaje = this.factoryNotificacion.crearSegunEstado('Confirmado');
        expect(mensaje).toBe('El pedido ha sido confirmado.');
    });
    test('debería lanzar error para estado no reconocido', () => {
        expect(() => {
            this.factoryNotificacion.crearSegunEstado('Invalido');
        }).toThrow('Estado no reconocido');
    }); 
});

describe('FactoryNotificacion.crearSegunPedido', () => {
    const datos = {
                id: 1,
                clienteId: 123,
                total: 250.75,
                fecha: '2024-06-15',
                estado: 'pendiente'
            };
    const pedido = Pedido.crear(datos);

    test('debería crear notificación para pedido Nuevo', () => {
        const mensaje = this.factoryNotificacion.crearSegunPedido(pedido);
        expect(mensaje).toBe('El pedido ha sido creado.');
    }
    );
    test('debería crear notificación para pedido Cancelado', () => {
        pedido.setEstado('Cancelado');
        const mensaje = this.factoryNotificacion.crearSegunPedido(pedido);
        expect(mensaje).toBe('El pedido ha sido cancelado.');
    });
    test('debería crear notificación para pedido Enviado', () => {
        pedido.setEstado('Enviado');
        const mensaje = this.factoryNotificacion.crearSegunPedido(pedido);
        expect(mensaje).toBe('El pedido ha sido enviado.');
    }
    );
});

