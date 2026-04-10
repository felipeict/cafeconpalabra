import type { IDailyClosureRepository } from "../../domain/repositories/IDailyClosureRepository";
import { DailyClosure } from "../../domain/entities/DailyClosure";
import type { GoogleSheetsClient } from "../config/GoogleSheetsClient";

export class GoogleSheetsDailyClosureRepository implements IDailyClosureRepository {
  private readonly SHEET_NAME = "CierresDiarios";

  constructor(private sheetsClient: GoogleSheetsClient) {}

  async create(closure: DailyClosure): Promise<void> {
    const values = [
      closure.id,
      closure.fecha,
      closure.totalEfectivo,
      closure.totalTransferencias,
      closure.totalGeneral,
      closure.cantidadOrdenes,
      closure.responsable,
      closure.responsableId,
      closure.horaCierre,
      closure.notas || "",
    ];

    await this.sheetsClient.appendRow(`${this.SHEET_NAME}!A2`, values);
  }

  async getAll(): Promise<DailyClosure[]> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:J`);
    return this.parseRows(rows);
  }

  async getByDate(fecha: string): Promise<DailyClosure | null> {
    const all = await this.getAll();
    return all.find((closure) => closure.fecha === fecha) || null;
  }

  async getByDateRange(
    fechaInicio: string,
    fechaFin: string,
  ): Promise<DailyClosure[]> {
    const all = await this.getAll();
    return all.filter(
      (closure) => closure.fecha >= fechaInicio && closure.fecha <= fechaFin,
    );
  }

  async existsForDate(fecha: string): Promise<boolean> {
    const closure = await this.getByDate(fecha);
    return closure !== null;
  }

  private parseRows(rows: any[][]): DailyClosure[] {
    return rows.map(
      (row) =>
        new DailyClosure(
          row[0], // id
          row[1], // fecha
          parseFloat(row[2]), // totalEfectivo
          parseFloat(row[3]), // totalTransferencias
          parseInt(row[5]), // cantidadOrdenes
          row[6], // responsable
          row[7], // responsableId
          row[8], // horaCierre
          row[9] || undefined, // notas
        ),
    );
  }
}
