import type { Transaction } from "../entities/Transaction";

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  getAll(): Promise<Transaction[]>;
  getById(id: string): Promise<Transaction | null>;
  getByCashier(cashierId: string): Promise<Transaction[]>;
  getByDateRange(startDate: string, endDate: string): Promise<Transaction[]>;
}
