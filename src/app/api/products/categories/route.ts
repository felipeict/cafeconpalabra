import { NextResponse } from "next/server";
import { getDependencies } from "@/lib/dependencies";

export async function GET() {
  try {
    const { getProductsUseCase } = getDependencies();
    const categories = await getProductsUseCase.getCategories();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 },
    );
  }
}
