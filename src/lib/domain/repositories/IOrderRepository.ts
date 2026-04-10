import { Order } from "../entities/Order";

export interface IOrderRepository {
  create(order: Order): Promise<void>;
  getAll(): Promise<Order[]>;
  getByDate(fecha: string): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  updateStatus(
    orderId: string,
    estado:
      | "pendiente"
      | "en-preparacion"
      | "listo"
      | "entregado"
      | "cancelado",
  ): Promise<void>;
  getByWaiter(garzonId: string, fecha?: string): Promise<Order[]>;
  getPendingOrders(): Promise<Order[]>;
}
