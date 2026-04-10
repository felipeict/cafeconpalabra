import { NextRequest, NextResponse } from "next/server";
import { getDependencies } from "@/lib/dependencies";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const { getDonationsUseCase } = getDependencies();
    const donations = await getDonationsUseCase.execute(startDate, endDate);

    return NextResponse.json(donations);
  } catch (error) {
    console.error("Error obteniendo donaciones:", error);
    return NextResponse.json(
      { error: "Error al obtener donaciones" },
      { status: 500 },
    );
  }
}
