export class PedidoRepository {
    pedidos = [];

    save(pedido) {
        this.pedidos.push(pedido);
    }

    

}