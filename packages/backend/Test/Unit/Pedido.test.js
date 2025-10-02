import { Pedido } from '../../Domain/Pedido.js';
import { Producto } from '../../Domain/Producto.js';

describe('Pedido.crear', () => {
    test('debería crear una instancia de Pedido con los atributos correctos', () => {
        const datos = {
            id: 1,
            clienteId: 123,
            total: 250.75,
            fecha: '2024-06-15',
            estado: 'pendiente'
        };
        const pedido = Pedido.crear(datos);     //DEBE SER DE PEDIDO SERVICE

        expect(pedido).toBeInstanceOf(Pedido);
        expect(pedido.id).toBe(datos.id);
        expect(pedido.clienteId).toBe(datos.clienteId);
        expect(pedido.total).toBe(datos.total);
        expect(pedido.fecha).toBe(datos.fecha);
        expect(pedido.estado).toBe(datos.estado);
    });
    test('debería manejar valores por defecto si faltan algunos atributos', () => {
        const datos = {
            clienteId: 123,
            total: 250.75
        };
        const pedido = Pedido.crear(datos);

        expect(pedido).toBeInstanceOf(Pedido);
        expect(pedido.id).toBeUndefined();
        expect(pedido.clienteId).toBe(datos.clienteId);
        expect(pedido.total).toBe(datos.total);
        expect(pedido.fecha).toBeUndefined();
        expect(pedido.estado).toBeUndefined();
    });

    beforeEach(async () => {
        await Producto.crear({ titulo: 'Producto de limpieza', cantidad: 10, precio: 15.00});
        await Producto.crear({ titulo: 'Producto de cocina', cantidad: 5, precio: 30.00});
    });


    test('debería restar stock de los productos al crear un pedido', () => {
        const datos = {
            id: 1,
            clienteId: 123,
            total: 250.75,
            fecha: '2024-06-15',
            estado: 'pendiente',
            productos: [
                { productoId: 1, cantidad: 2 },
                { productoId: 2, cantidad: 1 }
            ]
        };  
        const pedido = Pedido.crear(datos);
        expect(pedido).toBeInstanceOf(Pedido);
        expect(pedido.productos[0].cantidad).toBe(2);
        expect(pedido.productos[1].cantidad).toBe(1);
        expect(Producto.findById(1).cantidad).toBe(8); // Stock inicial 10 - 2 vendidos
        expect(Producto.findById(2).cantidad).toBe(4); // Stock inicial 5 - 1 vendido
    
    });
});

