import { DailyClosure } from "../entities/DailyClosure";

export interface IDailyClosureRepository {
  create(closure: DailyClosure): Promise<void>;
  getAll(): Promise<DailyClosure[]>;
  getByDate(fecha: string): Promise<DailyClosure | null>;
  getByDateRange(
    fechaInicio: string,
    fechaFin: string,
  ): Promise<DailyClosure[]>;
  existsForDate(fecha: string): Promise<boolean>;
}
