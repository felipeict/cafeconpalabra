import type { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";
import type { GoogleSheetsClient } from "../config/GoogleSheetsClient";

export class GoogleSheetsProductRepository implements IProductRepository {
  private readonly SHEET_NAME = "Productos";

  constructor(private sheetsClient: GoogleSheetsClient) {}

  async getAll(): Promise<Product[]> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:F`);

    return rows.map(
      (row) =>
        new Product(
          row[0], // id
          row[1], // nombre
          row[2], // categoria
          parseFloat(row[3]), // precio
          parseInt(row[4]), // stock
          parseInt(row[5]), // stock_minimo
        ),
    );
  }

  async getById(id: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find((p) => p.id === id) || null;
  }

  async getByCategory(category: string): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter((p) => p.categoria === category);
  }

  async updateStock(id: string, newStock: number): Promise<void> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:F`);
    const rowIndex = rows.findIndex((row) => row[0] === id);

    if (rowIndex === -1) {
      throw new Error(`Producto ${id} no encontrado`);
    }

    // Row index + 2 porque: +1 por el header, +1 por zero-based index
    const cellRange = `${this.SHEET_NAME}!E${rowIndex + 2}`;
    await this.sheetsClient.updateCell(cellRange, newStock);
  }
}
