import { NextResponse } from "next/server";
import { getDependencies } from "@/lib/dependencies";

export async function GET() {
  try {
    const { cashierRepository } = getDependencies();
    const cashiers = await cashierRepository.getAll();

    // Convertimos a JSON para no exponer las contraseñas
    const cashiersData = cashiers.map((c) => c.toJSON());

    return NextResponse.json(cashiersData);
  } catch (error) {
    console.error("Error obteniendo cajeros:", error);
    return NextResponse.json(
      { error: "Error al obtener cajeros" },
      { status: 500 },
    );
  }
}
