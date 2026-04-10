import type { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import type { Order } from "../../domain/entities/Order";

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(
    orderId: string,
    estado:
      | "pendiente"
      | "en-preparacion"
      | "listo"
      | "entregado"
      | "cancelado",
  ): Promise<void> {
    if (!orderId) {
      throw new Error("El ID del pedido es requerido");
    }

    // Validar que el estado sea válido
    const validStates = [
      "pendiente",
      "en-preparacion",
      "listo",
      "entregado",
      "cancelado",
    ];
    if (!validStates.includes(estado)) {
      throw new Error("Estado inválido");
    }

    // Verificar que el pedido existe
    const order = await this.orderRepository.getById(orderId);
    if (!order) {
      throw new Error("Pedido no encontrado");
    }

    // Actualizar el estado
    await this.orderRepository.updateStatus(orderId, estado);
  }
}
