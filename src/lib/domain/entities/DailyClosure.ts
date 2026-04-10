export class DailyClosure {
  id: string;
  fecha: string;
  totalEfectivo: number;
  totalTransferencias: number;
  totalGeneral: number;
  cantidadOrdenes: number;
  responsable: string;
  responsableId: string;
  horaCierre: string;
  notas?: string;

  constructor(
    id: string,
    fecha: string,
    totalEfectivo: number,
    totalTransferencias: number,
    cantidadOrdenes: number,
    responsable: string,
    responsableId: string,
    horaCierre: string,
    notas?: string,
  ) {
    this.id = id;
    this.fecha = fecha;
    this.totalEfectivo = totalEfectivo;
    this.totalTransferencias = totalTransferencias;
    this.totalGeneral = totalEfectivo + totalTransferencias;
    this.cantidadOrdenes = cantidadOrdenes;
    this.responsable = responsable;
    this.responsableId = responsableId;
    this.horaCierre = horaCierre;
    this.notas = notas;
  }

  static create(
    fecha: string,
    totalEfectivo: number,
    totalTransferencias: number,
    cantidadOrdenes: number,
    responsable: string,
    responsableId: string,
    notas?: string,
  ): DailyClosure {
    if (totalEfectivo < 0 || totalTransferencias < 0) {
      throw new Error("Los montos no pueden ser negativos");
    }

    const now = new Date();
    const id = `CLS-${Date.now()}`;
    const horaCierre = now.toTimeString().split(" ")[0];

    return new DailyClosure(
      id,
      fecha,
      totalEfectivo,
      totalTransferencias,
      cantidadOrdenes,
      responsable,
      responsableId,
      horaCierre,
      notas,
    );
  }

  getPromedioPorOrden(): number {
    if (this.cantidadOrdenes === 0) return 0;
    return this.totalGeneral / this.cantidadOrdenes;
  }

  getPorcentajeEfectivo(): number {
    if (this.totalGeneral === 0) return 0;
    return (this.totalEfectivo / this.totalGeneral) * 100;
  }

  getPorcentajeTransferencias(): number {
    if (this.totalGeneral === 0) return 0;
    return (this.totalTransferencias / this.totalGeneral) * 100;
  }
}
