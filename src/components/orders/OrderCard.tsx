import { Badge } from "@/components/common/Badge";
import { Clock, User, Hash, CheckCircle, XCircle } from "lucide-react";

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
  garzonNombre: string;
  numeroMesa: string;
  items: OrderItem[];
  estado: "pendiente" | "en-preparacion" | "listo" | "entregado" | "cancelado";
  notas?: string;
}

interface OrderCardProps {
  order: Order;
  onStatusChange?: (
    orderId: string,
    estado:
      | "pendiente"
      | "en-preparacion"
      | "listo"
      | "entregado"
      | "cancelado",
  ) => void;
}

export const OrderCard = ({ order, onStatusChange }: OrderCardProps) => {
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

  const getStatusColor = () => {
    switch (order.estado) {
      case "pendiente":
        return "border-yellow-300 bg-yellow-50";
      case "en-preparacion":
        return "border-blue-300 bg-blue-50";
      case "listo":
        return "border-green-300 bg-green-50";
      case "entregado":
        return "border-green-300 bg-green-50";
      case "cancelado":
        return "border-red-300 bg-red-50";
    }
  };

  const totalItems = order.items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div
      className={`bg-white rounded-xl shadow-md border-2 ${getStatusColor()} overflow-hidden`}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary-500 text-white font-bold rounded-lg px-4 py-2 text-xl">
              Mesa {order.numeroMesa}
            </div>
            {getStatusBadge()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{order.hora.slice(0, 5)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span className="truncate">{order.garzonNombre}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Hash className="w-4 h-4" />
            <span className="text-xs">{order.id}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-4 space-y-2">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.nombre}</p>
              <p className="text-xs text-gray-500">{item.categoria}</p>
            </div>
            <span className="text-lg font-bold text-primary-600 ml-2">
              x{item.cantidad}
            </span>
          </div>
        ))}

        {order.notas && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
            <p className="text-xs text-blue-800 font-medium">Nota:</p>
            <p className="text-sm text-blue-900">{order.notas}</p>
          </div>
        )}
      </div>

      {/* Actions (only for ready orders) */}
      {order.estado === "listo" && onStatusChange && (
        <div className="border-t border-gray-200 p-3 bg-white flex gap-2">
          <button
            onClick={() => onStatusChange(order.id, "entregado")}
            className="flex-1 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Marcar Entregado
          </button>
          <button
            onClick={() => onStatusChange(order.id, "cancelado")}
            className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Footer info */}
      <div className="bg-gray-100 px-4 py-2 text-xs text-gray-600 text-center">
        Total: {totalItems} {totalItems === 1 ? "item" : "items"}
      </div>
    </div>
  );
};
