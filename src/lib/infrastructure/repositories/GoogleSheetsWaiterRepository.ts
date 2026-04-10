import type { IWaiterRepository } from "../../domain/repositories/IWaiterRepository";
import { Waiter } from "../../domain/entities/Waiter";
import type { GoogleSheetsClient } from "../config/GoogleSheetsClient";

export class GoogleSheetsWaiterRepository implements IWaiterRepository {
  private readonly SHEET_NAME = "Garzones";

  constructor(private sheetsClient: GoogleSheetsClient) {}

  async getAll(): Promise<Waiter[]> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:E`);
    return this.parseRows(rows, true);
  }

  async getActive(): Promise<Waiter[]> {
    const all = await this.getAll();
    return all.filter((waiter) => waiter.activo);
  }

  async getById(id: string): Promise<Waiter | null> {
    const all = await this.getAll();
    return all.find((waiter) => waiter.id === id) || null;
  }

  async getByUsername(usuario: string): Promise<Waiter | null> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:E`);
    const row = rows.find((r) => r[2] === usuario);

    if (!row) {
      return null;
    }

    return new Waiter(
      row[0], // id
      row[1], // nombre
      row[2], // usuario
      row[3] === "TRUE" || row[3] === true, // activo
      row[4], // password
    );
  }

  async authenticate(
    usuario: string,
    password: string,
  ): Promise<Waiter | null> {
    const waiter = await this.getByUsername(usuario);

    if (!waiter) {
      return null;
    }

    if (!waiter.validatePassword(password)) {
      return null;
    }

    return waiter;
  }

  private parseRows(rows: any[][], includePassword: boolean = false): Waiter[] {
    return rows.map(
      (row) =>
        new Waiter(
          row[0], // id
          row[1], // nombre
          row[2], // usuario
          row[3] === "TRUE" || row[3] === true, // activo
          includePassword ? row[4] : undefined, // password
        ),
    );
  }
}
