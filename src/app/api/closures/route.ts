import { getDependencies } from "@/lib/dependencies";
import { NextRequest, NextResponse } from "next/server";

// POST - Crear cierre diario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fecha,
      totalEfectivo,
      totalTransferencias,
      responsable,
      responsableId,
      notas,
    } = body;

    if (!fecha) {
      return NextResponse.json(
        { error: "La fecha es requerida" },
        { status: 400 },
      );
    }

    if (totalEfectivo === undefined || totalTransferencias === undefined) {
      return NextResponse.json(
        { error: "Los totales de efectivo y transferencias son requeridos" },
        { status: 400 },
      );
    }

    if (!responsable || !responsableId) {
      return NextResponse.json(
        { error: "Información del responsable es requerida" },
        { status: 400 },
      );
    }

    const { createDailyClosureUseCase } = getDependencies();
    const closure = await createDailyClosureUseCase.execute({
      fecha,
      totalEfectivo: parseFloat(totalEfectivo),
      totalTransferencias: parseFloat(totalTransferencias),
      responsable,
      responsableId,
      notas,
    });

    return NextResponse.json(closure, { status: 201 });
  } catch (error) {
    console.error("Error creando cierre diario:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error al crear el cierre";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
