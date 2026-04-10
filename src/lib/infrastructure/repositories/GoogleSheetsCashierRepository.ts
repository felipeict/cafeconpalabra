import type { ICashierRepository } from "../../domain/repositories/ICashierRepository";
import { Cashier } from "../../domain/entities/Cashier";
import type { GoogleSheetsClient } from "../config/GoogleSheetsClient";

export class GoogleSheetsCashierRepository implements ICashierRepository {
  private readonly SHEET_NAME = "Cajeros";

  constructor(private sheetsClient: GoogleSheetsClient) {}

  async findByUsername(username: string): Promise<Cashier | null> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:D`);

    const cashierRow = rows.find((row) => row[2] === username);

    if (!cashierRow) {
      return null;
    }

    return new Cashier(
      cashierRow[0], // id
      cashierRow[1], // nombre
      cashierRow[2], // usuario
      cashierRow[3], // password
    );
  }

  async getAll(): Promise<Cashier[]> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:D`);

    return rows.map(
      (row) =>
        new Cashier(
          row[0], // id
          row[1], // nombre
          row[2], // usuario
        ),
    );
  }
}
