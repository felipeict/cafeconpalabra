// Use Cases
import { LoginUseCase } from "./application/use-cases/LoginWaiterUseCase";
import { CreateOrderUseCase } from "./application/use-cases/CreateOrderUseCase";
import { GetOrdersUseCase } from "./application/use-cases/GetOrdersUseCase";
import { UpdateOrderStatusUseCase } from "./application/use-cases/UpdateOrderStatusUseCase";
import { GetAvailableMenuUseCase } from "./application/use-cases/GetAvailableMenuUseCase";
import { CreateDailyClosureUseCase } from "./application/use-cases/CreateDailyClosureUseCase";
import { GetDailySummaryUseCase } from "./application/use-cases/GetDailySummaryUseCase";

// Infrastructure
import { GoogleSheetsClient } from "./infrastructure/config/GoogleSheetsClient";
import { GoogleSheetsWaiterRepository } from "./infrastructure/repositories/GoogleSheetsWaiterRepository";
import { GoogleSheetsOrderRepository } from "./infrastructure/repositories/GoogleSheetsOrderRepository";
import { GoogleSheetsMenuItemRepository } from "./infrastructure/repositories/GoogleSheetsMenuItemRepository";
import { GoogleSheetsCategoryRepository } from "./infrastructure/repositories/GoogleSheetsCategoryRepository";
import { GoogleSheetsDailyClosureRepository } from "./infrastructure/repositories/GoogleSheetsDailyClosureRepository";

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

  return {
    // Repositories
    waiterRepository,
    orderRepository,
    menuItemRepository,
    categoryRepository,
    dailyClosureRepository,
    // Use Cases
    loginUseCase,
    createOrderUseCase,
    getOrdersUseCase,
    updateOrderStatusUseCase,
    getAvailableMenuUseCase,
    createDailyClosureUseCase,
    getDailySummaryUseCase,
  };
}
