export class Waiter {
  id: string;
  nombre: string;
  usuario: string;
  activo: boolean;
  private password?: string;

  constructor(
    id: string,
    nombre: string,
    usuario: string,
    activo: boolean = true,
    password?: string,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.usuario = usuario;
    this.activo = activo;
    this.password = password;
  }

  validatePassword(inputPassword: string): boolean {
    return this.password === inputPassword;
  }

  isActive(): boolean {
    return this.activo;
  }

  activate(): void {
    this.activo = true;
  }

  deactivate(): void {
    this.activo = false;
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      usuario: this.usuario,
      activo: this.activo,
    };
  }
}
