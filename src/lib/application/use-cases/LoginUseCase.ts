import type { ICashierRepository } from "../../domain/repositories/ICashierRepository";
import type { Cashier } from "../../domain/entities/Cashier";

export class LoginUseCase {
  constructor(private cashierRepository: ICashierRepository) {}

  async execute(username: string, password: string): Promise<Cashier | null> {
    if (!username || !password) {
      throw new Error("Usuario y contraseña son requeridos");
    }

    const cashier = await this.cashierRepository.findByUsername(username);

    if (!cashier) {
      return null;
    }

    if (!cashier.validatePassword(password)) {
      return null;
    }

    return cashier;
  }
}
