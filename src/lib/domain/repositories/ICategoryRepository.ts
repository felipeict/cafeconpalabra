import { Category } from "../entities/Category";

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getActive(): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
}
