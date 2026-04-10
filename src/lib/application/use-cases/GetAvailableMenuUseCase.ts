import type { IMenuItemRepository } from "../../domain/repositories/IMenuItemRepository";
import type { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import type { MenuItem } from "../../domain/entities/MenuItem";
import type { Category } from "../../domain/entities/Category";

export interface MenuData {
  categories: Category[];
  items: MenuItem[];
}

export class GetAvailableMenuUseCase {
  constructor(
    private menuItemRepository: IMenuItemRepository,
    private categoryRepository: ICategoryRepository,
  ) {}

  async execute(): Promise<MenuData> {
    // Obtener categorías activas
    const categories = await this.categoryRepository.getActive();

    // Obtener items disponibles
    const items = await this.menuItemRepository.getAvailable();

    // Ordenar categorías por orden
    categories.sort((a, b) => a.orden - b.orden);

    // Ordenar items por orden
    items.sort((a, b) => a.orden - b.orden);

    return {
      categories,
      items,
    };
  }
}
