import { NextResponse } from "next/server";
import { getDependencies } from "@/lib/dependencies";

export async function GET() {
  try {
    const { waiterRepository } = getDependencies();
    const waiters = await waiterRepository.getActive();

    // Convertimos a JSON para no exponer las contraseñas
    const waitersData = waiters.map((w) => w.toJSON());

    return NextResponse.json(waitersData);
  } catch (error) {
    console.error("Error obteniendo meseros:", error);
    return NextResponse.json(
      { error: "Error al obtener meseros" },
      { status: 500 },
    );
  }
}
