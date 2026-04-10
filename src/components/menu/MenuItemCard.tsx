import { Plus, Minus, Check, Package } from "lucide-react";

interface MenuItem {
  id: string;
  nombre: string;
  categoria: string;
  disponible: boolean;
  inventario?: number;
}

interface MenuItemCardProps {
  item: MenuItem;
  quantity?: number;
  onAdd: () => void;
  onRemove?: () => void;
  maxQuantity?: number;
}

export const MenuItemCard = ({
  item,
  quantity = 0,
  onAdd,
  onRemove,
  maxQuantity,
}: MenuItemCardProps) => {
  const hasQuantity = quantity > 0;
  const hasInventory =
    item.inventario !== undefined && item.inventario !== null;
  const isMaxReached = maxQuantity !== undefined && quantity >= maxQuantity;

  const getInventoryColor = () => {
    if (!hasInventory || item.inventario === undefined) return "";
    if (item.inventario === 0) return "text-red-600 bg-red-50";
    if (item.inventario <= 5) return "text-red-600 bg-red-50";
    if (item.inventario <= 20) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const getInventoryText = () => {
    if (!hasInventory || item.inventario === undefined) return "";
    if (item.inventario === 0) return "Agotado";
    if (item.inventario <= 5) return `¡Solo ${item.inventario}!`;
    return `Quedan ${item.inventario}`;
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 ${
        hasQuantity
          ? "border-primary-500 shadow-md scale-[1.02]"
          : "border-gray-200 hover:border-primary-300 active:scale-[0.98]"
      }`}
    >
      {/* Indicador de seleccionado */}
      {hasQuantity && (
        <div className="absolute -top-2 -right-2 bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10">
          <Check className="w-5 h-5" />
        </div>
      )}

      <button
        onClick={onAdd}
        disabled={!item.disponible}
        className="w-full p-4 text-left disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">
              {item.nombre}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{item.categoria}</p>

            {/* Indicador de inventario */}
            {hasInventory && (
              <div>
                <div
                  className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-medium ${getInventoryColor()}`}
                >
                  <Package className="w-3 h-3" />
                  {getInventoryText()}
                </div>
                {isMaxReached && (
                  <div className="text-xs text-orange-600 font-medium mt-1">
                    ✓ Máximo en carrito
                  </div>
                )}
              </div>
            )}
          </div>

          {!hasQuantity && item.disponible && (
            <div className="ml-3 bg-primary-500 text-white rounded-full p-2">
              <Plus className="w-5 h-5" />
            </div>
          )}
        </div>
      </button>

      {/* Controles de cantidad */}
      {hasQuantity && (
        <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full p-2 transition-colors"
          >
            <Minus className="w-5 h-5" />
          </button>

          <span className="text-2xl font-bold text-gray-900 mx-4">
            {quantity}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            disabled={isMaxReached}
            className={`rounded-full p-2 transition-colors ${
              isMaxReached
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white"
            }`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
