import { EstadoPedido } from "../../Domain/EstadoPedido.js";
import { ItemPedido } from "../../Domain/ItemPedido.js";
import { Pedido } from "../../Domain/Pedido.js";
import { Usuario } from "../../Domain/Usuario.js";
import { Producto } from "../../Domain/Producto.js";
import { FactoryNotificacion } from "../../Domain/FactoryNotificacion.js";
import { DireccionEntrega } from "../../Domain/DireccionEntrega.js";
import { PedidoService } from "../../Services/PedidoService.js";
import { jest } from "@jest/globals";

describe('PedidoService', () => {
  let pedidoRepositoryMock;
  let usuarioRepositoryMock;
  let productoRepositoryMock;
  let servicioNotificacionMock;
  let factoryNotificacionMock;
  let pedidoService;

  beforeEach(() => {
    pedidoRepositoryMock = {
      crearPedido: jest.fn()
    };
    usuarioRepositoryMock = {};
    productoRepositoryMock = {
      obtenerProductoPorId: jest.fn(),
      actualizarProducto: jest.fn()
    };
    servicioNotificacionMock = {
      enviarNotificacion: jest.fn()
    };
    factoryNotificacionMock = {
      crearSegunPedido: jest.fn()
    };

    pedidoService = new PedidoService(
      pedidoRepositoryMock,
      usuarioRepositoryMock,
      productoRepositoryMock,
      servicioNotificacionMock,
      factoryNotificacionMock
    );
  });

  test('deberia crear un pedido correctamente y enviar notificacion', async () => {
    // Arrange
    const comprador = { id: 1, nombre: 'Juan' };
    const direccionEntrega = { calle: 'Av. Siempreviva 123' };
    const moneda = 'ARS';

    // item como objeto plano (coincide con la implementacion que usa item.productoId)
    const item = { productoId: 101, cantidad: 2, precioUnitario: 500 };
    const items = [item];

    // Producto simulado (devuelto por productoRepository)
    const producto = {
      validarDisponible: jest.fn(),
      reducirStock: jest.fn(),
      getId: jest.fn().mockReturnValue(101),
      getStock: jest.fn().mockReturnValue(10)
    };


    productoRepositoryMock.obtenerProductoPorId.mockResolvedValue(producto);
    pedidoRepositoryMock.crearPedido.mockResolvedValue({ comprador, items, moneda, direccionEntrega });
    factoryNotificacionMock.crearSegunPedido.mockReturnValue({ mensaje: 'Pedido creado' });

    const nuevoPedido = await pedidoService.crearPedido(comprador, items, moneda, direccionEntrega);

    expect(productoRepositoryMock.obtenerProductoPorId).toHaveBeenCalledWith(101);
    expect(producto.validarDisponible).toHaveBeenCalledWith(2);
    expect(pedidoRepositoryMock.crearPedido).toHaveBeenCalled();
    expect(producto.reducirStock).toHaveBeenCalledWith(2);
    expect(productoRepositoryMock.actualizarProducto).toHaveBeenCalledWith(producto);
    expect(factoryNotificacionMock.crearSegunPedido).toHaveBeenCalled();
    expect(servicioNotificacionMock.enviarNotificacion).toHaveBeenCalled();
    expect(nuevoPedido).toEqual({ comprador, items, moneda, direccionEntrega });
  });
});