// Use Cases - Waiters
export { LoginUseCase } from "./LoginWaiterUseCase";

// Use Cases - Orders
export {
  CreateOrderUseCase,
  type CreateOrderInput,
} from "./CreateOrderUseCase";
export { GetOrdersUseCase } from "./GetOrdersUseCase";
export { UpdateOrderStatusUseCase } from "./UpdateOrderStatusUseCase";

// Use Cases - Menu
export {
  GetAvailableMenuUseCase,
  type MenuData,
} from "./GetAvailableMenuUseCase";

// Use Cases - Daily Closure
export {
  CreateDailyClosureUseCase,
  type CreateClosureInput,
} from "./CreateDailyClosureUseCase";
export {
  GetDailySummaryUseCase,
  type DailySummary,
} from "./GetDailySummaryUseCase";
