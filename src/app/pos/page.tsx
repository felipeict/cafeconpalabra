"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { BottomNav } from "@/components/layout/BottomNav";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { CartItem } from "@/components/cart/CartItem";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { ShoppingCart, X, Check, LogOut } from "lucide-react";

interface MenuItem {
  id: string;
  nombre: string;
  categoria: string;
  disponible: boolean;
  orden: number;
  inventario?: number;
}

interface Category {
  id: string;
  nombre: string;
  orden: number;
  activa: boolean;
}

export default function POSPage() {
  const router = useRouter();
  const { waiter, isAuthenticated, logout } = useAuthStore();
  const {
    items,
    numeroMesa,
    notas,
    setNumeroMesa,
    setNotas,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    hasItems,
  } = useCartStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?returnUrl=/pos");
      return;
    }
    fetchMenu();
  }, [isAuthenticated, router]);

  const fetchMenu = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/menu");

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        setMenuItems(data.items || []);

        if (data.categories && data.categories.length > 0) {
          setSelectedCategory(data.categories[0].id);
        }
      } else {
        setError("Error al cargar el menú");
      }
    } catch (err) {
      console.error("Error fetching menu:", err);
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => {
        const category = categories.find((c) => c.nombre === item.categoria);
        return category?.id === selectedCategory;
      })
    : menuItems;

  const getItemQuantity = (menuItemId: string) => {
    const item = items.find((i) => i.menuItemId === menuItemId);
    return item?.cantidad || 0;
  };

  const canAddMoreItems = (menuItem: MenuItem): boolean => {
    // Si no tiene inventario, siempre se puede agregar
    if (menuItem.inventario === undefined || menuItem.inventario === null) {
      return true;
    }

    const currentQuantity = getItemQuantity(menuItem.id);
    return currentQuantity < menuItem.inventario;
  };

  const handleAddItem = (menuItem: MenuItem) => {
    // Validar que hay número de mesa
    if (!numeroMesa || numeroMesa.trim() === "") {
      setError("⚠️ Ingresa el número de mesa antes de agregar productos");
      setTimeout(() => setError(""), 3000);
      return;
    }

    // Validar inventario antes de agregar
    if (menuItem.inventario !== undefined && menuItem.inventario !== null) {
      const currentQuantity = getItemQuantity(menuItem.id);

      if (currentQuantity >= menuItem.inventario) {
        setError(
          `No puedes agregar más ${menuItem.nombre}. Solo hay ${menuItem.inventario} disponibles.`,
        );
        setTimeout(() => setError(""), 3000);
        return;
      }
    }

    addItem(menuItem);
  };

  const handleRemoveItem = (menuItemId: string) => {
    const item = items.find((i) => i.menuItemId === menuItemId);
    if (item && item.cantidad > 1) {
      updateQuantity(menuItemId, item.cantidad - 1);
    } else {
      removeItem(menuItemId);
    }
  };

  const handleUpdateQuantity = (menuItemId: string, newQuantity: number) => {
    // Validar que no sea menor a 1
    if (newQuantity < 1) {
      removeItem(menuItemId);
      return;
    }

    // Buscar el menuItem para validar inventario
    const menuItem = menuItems.find((mi) => mi.id === menuItemId);

    if (menuItem?.inventario !== undefined && menuItem.inventario !== null) {
      if (newQuantity > menuItem.inventario) {
        setError(
          `No puedes agregar más ${menuItem.nombre}. Solo hay ${menuItem.inventario} disponibles.`,
        );
        setTimeout(() => setError(""), 3000);
        return;
      }
    }

    updateQuantity(menuItemId, newQuantity);
  };

  const handleSubmitOrder = async () => {
    if (!numeroMesa || numeroMesa.trim() === "") {
      setError("Por favor ingresa el número de mesa");
      return;
    }

    if (!hasItems()) {
      setError("Agrega al menos un item al pedido");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          garzonId: waiter?.id,
          garzonNombre: waiter?.nombre,
          numeroMesa,
          items,
          notas: notas || undefined,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        clearCart();
        setShowCart(false);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al crear el pedido");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Error al conectar con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-6">
      {/* Header */}
      <header className="bg-primary-600 text-white sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold">Nuevo Pedido</h1>
              <p className="text-sm text-primary-100">{waiter?.nombre}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-white text-primary-600 rounded-full p-3 shadow-lg hover:scale-105 transition-transform active:scale-95"
              >
                <ShoppingCart className="w-6 h-6" />
                {hasItems() && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
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

          {/* Mesa Input */}
          <div className="bg-white rounded-lg p-3">
            <Input
              type="text"
              placeholder="Número de Mesa"
              value={numeroMesa}
              onChange={(e) => setNumeroMesa(e.target.value)}
              className="text-center text-xl font-bold text-black focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Categories Tabs */}
        {!isLoading && categories.length > 0 && (
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 px-4 pb-3 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? "bg-white text-primary-600 shadow-md"
                      : "bg-primary-500 text-white hover:bg-primary-400"
                  }`}
                >
                  {category.nombre}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="p-4">
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando menú...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4 flex items-center gap-3">
            <Check className="w-6 h-6 text-green-600" />
            <p className="text-green-600 font-medium">
              ¡Pedido creado exitosamente!
            </p>
          </div>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No hay items disponibles en esta categoría
            </p>
          </div>
        )}

        {/* Aviso de número de mesa requerido */}
        {!isLoading &&
          filteredItems.length > 0 &&
          (!numeroMesa || numeroMesa.trim() === "") && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4 flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                !
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 mb-1">
                  Ingresa el número de mesa
                </h3>
                <p className="text-sm text-yellow-800">
                  Debes ingresar el número de mesa antes de agregar productos al
                  carrito.
                </p>
              </div>
            </div>
          )}

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              quantity={getItemQuantity(item.id)}
              onAdd={() => handleAddItem(item)}
              onRemove={() => handleRemoveItem(item.id)}
              maxQuantity={item.inventario}
              disabled={!numeroMesa || numeroMesa.trim() === ""}
            />
          ))}
        </div>
      </main>

      {/* Cart Drawer (Mobile) */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Carrito ({items.length})
              </h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  El carrito está vacío
                </p>
              ) : (
                <>
                  {items.map((item) => {
                    const menuItem = menuItems.find(
                      (mi) => mi.id === item.menuItemId,
                    );
                    return (
                      <CartItem
                        key={item.menuItemId}
                        item={item}
                        onRemove={() => removeItem(item.menuItemId)}
                        onUpdateQuantity={(cantidad) =>
                          handleUpdateQuantity(item.menuItemId, cantidad)
                        }
                        maxQuantity={menuItem?.inventario}
                      />
                    );
                  })}

                  {/* Notas */}
                  <div className="pt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas adicionales (opcional)
                    </label>
                    <textarea
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      placeholder="Ej: Sin azúcar, extra caliente..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Cart Footer */}
            {hasItems() && (
              <div className="p-4 border-t bg-gray-50 space-y-3">
                <Button
                  fullWidth
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || !numeroMesa}
                  isLoading={isSubmitting}
                  className="py-4 text-lg"
                >
                  {isSubmitting ? "Enviando..." : "Confirmar Pedido"}
                </Button>
                <button
                  onClick={() => {
                    if (confirm("¿Estás seguro de vaciar el carrito?")) {
                      clearCart();
                      setShowCart(false);
                    }
                  }}
                  className="w-full text-red-600 hover:text-red-700 font-medium py-2 transition-colors"
                >
                  Vaciar Carrito
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
