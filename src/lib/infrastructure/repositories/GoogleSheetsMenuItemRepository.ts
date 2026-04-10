import type { IMenuItemRepository } from "../../domain/repositories/IMenuItemRepository";
import { MenuItem } from "../../domain/entities/MenuItem";
import type { GoogleSheetsClient } from "../config/GoogleSheetsClient";

export class GoogleSheetsMenuItemRepository implements IMenuItemRepository {
  private readonly SHEET_NAME = "MenuItems";

  constructor(private sheetsClient: GoogleSheetsClient) {}

  async getAll(): Promise<MenuItem[]> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:F`);
    return this.parseRows(rows);
  }

  async getAvailable(): Promise<MenuItem[]> {
    const all = await this.getAll();
    return all.filter((item) => item.disponible);
  }

  async getByCategory(categoria: string): Promise<MenuItem[]> {
    const all = await this.getAll();
    return all.filter((item) => item.categoria === categoria);
  }

  async getById(id: string): Promise<MenuItem | null> {
    const all = await this.getAll();
    return all.find((item) => item.id === id) || null;
  }

  async updateAvailability(itemId: string, disponible: boolean): Promise<void> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:F`);
    const rowIndex = rows.findIndex((row) => row[0] === itemId);

    if (rowIndex === -1) {
      throw new Error(`Item ${itemId} no encontrado`);
    }

    const cellRange = `${this.SHEET_NAME}!D${rowIndex + 2}`;
    await this.sheetsClient.updateCell(cellRange, disponible);
  }

  async decreaseInventory(itemId: string, cantidad: number): Promise<void> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:F`);
    const rowIndex = rows.findIndex((row) => row[0] === itemId);

    if (rowIndex === -1) {
      throw new Error(`Item ${itemId} no encontrado`);
    }

    const currentInventory = rows[rowIndex][5]; // Columna F (inventario)

    // Si no tiene inventario definido, no hacer nada
    if (
      currentInventory === undefined ||
      currentInventory === null ||
      currentInventory === ""
    ) {
      return;
    }

    const inventoryValue = parseInt(currentInventory);
    if (isNaN(inventoryValue)) {
      return;
    }

    const newInventory = Math.max(0, inventoryValue - cantidad);
    const cellRange = `${this.SHEET_NAME}!F${rowIndex + 2}`;
    await this.sheetsClient.updateCell(cellRange, newInventory);
  }

  private parseRows(rows: any[][]): MenuItem[] {
    return rows.map((row) => {
      const inventario =
        row[5] !== undefined && row[5] !== null && row[5] !== ""
          ? parseInt(row[5])
          : undefined;

      return new MenuItem(
        row[0], // id
        row[1], // nombre
        row[2], // categoria
        row[3] === "TRUE" || row[3] === true, // disponible
        parseInt(row[4]) || 0, // orden
        inventario, // inventario (opcional)
      );
    });
  }
}
