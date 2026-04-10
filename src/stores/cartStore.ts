import { create } from "zustand";

interface MenuItem {
  id: string;
  nombre: string;
  categoria: string;
  disponible: boolean;
  orden: number;
}

interface OrderItem {
  menuItemId: string;
  nombre: string;
  categoria: string;
  cantidad: number;
}

interface CartState {
  items: OrderItem[];
  numeroMesa: string;
  notas: string;
  setNumeroMesa: (mesa: string) => void;
  setNotas: (notas: string) => void;
  addItem: (menuItem: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, cantidad: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  hasItems: () => boolean;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  numeroMesa: "",
  notas: "",

  setNumeroMesa: (mesa: string) => {
    set({ numeroMesa: mesa });
  },

  setNotas: (notas: string) => {
    set({ notas });
  },

  addItem: (menuItem: MenuItem) => {
    const items = get().items;
    const existingItem = items.find((item) => item.menuItemId === menuItem.id);

    if (existingItem) {
      // Si ya existe, aumentar cantidad
      set({
        items: items.map((item) =>
          item.menuItemId === menuItem.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        ),
      });
    } else {
      // Si no existe, agregarlo con cantidad 1
      set({
        items: [
          ...items,
          {
            menuItemId: menuItem.id,
            nombre: menuItem.nombre,
            categoria: menuItem.categoria,
            cantidad: 1,
          },
        ],
      });
    }
  },

  removeItem: (menuItemId: string) => {
    set({
      items: get().items.filter((item) => item.menuItemId !== menuItemId),
    });
  },

  updateQuantity: (menuItemId: string, cantidad: number) => {
    if (cantidad <= 0) {
      get().removeItem(menuItemId);
      return;
    }

    set({
      items: get().items.map((item) =>
        item.menuItemId === menuItemId ? { ...item, cantidad } : item,
      ),
    });
  },

  clearCart: () => {
    set({ items: [], numeroMesa: "", notas: "" });
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.cantidad, 0);
  },

  hasItems: () => {
    return get().items.length > 0;
  },
}));
