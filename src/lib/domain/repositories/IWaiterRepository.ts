import { Waiter } from "../entities/Waiter";

export interface IWaiterRepository {
  getAll(): Promise<Waiter[]>;
  getActive(): Promise<Waiter[]>;
  getById(id: string): Promise<Waiter | null>;
  getByUsername(usuario: string): Promise<Waiter | null>;
  authenticate(usuario: string, password: string): Promise<Waiter | null>;
}
