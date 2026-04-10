import { getDependencies } from "@/lib/dependencies";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener órdenes pendientes
export async function GET() {
  try {
    const { getOrdersUseCase } = getDependencies();
    const pendingOrders = await getOrdersUseCase.getPendingOrders();

    return NextResponse.json(pendingOrders);
  } catch (error) {
    console.error("Error obteniendo órdenes pendientes:", error);
    return NextResponse.json(
      { error: "Error al obtener las órdenes pendientes" },
      { status: 500 },
    );
  }
}
