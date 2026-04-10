export class MenuItem {
  id: string;
  nombre: string;
  categoria: string;
  disponible: boolean;
  orden: number;
  inventario?: number; // Campo opcional para items contables (queques, selladitos, etc)

  constructor(
    id: string,
    nombre: string,
    categoria: string,
    disponible: boolean = true,
    orden: number = 0,
    inventario?: number,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.disponible = disponible;
    this.orden = orden;
    this.inventario = inventario;
  }

  isAvailable(): boolean {
    return this.disponible;
  }

  makeAvailable(): void {
    this.disponible = true;
  }

  makeUnavailable(): void {
    this.disponible = false;
  }

  toggleAvailability(): void {
    this.disponible = !this.disponible;
  }

  hasInventory(): boolean {
    return this.inventario !== undefined && this.inventario !== null;
  }

  getInventoryStatus(): "high" | "medium" | "low" | "out" | "none" {
    if (!this.hasInventory()) return "none";
    if (this.inventario === 0) return "out";
    if (this.inventario! <= 5) return "low";
    if (this.inventario! <= 20) return "medium";
    return "high";
  }

  decreaseInventory(cantidad: number): void {
    if (this.hasInventory() && this.inventario! >= cantidad) {
      this.inventario! -= cantidad;
    }
  }

  increaseInventory(cantidad: number): void {
    if (this.hasInventory()) {
      this.inventario! += cantidad;
    }
  }
}
