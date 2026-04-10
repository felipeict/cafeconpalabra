import { getDependencies } from "@/lib/dependencies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 },
      );
    }

    const { loginUseCase } = getDependencies();
    const waiter = await loginUseCase.execute(username, password);

    if (!waiter) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    return NextResponse.json(waiter.toJSON());
  } catch (error) {
    console.error("Error en login:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error al procesar login";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
