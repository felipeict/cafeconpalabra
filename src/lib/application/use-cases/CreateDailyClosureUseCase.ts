import type { IDailyClosureRepository } from "../../domain/repositories/IDailyClosureRepository";
import type { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import { DailyClosure } from "../../domain/entities/DailyClosure";

export interface CreateClosureInput {
  fecha: string;
  totalEfectivo: number;
  totalTransferencias: number;
  responsable: string;
  responsableId: string;
  notas?: string;
}

export class CreateDailyClosureUseCase {
  constructor(
    private dailyClosureRepository: IDailyClosureRepository,
    private orderRepository: IOrderRepository,
  ) {}

  async execute(input: CreateClosureInput): Promise<DailyClosure> {
    // Validaciones
    if (input.totalEfectivo < 0 || input.totalTransferencias < 0) {
      throw new Error("Los montos no pueden ser negativos");
    }

    // Verificar si ya existe un cierre para esta fecha
    const existingClosure = await this.dailyClosureRepository.existsForDate(
      input.fecha,
    );
    if (existingClosure) {
      throw new Error("Ya existe un cierre para esta fecha");
    }

    // Obtener la cantidad de órdenes del día
    const orders = await this.orderRepository.getByDate(input.fecha);
    const cantidadOrdenes = orders.filter(
      (o) => o.estado !== "cancelado",
    ).length;

    // Crear el cierre
    const closure = DailyClosure.create(
      input.fecha,
      input.totalEfectivo,
      input.totalTransferencias,
      cantidadOrdenes,
      input.responsable,
      input.responsableId,
      input.notas,
    );

    // Guardar en el repositorio
    await this.dailyClosureRepository.create(closure);

    return closure;
  }
}
