import type { IProductRepository } from "../../domain/repositories/IProductRepository";
import type { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import {
  Transaction,
  TransactionItem,
} from "../../domain/entities/Transaction";

export class ProcessSaleUseCase {
  constructor(
    private productRepository: IProductRepository,
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    cajeroId: string,
    items: TransactionItem[],
    metodoPago: "efectivo" | "tarjeta" | "transferencia",
  ): Promise<Transaction> {
    if (!items || items.length === 0) {
      throw new Error("La venta debe tener al menos un producto");
    }

    // Validar stock de todos los productos
    for (const item of items) {
      const product = await this.productRepository.getById(item.productId);

      if (!product) {
        throw new Error(`Producto ${item.productId} no encontrado`);
      }

      if (!product.hasStock(item.cantidad)) {
        throw new Error(
          `Stock insuficiente para ${product.nombre}. Stock actual: ${product.stock}`,
        );
      }
    }

    // Crear la transacción
    const transaction = Transaction.create(cajeroId, items, metodoPago);

    // Guardar la transacción
    await this.transactionRepository.save(transaction);

    // Actualizar stock de cada producto
    for (const item of items) {
      const product = await this.productRepository.getById(item.productId);
      if (product) {
        product.decrementStock(item.cantidad);
        await this.productRepository.updateStock(product.id, product.stock);
      }
    }

    return transaction;
  }
}
