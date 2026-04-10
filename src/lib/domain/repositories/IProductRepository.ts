import type { Product } from "../entities/Product";

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getByCategory(category: string): Promise<Product[]>;
  updateStock(id: string, newStock: number): Promise<void>;
}
