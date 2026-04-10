// Use Cases
import { LoginUseCase } from "./application/use-cases/LoginWaiterUseCase";
import { CreateOrderUseCase } from "./application/use-cases/CreateOrderUseCase";
import { GetOrdersUseCase } from "./application/use-cases/GetOrdersUseCase";
import { UpdateOrderStatusUseCase } from "./application/use-cases/UpdateOrderStatusUseCase";
import { GetAvailableMenuUseCase } from "./application/use-cases/GetAvailableMenuUseCase";
import { CreateDailyClosureUseCase } from "./application/use-cases/CreateDailyClosureUseCase";
import { GetDailySummaryUseCase } from "./application/use-cases/GetDailySummaryUseCase";
import { GetDonationsUseCase } from "./application/use-cases/GetDonationsUseCase";
import { GetProductsUseCase } from "./application/use-cases/GetProductsUseCase";
import { ProcessSaleUseCase } from "./application/use-cases/ProcessSaleUseCase";

// Infrastructure
import { GoogleSheetsClient } from "./infrastructure/config/GoogleSheetsClient";
import { GoogleSheetsWaiterRepository } from "./infrastructure/repositories/GoogleSheetsWaiterRepository";
import { GoogleSheetsOrderRepository } from "./infrastructure/repositories/GoogleSheetsOrderRepository";
import { GoogleSheetsMenuItemRepository } from "./infrastructure/repositories/GoogleSheetsMenuItemRepository";
import { GoogleSheetsCategoryRepository } from "./infrastructure/repositories/GoogleSheetsCategoryRepository";
import { GoogleSheetsDailyClosureRepository } from "./infrastructure/repositories/GoogleSheetsDailyClosureRepository";
import { GoogleSheetsDonationRepository } from "./infrastructure/repositories/GoogleSheetsDonationRepository";
import { GoogleSheetsProductRepository } from "./infrastructure/repositories/GoogleSheetsProductRepository";
import { GoogleSheetsTransactionRepository } from "./infrastructure/repositories/GoogleSheetsTransactionRepository";

export function getDependencies() {
  // Inicializar Google Sheets Client
  const sheetsClient = new GoogleSheetsClient({
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    privateKey: process.env.GOOGLE_PRIVATE_KEY!,
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
  });

  // Inicializar Repositories
  const waiterRepository = new GoogleSheetsWaiterRepository(sheetsClient);
  const orderRepository = new GoogleSheetsOrderRepository(sheetsClient);
  const menuItemRepository = new GoogleSheetsMenuItemRepository(sheetsClient);
  const categoryRepository = new GoogleSheetsCategoryRepository(sheetsClient);
  const dailyClosureRepository = new GoogleSheetsDailyClosureRepository(
    sheetsClient,
  );
  const donationRepository = new GoogleSheetsDonationRepository(sheetsClient);
  const productRepository = new GoogleSheetsProductRepository(sheetsClient);
  const transactionRepository = new GoogleSheetsTransactionRepository(
    sheetsClient,
  );

  // Inicializar Use Cases
  const loginUseCase = new LoginUseCase(waiterRepository);
  const createOrderUseCase = new CreateOrderUseCase(
    orderRepository,
    menuItemRepository,
  );
  const getOrdersUseCase = new GetOrdersUseCase(orderRepository);
  const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(
    orderRepository,
  );
  const getAvailableMenuUseCase = new GetAvailableMenuUseCase(
    menuItemRepository,
    categoryRepository,
  );
  const createDailyClosureUseCase = new CreateDailyClosureUseCase(
    dailyClosureRepository,
    orderRepository,
  );
  const getDailySummaryUseCase = new GetDailySummaryUseCase(
    orderRepository,
    dailyClosureRepository,
  );
  const getDonationsUseCase = new GetDonationsUseCase(donationRepository);
  const getProductsUseCase = new GetProductsUseCase(productRepository);
  const processSaleUseCase = new ProcessSaleUseCase(
    productRepository,
    transactionRepository,
  );

  return {
    // Repositories
    waiterRepository,
    orderRepository,
    menuItemRepository,
    categoryRepository,
    dailyClosureRepository,
    donationRepository,
    productRepository,
    transactionRepository,
    // Use Cases
    loginUseCase,
    createOrderUseCase,
    getOrdersUseCase,
    updateOrderStatusUseCase,
    getAvailableMenuUseCase,
    createDailyClosureUseCase,
    getDailySummaryUseCase,
    getDonationsUseCase,
    getProductsUseCase,
    processSaleUseCase,
  };
}
