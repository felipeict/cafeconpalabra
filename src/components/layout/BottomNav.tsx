"use client";

import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, ListOrdered, Calculator, ChefHat } from "lucide-react";

export const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      icon: ShoppingBag,
      label: "Pedidos",
      path: "/pos",
      active: pathname === "/pos",
    },
    {
      icon: ListOrdered,
      label: "Órdenes",
      path: "/orders",
      active: pathname === "/orders",
    },
    {
      icon: ChefHat,
      label: "Cocina",
      path: "/kitchen",
      active: pathname === "/kitchen",
    },
    {
      icon: Calculator,
      label: "Cierre",
      path: "/closure",
      active: pathname === "/closure",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg pb-safe z-50">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                item.active
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-primary-500 hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`w-6 h-6 ${item.active ? "stroke-[2.5]" : ""}`}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
