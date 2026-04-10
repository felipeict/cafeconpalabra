export interface TransactionItem {
  productId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export class Transaction {
  id: string;
  fecha: string;
  hora: string;
  cajeroId: string;
  items: TransactionItem[];
  metodoPago: "efectivo" | "tarjeta" | "transferencia";
  total: number;

  constructor(
    id: string,
    fecha: string,
    hora: string,
    cajeroId: string,
    items: TransactionItem[],
    metodoPago: "efectivo" | "tarjeta" | "transferencia",
    total: number,
  ) {
    this.id = id;
    this.fecha = fecha;
    this.hora = hora;
    this.cajeroId = cajeroId;
    this.items = items;
    this.metodoPago = metodoPago;
    this.total = total;
  }

  static create(
    cajeroId: string,
    items: TransactionItem[],
    metodoPago: "efectivo" | "tarjeta" | "transferencia",
  ): Transaction {
    const now = new Date();
    const id = `TRX-${Date.now()}`;
    const fecha = now.toISOString().split("T")[0];
    const hora = now.toTimeString().split(" ")[0];
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    return new Transaction(id, fecha, hora, cajeroId, items, metodoPago, total);
  }
}
