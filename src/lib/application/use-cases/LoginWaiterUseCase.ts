import type { IWaiterRepository } from "../../domain/repositories/IWaiterRepository";
import type { Waiter } from "../../domain/entities/Waiter";

export class LoginUseCase {
  constructor(private waiterRepository: IWaiterRepository) {}

  async execute(username: string, password: string): Promise<Waiter | null> {
    if (!username || !password) {
      throw new Error("Usuario y contraseña son requeridos");
    }

    const waiter = await this.waiterRepository.authenticate(username, password);

    if (!waiter) {
      return null;
    }

    if (!waiter.isActive()) {
      throw new Error("El usuario no está activo");
    }

    return waiter;
  }
}
