export class Product {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  stockMinimo: number;

  constructor(
    id: string,
    nombre: string,
    categoria: string,
    precio: number,
    stock: number,
    stockMinimo: number,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.stock = stock;
    this.stockMinimo = stockMinimo;
  }

  isLowStock(): boolean {
    return this.stock <= this.stockMinimo;
  }

  hasStock(quantity: number = 1): boolean {
    return this.stock >= quantity;
  }

  decrementStock(quantity: number): void {
    if (!this.hasStock(quantity)) {
      throw new Error(`Stock insuficiente para ${this.nombre}`);
    }
    this.stock -= quantity;
  }
}
