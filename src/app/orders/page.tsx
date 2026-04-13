"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { BottomNav } from "@/components/layout/BottomNav";
import { OrderCard } from "@/components/orders/OrderCard";
import { Badge } from "@/components/common/Badge";
import { RefreshCw, Filter, ListOrdered, LogOut } from "lucide-react";

interface OrderItem {
  menuItemId: string;
  nombre: string;
  categoria: string;
  cantidad: number;
}

interface Order {
  id: string;
  fecha: string;
  hora: string;
  garzonId: string;
  garzonNombre: string;
  numeroMesa: string;
  items: OrderItem[];
  estado: "pendiente" | "en-preparacion" | "listo" | "entregado" | "cancelado";
  notas?: string;
}

type FilterType =
  | "all"
  | "pendiente"
  | "en-preparacion"
  | "listo"
  | "entregado"
  | "cancelado";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, waiter, logout } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<FilterType>("pendiente");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !waiter) {
      router.push("/login?returnUrl=/orders");
      return;
    }
    fetchOrders();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, waiter, router]);

  const fetchOrders = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      // Filtrar órdenes por el mesero autenticado
      const garzonId = waiter?.id || "";
      const response = await fetch(
        `/api/orders?fecha=today&garzonId=${garzonId}`,
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setError("");
      } else {
        setError("Error al cargar las órdenes");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    estado:
      | "pendiente"
      | "en-preparacion"
      | "listo"
      | "entregado"
      | "cancelado",
  ) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado }),
      });

      if (response.ok) {
        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, estado } : order,
          ),
        );
      } else {
        alert("Error al actualizar el estado");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Error al conectar con el servidor");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.estado === filter;
  });

  const getCountByStatus = (status: FilterType) => {
    if (status === "all") return orders.length;
    return orders.filter((o) => o.estado === status).length;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-6">
      {/* Header */}
      <header className="bg-primary-600 text-white sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Mis Órdenes</h1>
              <p className="text-sm text-primary-100">
                {waiter?.nombre} •{" "}
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchOrders(true)}
                disabled={isRefreshing}
                className="bg-white text-primary-600 rounded-full p-3 shadow-lg hover:scale-105 transition-transform active:scale-95 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-6 h-6 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="bg-red-500 text-white rounded-full p-3 shadow-lg hover:scale-105 hover:bg-red-600 transition-all active:scale-95"
                title="Cerrar Sesión"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
            <Filter className="w-5 h-5 flex-shrink-0" />
            {[
              { key: "pendiente" as FilterType, label: "Pendientes" },
              { key: "en-preparacion" as FilterType, label: "En Preparación" },
              { key: "listo" as FilterType, label: "Listos" },
              { key: "entregado" as FilterType, label: "Entregadas" },
              { key: "cancelado" as FilterType, label: "Canceladas" },
              { key: "all" as FilterType, label: "Todas" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  filter === item.key
                    ? "bg-white text-primary-600 shadow-md"
                    : "bg-primary-500 text-white hover:bg-primary-400"
                }`}
              >
                {item.label}
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    filter === item.key
                      ? "bg-primary-600 text-white"
                      : "bg-primary-600 text-white"
                  }`}
                >
                  {getCountByStatus(item.key)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando órdenes...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => fetchOrders()}
              className="text-red-700 underline mt-2 text-sm"
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {!isLoading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <ListOrdered className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No hay órdenes {filter !== "all" ? filter + "s" : ""}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {filter === "pendiente"
                ? "¡Genial! No hay pedidos pendientes"
                : "Las órdenes aparecerán aquí"}
            </p>
          </div>
        )}

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {/* Summary */}
        {!isLoading && orders.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-md p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Resumen del Día
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {getCountByStatus("pendiente")}
                </p>
                <p className="text-xs text-gray-600">Pendientes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {getCountByStatus("en-preparacion")}
                </p>
                <p className="text-xs text-gray-600">En Preparación</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {getCountByStatus("listo")}
                </p>
                <p className="text-xs text-gray-600">Listos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {getCountByStatus("entregado")}
                </p>
                <p className="text-xs text-gray-600">Entregadas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">
                  {getCountByStatus("all")}
                </p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
