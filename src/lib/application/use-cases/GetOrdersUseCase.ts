import type { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import type { Order } from "../../domain/entities/Order";

export class GetOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(fecha?: string): Promise<Order[]> {
    if (fecha) {
      return await this.orderRepository.getByDate(fecha);
    }

    return await this.orderRepository.getAll();
  }

  async getPendingOrders(): Promise<Order[]> {
    return await this.orderRepository.getPendingOrders();
  }

  async getTodayOrders(): Promise<Order[]> {
    const today = new Date().toISOString().split("T")[0];
    return await this.orderRepository.getByDate(today);
  }
}
