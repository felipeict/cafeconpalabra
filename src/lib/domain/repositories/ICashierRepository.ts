import type { Cashier } from "../entities/Cashier";

export interface ICashierRepository {
  findByUsername(username: string): Promise<Cashier | null>;
  getAll(): Promise<Cashier[]>;
}
