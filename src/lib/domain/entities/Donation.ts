export class Donation {
  fecha: string;
  monto: number;
  nombre: string;

  constructor(fecha: string, monto: number, nombre: string) {
    this.fecha = fecha;
    this.monto = monto;
    this.nombre = nombre;
  }
}
