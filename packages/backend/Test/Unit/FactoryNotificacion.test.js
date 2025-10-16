import { Notificacion } from '../../Domain/Notificacion.js';
import { NotificacionService } from '../../Services/NotificacionService.js';
import { Pedido } from '../../Domain/Pedido.js';
import { Usuario } from '../../Domain/Usuario.js';
import { Producto } from '../../Domain/Producto.js';
import { ItemPedido } from '../../Domain/ItemPedido.js';
import { DireccionEntrega } from '../../Domain/DireccionEntrega.js';
import { Moneda } from '../../Domain/Moneda.js';
import { FactoryNotificacion } from '../../Domain/FactoryNotificacion.js';

const factoryNotificacion = new FactoryNotificacion();

describe('FactoryNotificacion.crearSegunEstado', () => {
    test('debería crear notificación para estado Cancelado', () => {
        let mensaje = factoryNotificacion.crearSegunEstado('CANCELADO');
        expect(mensaje).toBe('El pedido ha sido cancelado.');
    });

    test('debería crear notificación para estado Enviado', () => {
        let mensaje = factoryNotificacion.crearSegunEstado('ENVIADO');
        expect(mensaje).toBe('El pedido ha sido enviado.');
    });

    test('debería crear notificación para estado Entregado', () => {
        let mensaje = factoryNotificacion.crearSegunEstado('ENTREGADO');
        expect(mensaje).toBe('El pedido ha sido entregado.');
    });

    test('debería crear notificación para estado Pendiente', () => {
        let mensaje = factoryNotificacion.crearSegunEstado('PENDIENTE');
        expect(mensaje).toBe('El pedido ha sido creado.');
    });

    test('debería crear notificación para estado En_Preparacion', () => {
        let mensaje = factoryNotificacion.crearSegunEstado('EN_PREPARACION');
        expect(mensaje).toBe('El pedido está en preparación.');
    });

    test('debería crear notificación para estado Confirmado', () => {
        let mensaje = factoryNotificacion.crearSegunEstado('CONFIRMADO');
        expect(mensaje).toBe('El pedido ha sido confirmado.');
    });

    test('debería lanzar error para estado no reconocido', () => {
        expect(() => {
            factoryNotificacion.crearSegunEstado('Invalido');
        }).toThrow('Estado no reconocido');
    });
});

describe('FactoryNotificacion.crearSegunPedido', () => {
    const monedaArgentina = Moneda.Peso;
    const fechaActual = new Date().toISOString().split("T")[0];
    const usuario1 = new Usuario("Juan", "juan@email.com", 123456789, "COMPRADOR", fechaActual);
    const producto1 = new Producto(usuario1, "Pastas de diente", "Es de muy buena calidad", ["categoria"], 200, monedaArgentina, 1234566, true);
    const item1 = new ItemPedido(producto1, 2, 15.99);
    const direccion1 = new DireccionEntrega("Av. Siempre Viva", 742, 1, "A", "1234", "Ciudad Autonoma de Buenos Aires", "Buenos Aires", "Argentina", -34.6037, -34.6037);

    const pedido = new Pedido(usuario1, [item1], monedaArgentina, direccion1);

    test('debería crear notificación para pedido Nuevo', () => {
        let notificacion = factoryNotificacion.crearSegunPedido(pedido);
        expect(notificacion.mensaje).toBe('Nuevo pedido de Juan, sobre los productos Pastas de diente. Total: 31.98 ARS.');
    });

    test('debería crear notificación para pedido Cancelado', () => {
        pedido.setEstado('CANCELADO');
        let notificacion = factoryNotificacion.crearSegunPedido(pedido);
        expect(notificacion.mensaje).toBe('El pedido ha sido cancelado.');
    });

    test('debería crear notificación para pedido Enviado', () => {
        pedido.setEstado('ENVIADO');
        let notificacion = factoryNotificacion.crearSegunPedido(pedido);
        expect(notificacion.mensaje).toBe('El pedido ha sido enviado.');
    });
});
