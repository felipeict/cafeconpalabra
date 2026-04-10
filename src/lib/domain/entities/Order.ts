export interface OrderItem {
  menuItemId: string;
  nombre: string;
  categoria: string;
  cantidad: number;
}

export type OrderStatus =
  | "pendiente"
  | "en-preparacion"
  | "listo"
  | "entregado"
  | "cancelado";

export class Order {
  id: string;
  fecha: string;
  hora: string;
  garzonId: string;
  garzonNombre: string;
  numeroMesa: string;
  items: OrderItem[];
  estado: OrderStatus;
  notas?: string;

  constructor(
    id: string,
    fecha: string,
    hora: string,
    garzonId: string,
    garzonNombre: string,
    numeroMesa: string,
    items: OrderItem[],
    estado: OrderStatus = "pendiente",
    notas?: string,
  ) {
    this.id = id;
    this.fecha = fecha;
    this.hora = hora;
    this.garzonId = garzonId;
    this.garzonNombre = garzonNombre;
    this.numeroMesa = numeroMesa;
    this.items = items;
    this.estado = estado;
    this.notas = notas;
  }

  static create(
    garzonId: string,
    garzonNombre: string,
    numeroMesa: string,
    items: OrderItem[],
    notas?: string,
  ): Order {
    if (!numeroMesa || numeroMesa.trim() === "") {
      throw new Error("El número de mesa es requerido");
    }

    if (!items || items.length === 0) {
      throw new Error("El pedido debe tener al menos un item");
    }

    const now = new Date();
    const id = `ORD-${Date.now()}`;
    const fecha = now.toISOString().split("T")[0];
    const hora = now.toTimeString().split(" ")[0];

    return new Order(
      id,
      fecha,
      hora,
      garzonId,
      garzonNombre,
      numeroMesa,
      items,
      "pendiente",
      notas,
    );
  }

  markAsInProgress(): void {
    if (this.estado === "cancelado") {
      throw new Error("No se puede marcar en preparación un pedido cancelado");
    }
    this.estado = "en-preparacion";
  }

  markAsReady(): void {
    if (this.estado === "cancelado") {
      throw new Error("No se puede marcar como listo un pedido cancelado");
    }
    this.estado = "listo";
  }

  markAsDelivered(): void {
    if (this.estado === "cancelado") {
      throw new Error("No se puede marcar como entregado un pedido cancelado");
    }
    this.estado = "entregado";
  }

  cancel(): void {
    if (this.estado === "entregado") {
      throw new Error("No se puede cancelar un pedido ya entregado");
    }
    this.estado = "cancelado";
  }

  getTotalItems(): number {
    return this.items.reduce((sum, item) => sum + item.cantidad, 0);
  }

  isPending(): boolean {
    return this.estado === "pendiente";
  }

  isDelivered(): boolean {
    return this.estado === "entregado";
  }

  isCancelled(): boolean {
    return this.estado === "cancelado";
  }
}
