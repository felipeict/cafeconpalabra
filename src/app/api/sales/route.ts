import { NextRequest, NextResponse } from "next/server";
import { getDependencies } from "@/lib/dependencies";
import type { TransactionItem } from "@/lib/domain/entities/Transaction";

interface ProcessSaleRequest {
  cajeroId: string;
  items: TransactionItem[];
  metodoPago: "efectivo" | "tarjeta" | "transferencia";
}

export async function POST(request: NextRequest) {
  try {
    const body: ProcessSaleRequest = await request.json();
    const { cajeroId, items, metodoPago } = body;

    if (!cajeroId || !items || !metodoPago) {
      return NextResponse.json(
        { error: "Datos incompletos para procesar la venta" },
        { status: 400 },
      );
    }

    const { processSaleUseCase } = getDependencies();
    const transaction = await processSaleUseCase.execute(
      cajeroId,
      items,
      metodoPago,
    );

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error procesando venta:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error al procesar venta";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
