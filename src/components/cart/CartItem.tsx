import { X } from "lucide-react";

interface OrderItem {
  menuItemId: string;
  nombre: string;
  categoria: string;
  cantidad: number;
}

interface CartItemProps {
  item: OrderItem;
  onRemove: () => void;
  onUpdateQuantity: (cantidad: number) => void;
  maxQuantity?: number;
}

export const CartItem = ({
  item,
  onRemove,
  onUpdateQuantity,
  maxQuantity,
}: CartItemProps) => {
  const isMaxReached =
    maxQuantity !== undefined && item.cantidad >= maxQuantity;

  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{item.nombre}</h4>
        <p className="text-xs text-gray-500">{item.categoria}</p>
        {isMaxReached && (
          <p className="text-xs text-orange-600 font-medium mt-1">
            ✓ Máximo disponible
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.cantidad - 1)}
          className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          −
        </button>

        <span className="text-lg font-bold text-gray-900 w-8 text-center">
          {item.cantidad}
        </span>

        <button
          onClick={() => onUpdateQuantity(item.cantidad + 1)}
          disabled={isMaxReached}
          className={`w-8 h-8 border rounded-lg flex items-center justify-center transition-colors ${
            isMaxReached
              ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100 active:bg-gray-200"
          }`}
        >
          +
        </button>
      </div>

      <button
        onClick={onRemove}
        className="w-8 h-8 bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-lg flex items-center justify-center text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
