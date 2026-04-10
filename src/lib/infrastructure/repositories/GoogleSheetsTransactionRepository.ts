import type { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import {
  Transaction,
  TransactionItem,
} from "../../domain/entities/Transaction";
import type { GoogleSheetsClient } from "../config/GoogleSheetsClient";

export class GoogleSheetsTransactionRepository implements ITransactionRepository {
  private readonly SHEET_NAME = "Transacciones";

  constructor(private sheetsClient: GoogleSheetsClient) {}

  async save(transaction: Transaction): Promise<void> {
    const row = [
      transaction.id,
      transaction.fecha,
      transaction.hora,
      transaction.cajeroId,
      JSON.stringify(transaction.items),
      transaction.metodoPago,
      transaction.total,
    ];

    await this.sheetsClient.appendRow(`${this.SHEET_NAME}!A:G`, row);
  }

  async getAll(): Promise<Transaction[]> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:G`);

    return rows.map((row) => this.mapRowToTransaction(row));
  }

  async getById(id: string): Promise<Transaction | null> {
    const transactions = await this.getAll();
    return transactions.find((t) => t.id === id) || null;
  }

  async getByCashier(cashierId: string): Promise<Transaction[]> {
    const transactions = await this.getAll();
    return transactions.filter((t) => t.cajeroId === cashierId);
  }

  async getByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Transaction[]> {
    const transactions = await this.getAll();
    return transactions.filter(
      (t) => t.fecha >= startDate && t.fecha <= endDate,
    );
  }

  private mapRowToTransaction(row: any[]): Transaction {
    return new Transaction(
      row[0], // id
      row[1], // fecha
      row[2], // hora
      row[3], // cajeroId
      JSON.parse(row[4]) as TransactionItem[], // items
      row[5] as "efectivo" | "tarjeta" | "transferencia", // metodoPago
      parseFloat(row[6]), // total
    );
  }
}
