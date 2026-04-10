import { NextRequest, NextResponse } from "next/server";
import { getDependencies } from "@/lib/dependencies";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const { getDonationsUseCase } = getDependencies();
    const total = await getDonationsUseCase.getTotalDonations(
      startDate,
      endDate,
    );

    return NextResponse.json({ total });
  } catch (error) {
    console.error("Error obteniendo total de donaciones:", error);
    return NextResponse.json(
      { error: "Error al obtener total de donaciones" },
      { status: 500 },
    );
  }
}
