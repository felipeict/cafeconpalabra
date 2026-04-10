"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Avatar } from "@/components/common/Avatar";

interface Waiter {
  id: string;
  nombre: string;
  usuario: string;
  activo: boolean;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/pos";
  const { login, isAuthenticated } = useAuthStore();

  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar meseros desde la API
  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/auth/waiters");

        if (response.ok) {
          const data = await response.json();
          setWaiters(data);
        } else {
          setError("Error al cargar los meseros");
        }
      } catch (err) {
        console.error("Error fetching waiters:", err);
        setError("Error al conectar con el servidor");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaiters();
  }, []);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push(returnUrl);
    }
  }, [isAuthenticated, router, returnUrl]);

  const handleWaiterSelect = (waiter: Waiter) => {
    // Login rápido sin contraseña
    login(waiter);
    router.push(returnUrl);
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-300 to-primary-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Logo"
            className="mx-auto mb-4 object-contain"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Café con Palabra
          </h1>
          <p className="text-base md:text-lg text-gray-700 font-light italic">
            Café con sabor a evangelio
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 text-center">
            ¿Quién está atendiendo?
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Selecciona tu nombre para comenzar
          </p>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando meseros...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* Meseros Grid */}
          {!isLoading && !error && (
            <div>
              {waiters.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No hay meseros registrados en el sistema
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Agrega meseros en la hoja "Garzones" de Google Sheets
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                  {waiters.map((waiter) => (
                    <div
                      key={waiter.id}
                      onClick={() => handleWaiterSelect(waiter)}
                      className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md active:scale-95 cursor-pointer"
                    >
                      <Avatar name={waiter.nombre} size="responsive" />
                      <span className="text-sm text-center text-gray-700 font-medium line-clamp-2">
                        {waiter.nombre}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Información adicional */}
        {!isLoading && !error && waiters.length > 0 && (
          <p className="text-center text-sm text-gray-700 mt-4">
            2da Iglesia Alianza Cristiana y Misionera "Dinamarca"
          </p>
        )}
      </div>
    </div>
  );
}

// Wrapper con Suspense para manejar useSearchParams
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-primary-300 to-primary-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-900">Cargando...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
