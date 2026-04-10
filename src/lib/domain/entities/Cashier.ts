export class Cashier {
  id: string;
  nombre: string;
  usuario: string;
  private password?: string;

  constructor(id: string, nombre: string, usuario: string, password?: string) {
    this.id = id;
    this.nombre = nombre;
    this.usuario = usuario;
    this.password = password;
  }

  validatePassword(inputPassword: string): boolean {
    return this.password === inputPassword;
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      usuario: this.usuario,
    };
  }
}
