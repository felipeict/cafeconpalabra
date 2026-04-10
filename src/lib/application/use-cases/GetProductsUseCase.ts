import type { IProductRepository } from "../../domain/repositories/IProductRepository";
import type { Product } from "../../domain/entities/Product";

export class GetProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(category?: string): Promise<Product[]> {
    if (!category || category === "Todas") {
      return await this.productRepository.getAll();
    }

    return await this.productRepository.getByCategory(category);
  }

  async getCategories(): Promise<string[]> {
    const products = await this.productRepository.getAll();
    const categories = new Set(products.map((p) => p.categoria));
    return ["Todas", ...Array.from(categories)];
  }
}
