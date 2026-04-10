"use client";

import { useState, useEffect } from "react";
import { Clock, User, CheckCircle, ChefHat, XCircle } from "lucide-react";
import { Badge } from "@/components/common/Badge";

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

interface KitchenOrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: Order["estado"]) => void;
}

export const KitchenOrderCard = ({
  order,
  onStatusChange,
}: KitchenOrderCardProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const calculateElapsed = () => {
      try {
        // Normalizar el formato de hora para asegurar HH:mm:ss
        const normalizeTime = (time: string): string => {
          const parts = time.split(":");
          if (parts.length === 3) {
            const [h, m, s] = parts;
            const hours = h.padStart(2, "0");
            const minutes = m.padStart(2, "0");
            const seconds = s.padStart(2, "0");
            return `${hours}:${minutes}:${seconds}`;
          }
          return time;
        };

        const normalizedHora = normalizeTime(order.hora);
        const orderDateTime = new Date(`${order.fecha}T${normalizedHora}`);

        if (isNaN(orderDateTime.getTime())) {
          console.error(
            "Invalid date format. Fecha:",
            order.fecha,
            "Hora:",
            order.hora,
            "Normalized:",
            normalizedHora,
          );
          setElapsedTime(0);
          return;
        }

        const now = new Date();
        const diffMs = now.getTime() - orderDateTime.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);

        setElapsedTime(diffMinutes >= 0 ? diffMinutes : 0);
      } catch (error) {
        console.error("Error calculando tiempo transcurrido:", error);
        setElapsedTime(0);
      }
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [order.fecha, order.hora]);

  const getTimeColor = () => {
    if (elapsedTime < 5) return "text-green-600 bg-green-50";
    if (elapsedTime < 10) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusBadge = () => {
    switch (order.estado) {
      case "pendiente":
        return <Badge variant="warning">Pendiente</Badge>;
      case "en-preparacion":
        return <Badge variant="info">En Preparación</Badge>;
      case "listo":
        return <Badge variant="success">Listo</Badge>;
      case "entregado":
        return <Badge variant="success">Entregado</Badge>;
      case "cancelado":
        return <Badge variant="danger">Cancelado</Badge>;
    }
  };

  const getNextStatusButton = () => {
    if (order.estado === "pendiente") {
      return (
        <button
          onClick={() => onStatusChange(order.id, "en-preparacion")}
          className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <ChefHat className="w-5 h-5" />
          Iniciar Preparación
        </button>
      );
    }

    if (order.estado === "en-preparacion") {
      return (
        <button
          onClick={() => onStatusChange(order.id, "listo")}
          className="flex-1 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Marcar Listo
        </button>
      );
    }

    if (order.estado === "listo") {
      return (
        <button
          onClick={() => onStatusChange(order.id, "entregado")}
          className="flex-1 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Marcar Entregado
        </button>
      );
    }

    return null;
  };

  // No mostrar órdenes entregadas o canceladas en cocina
  if (order.estado === "entregado" || order.estado === "cancelado") {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border-2 transition-all ${
        order.estado === "pendiente"
          ? "border-yellow-300"
          : order.estado === "en-preparacion"
            ? "border-blue-400"
            : "border-green-400"
      }`}
    >
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b-2 border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-4xl font-black text-gray-900">
                Mesa {order.numeroMesa}
              </h3>
              {getStatusBadge()}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{order.garzonNombre}</span>
            </div>
          </div>

          {/* Temporizador */}
          <div
            className={`px-4 py-2 rounded-lg font-bold text-center ${getTimeColor()}`}
          >
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-5 h-5" />
              <span className="text-2xl">{elapsedTime || 0}</span>
            </div>
            <div className="text-xs">minutos</div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-4">
        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary-600 w-8 text-center">
                    {item.cantidad}x
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      {item.nombre}
                    </p>
                    <p className="text-xs text-gray-500">{item.categoria}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notas */}
        {order.notas && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-4">
            <p className="text-sm font-medium text-yellow-800">
              📝 Nota: {order.notas}
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2">
          {getNextStatusButton()}
          {order.estado === "pendiente" && (
            <button
              onClick={() => onStatusChange(order.id, "cancelado")}
              className="px-4 py-3 bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-700 font-medium rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Hora */}
        <div className="mt-3 text-center text-sm text-gray-500">
          Orden creada a las {order.hora.substring(0, 5)}
        </div>
      </div>
    </div>
  );
};
