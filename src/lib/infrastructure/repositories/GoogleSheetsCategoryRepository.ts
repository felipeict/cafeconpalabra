import type { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { Category } from "../../domain/entities/Category";
import type { GoogleSheetsClient } from "../config/GoogleSheetsClient";

export class GoogleSheetsCategoryRepository implements ICategoryRepository {
  private readonly SHEET_NAME = "Categorias";

  constructor(private sheetsClient: GoogleSheetsClient) {}

  async getAll(): Promise<Category[]> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:D`);
    return this.parseRows(rows);
  }

  async getActive(): Promise<Category[]> {
    const all = await this.getAll();
    return all.filter((category) => category.activa);
  }

  async getById(id: string): Promise<Category | null> {
    const all = await this.getAll();
    return all.find((category) => category.id === id) || null;
  }

  private parseRows(rows: any[][]): Category[] {
    return rows.map(
      (row) =>
        new Category(
          row[0], // id
          row[1], // nombre
          parseInt(row[2]) || 0, // orden
          row[3] === "TRUE" || row[3] === true, // activa
        ),
    );
  }
}
