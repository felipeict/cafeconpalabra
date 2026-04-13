"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { BottomNav } from "@/components/layout/BottomNav";
import { KitchenOrderCard } from "@/components/kitchen/KitchenOrderCard";
import {
  RefreshCw,
  Grid3x3,
  List,
  Volume2,
  VolumeX,
  Bell,
  LogOut,
} from "lucide-react";

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

type GroupBy = "none" | "mesa" | "categoria";

export default function KitchenPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const previousOrdersRef = useRef<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundEnabledRef = useRef(false); // Ref para acceder al valor en callbacks

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?returnUrl=/kitchen");
      return;
    }
    fetchOrders();

    // Auto-refresh cada 10 segundos
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated, router]);

  const fetchOrders = async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await fetch("/api/orders?fecha=today");

      if (response.ok) {
        const data: Order[] = await response.json();

        // Guardar todas las órdenes para métricas
        setAllOrders(data);

        // Filtrar solo órdenes activas (no entregadas ni canceladas)
        const activeOrders = data.filter(
          (order) =>
            order.estado !== "entregado" && order.estado !== "cancelado",
        );

        // Detectar nuevas órdenes
        if (isAutoRefresh && previousOrdersRef.current.length > 0) {
          const newOrders = activeOrders.filter(
            (order) => !previousOrdersRef.current.includes(order.id),
          );

          if (newOrders.length > 0) {
            setNewOrdersCount(newOrders.length);

            // Reproducir sonido si está habilitado (usar ref para valor actual)
            if (soundEnabledRef.current) {
              console.log(
                `🎵 ${newOrders.length} nueva(s) orden(es) detectada(s) - Reproduciendo melodía...`,
              );
              playNotificationSound();
            } else {
              console.log(
                `📋 ${newOrders.length} nueva(s) orden(es) detectada(s) - Sonido deshabilitado`,
              );
            }

            // Limpiar contador después de 5 segundos
            setTimeout(() => setNewOrdersCount(0), 5000);
          }
        }

        previousOrdersRef.current = activeOrders.map((o) => o.id);
        setOrders(activeOrders);
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

  const playNotificationSound = async () => {
    try {
      console.log("🎵 Reproduciendo notificación suave...");

      // Crear o reusar AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
      }

      const audioContext = audioContextRef.current;

      // Reanudar el contexto si está suspendido
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      // Función helper para crear una nota musical suave
      const createNote = (
        frequency: number,
        startTime: number,
        duration: number,
        volume: number = 0.15,
      ) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Onda suave tipo sine (la más pura y agradable)
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        // Envelope suave: ataque gradual y fade out natural
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05); // Ataque suave
        gainNode.gain.linearRampToValueAtTime(
          volume * 0.7,
          startTime + duration * 0.3,
        ); // Sustain
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Fade out suave

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);

        return { oscillator, gainNode };
      };

      const now = audioContext.currentTime;

      // Melodía armoniosa: Sol - Si - Re - Sol (ascendente y cálida)
      // Notas musicales suaves y elegantes, ideal para ambiente de café

      // Primera nota: Sol (392 Hz) - cálida y acogedora
      createNote(392, now, 0.4, 0.12);

      // Segunda nota: Si (494 Hz) - dulce y armoniosa
      createNote(494, now + 0.25, 0.4, 0.13);

      // Tercera nota: Re (587 Hz) - brillante pero suave
      createNote(587, now + 0.5, 0.5, 0.14);

      // Nota final: Sol alto (784 Hz) - resolución armoniosa
      createNote(784, now + 0.75, 0.6, 0.11);

      console.log("✓ Notificación melódica reproducida");
    } catch (error) {
      console.error("❌ Error al reproducir sonido:", error);
      // Fallback silencioso - no molestar al usuario con alerts
    }
  };

  const handleSoundToggle = async () => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);
    soundEnabledRef.current = newSoundState; // Actualizar ref

    // Reproducir sonido de prueba inmediatamente cuando se activa
    if (newSoundState) {
      console.log("🎵 Sonido activado - Reproduciendo melodía de prueba...");
      await playNotificationSound();
    } else {
      console.log("🔇 Sonido desactivado");
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["estado"],
  ) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (response.ok) {
        // Actualizar estado local
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, estado: newStatus } : order,
          ),
        );

        // Si se marca como entregado o cancelado, remover de la vista
        if (newStatus === "entregado" || newStatus === "cancelado") {
          setOrders((prev) => prev.filter((order) => order.id !== orderId));
        }
      } else {
        alert("Error al actualizar el estado");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Error al conectar con el servidor");
    }
  };

  const getGroupedOrders = () => {
    if (groupBy === "none") {
      return { all: orders };
    }

    if (groupBy === "mesa") {
      const grouped: { [key: string]: Order[] } = {};
      orders.forEach((order) => {
        const key = `Mesa ${order.numeroMesa}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(order);
      });
      return grouped;
    }

    if (groupBy === "categoria") {
      const grouped: { [key: string]: Order[] } = {};
      orders.forEach((order) => {
        order.items.forEach((item) => {
          if (!grouped[item.categoria]) grouped[item.categoria] = [];
          if (!grouped[item.categoria].find((o) => o.id === order.id)) {
            grouped[item.categoria].push(order);
          }
        });
      });
      return grouped;
    }

    return { all: orders };
  };

  const groupedOrders = getGroupedOrders();

  const getStatusCount = (status: Order["estado"] | "all") => {
    if (status === "all") {
      return allOrders.length;
    }
    return allOrders.filter((o) => o.estado === status).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-6">
      {/* Header */}
      <header className="bg-primary-600 text-white top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Vista de Cocina</h1>
              <p className="text-sm text-primary-100">
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Botón de sonido */}
              <button
                onClick={handleSoundToggle}
                className={`p-3 rounded-full transition-colors ${
                  soundEnabled
                    ? "bg-white text-primary-600 shadow-lg"
                    : "bg-primary-500 text-white hover:bg-primary-400"
                }`}
                title={
                  soundEnabled
                    ? "Sonido activado - Click para desactivar"
                    : "Sonido desactivado - Click para activar"
                }
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </button>

              {/* Botón de refresh */}
              <button
                onClick={() => fetchOrders()}
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

          {/* Notificación de nuevas órdenes */}
          {newOrdersCount > 0 && (
            <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold text-center mb-3 flex items-center justify-center gap-2">
              <Bell className="w-5 h-5" />
              {newOrdersCount}{" "}
              {newOrdersCount === 1 ? "Nueva Orden" : "Nuevas Órdenes"}!
            </div>
          )}

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
            <div className="bg-primary-500 bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">
                {getStatusCount("pendiente")}
              </div>
              <div className="text-xs">Pendientes</div>
            </div>
            <div className="bg-primary-500 bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">
                {getStatusCount("en-preparacion")}
              </div>
              <div className="text-xs">En Preparación</div>
            </div>
            <div className="bg-primary-500 bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">
                {getStatusCount("listo")}
              </div>
              <div className="text-xs">Listos</div>
            </div>
            <div className="bg-primary-500 bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">
                {getStatusCount("entregado")}
              </div>
              <div className="text-xs">Entregadas</div>
            </div>
            <div className="bg-primary-500 bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{getStatusCount("all")}</div>
              <div className="text-xs">Total del Día</div>
            </div>
          </div>

          {/* Filtros de agrupación */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            <button
              onClick={() => setGroupBy("none")}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                groupBy === "none"
                  ? "bg-white text-primary-600 shadow-md"
                  : "bg-primary-500 text-white hover:bg-primary-400"
              }`}
            >
              <List className="w-4 h-4" />
              Todas
            </button>
            <button
              onClick={() => setGroupBy("mesa")}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                groupBy === "mesa"
                  ? "bg-white text-primary-600 shadow-md"
                  : "bg-primary-500 text-white hover:bg-primary-400"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              Por Mesa
            </button>
            <button
              onClick={() => setGroupBy("categoria")}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                groupBy === "categoria"
                  ? "bg-white text-primary-600 shadow-md"
                  : "bg-primary-500 text-white hover:bg-primary-400"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              Por Categoría
            </button>
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

        {!isLoading && orders.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-300 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✨</span>
            </div>
            <p className="text-gray-600 text-lg font-medium">
              ¡No hay órdenes pendientes!
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Todas las órdenes han sido completadas
            </p>
          </div>
        )}

        {/* Órdenes agrupadas */}
        {!isLoading && orders.length > 0 && (
          <div className="space-y-6">
            {Object.entries(groupedOrders).map(([groupName, groupOrders]) => (
              <div key={groupName}>
                {groupBy !== "none" && (
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    {groupName} ({groupOrders.length})
                  </h2>
                )}

                {/* Grid responsive: 1 columna en mobile, 2 en tablet, 3 en desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupOrders.map((order) => (
                    <KitchenOrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
