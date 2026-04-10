import type { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import type { IMenuItemRepository } from "../../domain/repositories/IMenuItemRepository";
import { Order, OrderItem } from "../../domain/entities/Order";

export interface CreateOrderInput {
  garzonId: string;
  garzonNombre: string;
  numeroMesa: string;
  items: OrderItem[];
  notas?: string;
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private menuItemRepository: IMenuItemRepository,
  ) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    // Validaciones
    if (!input.numeroMesa || input.numeroMesa.trim() === "") {
      throw new Error("El número de mesa es requerido");
    }

    if (!input.items || input.items.length === 0) {
      throw new Error("El pedido debe tener al menos un item");
    }

    // Validar que todos los items tengan cantidad > 0
    const invalidItems = input.items.filter((item) => item.cantidad <= 0);
    if (invalidItems.length > 0) {
      throw new Error("Todos los items deben tener cantidad mayor a 0");
    }

    // Crear la orden
    const order = Order.create(
      input.garzonId,
      input.garzonNombre,
      input.numeroMesa,
      input.items,
      input.notas,
    );

    // Guardar en el repositorio
    await this.orderRepository.create(order);

    // Descontar inventario para items que lo tengan
    for (const item of input.items) {
      try {
        await this.menuItemRepository.decreaseInventory(
          item.menuItemId,
          item.cantidad,
        );
      } catch (error) {
        // Log error pero no fallar la orden si el descuento falla
        console.warn(
          `No se pudo descontar inventario para item ${item.menuItemId}:`,
          error,
        );
      }
    }

    return order;
  }
}
