import type { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import {
  Order,
  type OrderItem,
  type OrderStatus,
} from "../../domain/entities/Order";
import type { GoogleSheetsClient } from "../config/GoogleSheetsClient";

export class GoogleSheetsOrderRepository implements IOrderRepository {
  private readonly SHEET_NAME = "Pedidos";

  constructor(private sheetsClient: GoogleSheetsClient) {}

  async create(order: Order): Promise<void> {
    const values = [
      order.id,
      order.fecha,
      order.hora,
      order.garzonId,
      order.garzonNombre,
      order.numeroMesa,
      JSON.stringify(order.items),
      order.estado,
      order.notas || "",
    ];

    await this.sheetsClient.appendRow(`${this.SHEET_NAME}!A2`, values);
  }

  async getAll(): Promise<Order[]> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:I`);
    return this.parseRows(rows);
  }

  async getByDate(fecha: string): Promise<Order[]> {
    const all = await this.getAll();
    return all.filter((order) => order.fecha === fecha);
  }

  async getById(id: string): Promise<Order | null> {
    const all = await this.getAll();
    return all.find((order) => order.id === id) || null;
  }

  async updateStatus(orderId: string, estado: OrderStatus): Promise<void> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:I`);
    const rowIndex = rows.findIndex((row) => row[0] === orderId);

    if (rowIndex === -1) {
      throw new Error(`Pedido ${orderId} no encontrado`);
    }

    const cellRange = `${this.SHEET_NAME}!H${rowIndex + 2}`;
    await this.sheetsClient.updateCell(cellRange, estado);
  }

  async getByWaiter(garzonId: string, fecha?: string): Promise<Order[]> {
    const all = await this.getAll();
    let filtered = all.filter((order) => order.garzonId === garzonId);

    if (fecha) {
      filtered = filtered.filter((order) => order.fecha === fecha);
    }

    return filtered;
  }

  async getPendingOrders(): Promise<Order[]> {
    const all = await this.getAll();
    return all.filter((order) => order.estado === "pendiente");
  }

  private parseRows(rows: any[][]): Order[] {
    return rows.map(
      (row) =>
        new Order(
          row[0], // id
          row[1], // fecha
          row[2], // hora
          row[3], // garzonId
          row[4], // garzonNombre
          row[5], // numeroMesa
          JSON.parse(row[6] || "[]"), // items
          row[7] as OrderStatus, // estado
          row[8] || undefined, // notas
        ),
    );
  }
}
