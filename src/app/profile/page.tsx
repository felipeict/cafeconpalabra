"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/common/Button";
import { Avatar } from "@/components/common/Avatar";
import { User, LogOut, Calendar, Clock, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

interface WaiterStats {
  ordenesHoy: number;
  ordenesTotales: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { waiter, isAuthenticated, logout } = useAuthStore();
  const [stats, setStats] = useState<WaiterStats | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    // In a real app, fetch waiter stats from API
    // For now, just set mock data
    setStats({
      ordenesHoy: 0,
      ordenesTotales: 0,
    });
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    if (confirm("¿Estás seguro que deseas cerrar sesión?")) {
      logout();
      router.push("/login");
    }
  };

  if (!isAuthenticated || !waiter) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Header */}
      <header className="bg-primary-600 text-white p-6">
        <h1 className="text-xl font-bold mb-1">Mi Perfil</h1>
        <p className="text-sm text-primary-100">Información de tu cuenta</p>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="mb-3 ring-4 ring-primary-100 rounded-full">
              <Avatar name={waiter.nombre} size="lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {waiter.nombre}
            </h2>
            <p className="text-sm text-gray-600">@{waiter.usuario}</p>
            <span className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Activo
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-xs text-gray-600">Usuario</p>
                <p className="font-medium text-gray-900">{waiter.usuario}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-xs text-gray-600">Fecha de Hoy</p>
                <p className="font-medium text-gray-900">
                  {new Date().toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-xs text-gray-600">Sesión Iniciada</p>
                <p className="font-medium text-gray-900">
                  {new Date().toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card (Optional) */}
        {stats && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary-600" />
              Mis Estadísticas
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <p className="text-3xl font-bold text-primary-600">
                  {stats.ordenesHoy}
                </p>
                <p className="text-sm text-gray-600 mt-1">Órdenes Hoy</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {stats.ordenesTotales}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Órdenes</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Estadísticas desde el inicio de la cuenta
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
          <h3 className="font-bold text-gray-900 mb-4">Acciones</h3>

          <Button
            fullWidth
            variant="outline"
            onClick={() => router.push("/pos")}
          >
            Ir a Toma de Pedidos
          </Button>

          <Button
            fullWidth
            variant="outline"
            onClick={() => router.push("/orders")}
          >
            Ver Órdenes
          </Button>

          <Button
            fullWidth
            variant="outline"
            onClick={() => router.push("/closure")}
          >
            Cierre del Día
          </Button>
        </div>

        {/* Logout Button */}
        <Button
          fullWidth
          variant="outline"
          onClick={handleLogout}
          className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Cerrar Sesión
        </Button>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>Café con Palabra</p>
          <p className="text-xs">Sistema de Gestión · v1.0</p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
