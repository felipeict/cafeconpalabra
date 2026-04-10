import { getDependencies } from "@/lib/dependencies";
import { NextRequest, NextResponse } from "next/server";

// PATCH - Actualizar estado de una orden
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { estado } = body;

    if (!estado) {
      return NextResponse.json(
        { error: "El estado es requerido" },
        { status: 400 },
      );
    }

    const validStates = [
      "pendiente",
      "en-preparacion",
      "listo",
      "entregado",
      "cancelado",
    ];
    if (!validStates.includes(estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const { updateOrderStatusUseCase } = getDependencies();
    await updateOrderStatusUseCase.execute(id, estado);

    return NextResponse.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error actualizando estado de orden:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error al actualizar el estado";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
