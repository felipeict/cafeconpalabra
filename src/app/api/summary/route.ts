import { getDependencies } from "@/lib/dependencies";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener resumen del día
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fecha = searchParams.get("fecha");

    const { getDailySummaryUseCase } = getDependencies();
    const summary = await getDailySummaryUseCase.execute(fecha || undefined);

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error obteniendo resumen diario:", error);
    return NextResponse.json(
      { error: "Error al obtener el resumen del día" },
      { status: 500 },
    );
  }
}
