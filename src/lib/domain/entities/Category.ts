export class Category {
  id: string;
  nombre: string;
  orden: number;
  activa: boolean;

  constructor(
    id: string,
    nombre: string,
    orden: number = 0,
    activa: boolean = true,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.orden = orden;
    this.activa = activa;
  }

  isActive(): boolean {
    return this.activa;
  }

  activate(): void {
    this.activa = true;
  }

  deactivate(): void {
    this.activa = false;
  }
}
