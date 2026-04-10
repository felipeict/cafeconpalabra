import { getDependencies } from "@/lib/dependencies";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener todos los items del menú disponibles
export async function GET() {
  try {
    const { getAvailableMenuUseCase } = getDependencies();
    const menuData = await getAvailableMenuUseCase.execute();

    return NextResponse.json(menuData);
  } catch (error) {
    console.error("Error obteniendo menú:", error);
    return NextResponse.json(
      { error: "Error al obtener el menú" },
      { status: 500 },
    );
  }
}
