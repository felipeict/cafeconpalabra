import { MenuItem } from "../entities/MenuItem";

export interface IMenuItemRepository {
  getAll(): Promise<MenuItem[]>;
  getAvailable(): Promise<MenuItem[]>;
  getByCategory(categoria: string): Promise<MenuItem[]>;
  getById(id: string): Promise<MenuItem | null>;
  updateAvailability(itemId: string, disponible: boolean): Promise<void>;
  decreaseInventory(itemId: string, cantidad: number): Promise<void>;
}
