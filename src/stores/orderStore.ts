import { create } from "zustand";

export interface Order {
  id: string;
  fecha: string;
  hora: string;
  garzonId: string;
  garzonNombre: string;
  numeroMesa: string;
  items: OrderItem[];
  estado: "pendiente" | "entregado" | "cancelado";
  notas?: string;
}

export interface OrderItem {
  menuItemId: string;
  nombre: string;
  categoria: string;
  cantidad: number;
}

interface OrderState {
  orders: Order[];
  pendingOrders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (
    orderId: string,
    estado: "pendiente" | "entregado" | "cancelado",
  ) => void;
  getPendingOrders: () => Order[];
  getOrdersByMesa: (numeroMesa: string) => Order[];
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  pendingOrders: [],

  setOrders: (orders: Order[]) => {
    set({
      orders,
      pendingOrders: orders.filter((o) => o.estado === "pendiente"),
    });
  },

  addOrder: (order: Order) => {
    const orders = [...get().orders, order];
    set({
      orders,
      pendingOrders: orders.filter((o) => o.estado === "pendiente"),
    });
  },

  updateOrderStatus: (
    orderId: string,
    estado: "pendiente" | "entregado" | "cancelado",
  ) => {
    const orders = get().orders.map((order) =>
      order.id === orderId ? { ...order, estado } : order,
    );
    set({
      orders,
      pendingOrders: orders.filter((o) => o.estado === "pendiente"),
    });
  },

  getPendingOrders: () => {
    return get().orders.filter((o) => o.estado === "pendiente");
  },

  getOrdersByMesa: (numeroMesa: string) => {
    return get().orders.filter((o) => o.numeroMesa === numeroMesa);
  },

  clearOrders: () => {
    set({ orders: [], pendingOrders: [] });
  },
}));
