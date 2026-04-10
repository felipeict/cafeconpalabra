import type { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import type { IDailyClosureRepository } from "../../domain/repositories/IDailyClosureRepository";
import type { Order } from "../../domain/entities/Order";
import type { DailyClosure } from "../../domain/entities/DailyClosure";

export interface DailySummary {
  fecha: string;
  ordenesPendientes: Order[];
  ordenesEntregadas: Order[];
  ordenesCanceladas: Order[];
  totalOrdenes: number;
  cierre?: DailyClosure;
  tieneCierre: boolean;
}

export class GetDailySummaryUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private dailyClosureRepository: IDailyClosureRepository,
  ) {}

  async execute(fecha?: string): Promise<DailySummary> {
    const targetDate = fecha || new Date().toISOString().split("T")[0];

    // Obtener todas las órdenes del día
    const orders = await this.orderRepository.getByDate(targetDate);

    // Clasificar órdenes por estado
    const ordenesPendientes = orders.filter((o) => o.estado === "pendiente");
    const ordenesEntregadas = orders.filter((o) => o.estado === "entregado");
    const ordenesCanceladas = orders.filter((o) => o.estado === "cancelado");

    // Obtener cierre del día (si existe)
    const cierre = await this.dailyClosureRepository.getByDate(targetDate);

    return {
      fecha: targetDate,
      ordenesPendientes,
      ordenesEntregadas,
      ordenesCanceladas,
      totalOrdenes: orders.length,
      cierre: cierre || undefined,
      tieneCierre: cierre !== null,
    };
  }
}
