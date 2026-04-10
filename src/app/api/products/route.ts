import { NextRequest, NextResponse } from "next/server";
import { getDependencies } from "@/lib/dependencies";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;

    const { getProductsUseCase } = getDependencies();
    const products = await getProductsUseCase.execute(category);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 },
    );
  }
}
