import { EstadoPedido } from "../../Domain/EstadoPedido.js";
import { ItemPedido } from "../../Domain/ItemPedido.js";
import { Pedido } from "../../Domain/Pedido.js";
import { Usuario } from "../../Domain/Usuario.js";
import { Producto } from "../../Domain/Producto.js";
import { FactoryNotificacion } from "../../Domain/FactoryNotificacion.js";
import { DireccionEntrega } from "../../Domain/DireccionEntrega.js";
import { TipoUsuario } from "../../Domain/TipoUsuario.js";
import { PedidoService } from "../../Services/PedidoService.js";
import { jest } from "@jest/globals";
import { get } from "mongoose";

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
      crearSegunPedido: jest.fn(),
      crearSegunEstado: jest.fn()
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

  test('deberia poder cancelar un pedido antes que se haya enviado', async () => {
    const producto = { getId: jest.fn().mockReturnValue(102), aumentarStock: jest.fn() };
    const comprador = { id: 1, nombre: 'Juan' };
    const item = { getProductoId: () => 101, getCantidad: jest.fn().mockReturnValue(2) };
    const item2 = new ItemPedido(producto, 2, 500);
    const pedido = { 
      id : 1,
      getItems: () => [item2],
      getEstado: () => EstadoPedido.Pendiente,
      getComprador: jest.fn().mockReturnValue(comprador),
      validarSePuedeCancelar: jest.fn(),
      actualizarEstado: jest.fn(),
    };

  pedidoRepositoryMock.obtenerPedidoPorId = jest.fn().mockResolvedValue(pedido);
  pedidoRepositoryMock.actualizarPedido = jest.fn(); 

  
  productoRepositoryMock.obtenerProductoPorId.mockResolvedValue(producto);
  productoRepositoryMock.actualizarProducto.mockResolvedValue(producto);

  
  factoryNotificacionMock.crearSegunEstado = jest.fn().mockReturnValue({ mensaje: 'El Pedido ha sido cancelado' });
  servicioNotificacionMock.enviarNotificacion = jest.fn();

  await pedidoService.cancelarPedido(1, comprador);

  expect(pedido.validarSePuedeCancelar).toHaveBeenCalled();
  expect(pedidoRepositoryMock.actualizarPedido).toHaveBeenCalledWith(pedido);
  expect(producto.aumentarStock).toHaveBeenCalledWith(2);
  expect(productoRepositoryMock.actualizarProducto).toHaveBeenCalledWith(producto);
  expect(factoryNotificacionMock.crearSegunPedido).toHaveBeenCalledWith(pedido);
  expect(servicioNotificacionMock.enviarNotificacion).toHaveBeenCalled();
  });

  test(`deberia devolver el historial de pedidos de un usuario`, async () => {
    const usuarioId = 1;

    const pedidos = [
      { id: 1, compradorId: usuarioId, estado: EstadoPedido.Entregado },
      { id: 2, compradorId: usuarioId, estado: EstadoPedido.Cancelado }
    ];
    pedidoRepositoryMock.obtenerPedidosPorUsuarioId = jest.fn().mockResolvedValue(pedidos);

    const historial = await pedidoService.obtenerHistorialPedidos(usuarioId);
  
    expect(pedidoRepositoryMock.obtenerPedidosPorUsuarioId).toHaveBeenCalledWith(usuarioId);
    expect(historial).toEqual(pedidos);
  });

  test('deberia marcar un pedido como enviado y notificar al comprador', async () => {

    const vendedor = { id:2 , nombre: 'Maria', tipo: TipoUsuario.Vendedor };
    const item = { getProductoId: () => 101, getCantidad: () => 2 };
    const comprador = { id: 1, nombre: 'Juan' };
    const pedido = { 
      id : 1,
      getItems: () => [item],
      getEstado: () => EstadoPedido.Pendiente,
      getComprador: () => comprador,
      validarSePuedeCancelar: jest.fn(),
      actualizarEstado: jest.fn(),
    };

    pedidoRepositoryMock.obtenerPedidoPorId = jest.fn().mockResolvedValue(pedido);
    pedidoRepositoryMock.actualizarPedido = jest.fn();
    factoryNotificacionMock.crearSegunEstado = jest.fn().mockReturnValue({ mensaje: 'El Pedido ha sido enviado' });
    servicioNotificacionMock.enviarNotificacion = jest.fn();

    await pedidoService.marcarPedidoEnviado(1, vendedor);

    expect(pedido.actualizarEstado).toHaveBeenCalledWith(EstadoPedido.Enviado, comprador, "Pedido enviado");
    expect(pedidoRepositoryMock.actualizarPedido).toHaveBeenCalledWith(pedido);
    expect(factoryNotificacionMock.crearSegunPedido).toHaveBeenCalledWith(pedido);
    expect(servicioNotificacionMock.enviarNotificacion).toHaveBeenCalled();
});

  
});