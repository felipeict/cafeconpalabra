"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Badge } from "@/components/common/Badge";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  LogOut,
} from "lucide-react";

interface DailySummary {
  fecha: string;
  ordenesPendientes: any[];
  ordenesEntregadas: any[];
  ordenesCanceladas: any[];
  totalOrdenes: number;
  cierre?: {
    totalEfectivo: number;
    totalTransferencias: number;
    totalGeneral: number;
    cantidadOrdenes: number;
    responsable: string;
    horaCierre: string;
  };
  tieneCierre: boolean;
}

export default function ClosurePage() {
  const router = useRouter();
  const { waiter, isAuthenticated, logout } = useAuthStore();

  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [totalEfectivo, setTotalEfectivo] = useState("");
  const [totalTransferencias, setTotalTransferencias] = useState("");
  const [notas, setNotas] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?returnUrl=/closure");
      return;
    }
    fetchSummary();
  }, [isAuthenticated, router]);

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/summary");

      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      } else {
        setError("Error al cargar el resumen");
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitClosure = async () => {
    const efectivo = parseFloat(totalEfectivo);
    const transferencias = parseFloat(totalTransferencias);

    if (isNaN(efectivo) || efectivo < 0) {
      setError("Ingresa un monto válido para efectivo");
      return;
    }

    if (isNaN(transferencias) || transferencias < 0) {
      setError("Ingresa un monto válido para transferencias");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch("/api/closures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fecha: new Date().toISOString().split("T")[0],
          totalEfectivo: efectivo,
          totalTransferencias: transferencias,
          responsable: waiter?.nombre,
          responsableId: waiter?.id,
          notas: notas || undefined,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        fetchSummary();
        // Reset form
        setTotalEfectivo("");
        setTotalTransferencias("");
        setNotas("");
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al crear el cierre");
      }
    } catch (err) {
      console.error("Error creating closure:", err);
      setError("Error al conectar con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalGeneral =
    (parseFloat(totalEfectivo) || 0) + (parseFloat(totalTransferencias) || 0);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-6">
      {/* Header */}
      <header className="bg-primary-600 text-white sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold mb-1">Cierre del Día</h1>
              <p className="text-sm text-primary-100">
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
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
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando información...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-600 font-medium">
              ¡Cierre creado exitosamente!
            </p>
          </div>
        )}

        {!isLoading && summary && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl shadow-md p-4">
                <p className="text-xs text-gray-600 mb-1">Total Órdenes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {summary.totalOrdenes}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4">
                <p className="text-xs text-gray-600 mb-1">Entregadas</p>
                <p className="text-3xl font-bold text-green-600">
                  {summary.ordenesEntregadas.length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4">
                <p className="text-xs text-gray-600 mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {summary.ordenesPendientes.length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4">
                <p className="text-xs text-gray-600 mb-1">Canceladas</p>
                <p className="text-3xl font-bold text-red-600">
                  {summary.ordenesCanceladas.length}
                </p>
              </div>
            </div>

            {/* Pending Orders Warning */}
            {summary.ordenesPendientes.length > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-medium">
                    Hay {summary.ordenesPendientes.length} órdenes pendientes
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Considera marcarlas como entregadas o canceladas antes del
                    cierre
                  </p>
                </div>
              </div>
            )}

            {/* Existing Closure */}
            {summary.tieneCierre && summary.cierre && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-green-900">
                    Cierre Ya Realizado
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Efectivo:</span>
                    <span className="font-bold text-gray-900">
                      ${summary.cierre.totalEfectivo.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Transferencias:</span>
                    <span className="font-bold text-gray-900">
                      ${summary.cierre.totalTransferencias.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-green-300">
                    <span className="text-green-900 font-semibold">
                      Total General:
                    </span>
                    <span className="font-bold text-2xl text-green-900">
                      ${summary.cierre.totalGeneral.toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-green-200 text-sm text-gray-700">
                    <p>Responsable: {summary.cierre.responsable}</p>
                    <p>Hora: {summary.cierre.horaCierre}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Closure Form */}
            {!summary.tieneCierre && (
              <div className="bg-white rounded-xl shadow-md">
                <div className="bg-primary-600 text-white px-4 py-3 rounded-t-xl">
                  <h3 className="font-bold text-lg">Realizar Cierre</h3>
                  <p className="text-xs text-primary-100">
                    Ingresa los totales recibidos en el día
                  </p>
                </div>

                <div className="p-4 space-y-4">
                  {/* Efectivo */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4" />
                      Total en Efectivo
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={totalEfectivo}
                      onChange={(e) => setTotalEfectivo(e.target.value)}
                      className="text-lg"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Transferencias */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <CreditCard className="w-4 h-4" />
                      Total en Transferencias
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={totalTransferencias}
                      onChange={(e) => setTotalTransferencias(e.target.value)}
                      className="text-lg"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Total */}
                  <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Total General:
                      </span>
                      <span className="text-2xl font-bold text-primary-600">
                        ${totalGeneral.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Notas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas (opcional)
                    </label>
                    <textarea
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      placeholder="Observaciones del día..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    fullWidth
                    onClick={handleSubmitClosure}
                    disabled={
                      isSubmitting || !totalEfectivo || !totalTransferencias
                    }
                    isLoading={isSubmitting}
                    className="py-4 text-lg"
                  >
                    {isSubmitting ? "Guardando..." : "Confirmar Cierre del Día"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Solo se puede realizar un cierre por día
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
