import { getDependencies } from "@/lib/dependencies";
import { NextRequest, NextResponse } from "next/server";

// POST - Crear nueva orden
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { garzonId, garzonNombre, numeroMesa, items, notas } = body;

    if (!garzonId || !garzonNombre) {
      return NextResponse.json(
        { error: "Información del garzón es requerida" },
        { status: 400 },
      );
    }

    if (!numeroMesa) {
      return NextResponse.json(
        { error: "El número de mesa es requerido" },
        { status: 400 },
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "El pedido debe tener al menos un item" },
        { status: 400 },
      );
    }

    const { createOrderUseCase } = getDependencies();
    const order = await createOrderUseCase.execute({
      garzonId,
      garzonNombre,
      numeroMesa,
      items,
      notas,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creando orden:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error al crear la orden";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// GET - Obtener órdenes (opcionalmente por fecha)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fecha = searchParams.get("fecha");

    const { getOrdersUseCase } = getDependencies();

    let orders;
    if (fecha === "today") {
      orders = await getOrdersUseCase.getTodayOrders();
    } else if (fecha) {
      orders = await getOrdersUseCase.execute(fecha);
    } else {
      orders = await getOrdersUseCase.execute();
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error obteniendo órdenes:", error);
    return NextResponse.json(
      { error: "Error al obtener las órdenes" },
      { status: 500 },
    );
  }
}
