# 🍳 Vista de Cocina - Kitchen Display System (KDS)

## ✅ Implementado

### **Resumen**

Vista especializada para el personal de cocina que muestra todas las órdenes activas en tiempo real, con temporizador visual, estados de preparación y agrupación inteligente.

---

## 🎯 Características Implementadas

### **1. Temporizador Visual en Tiempo Real** ⏱️

- Cada tarjeta muestra el tiempo transcurrido desde que se creó la orden
- Actualización automática cada minuto
- **Colores según urgencia:**
  - 🟢 **Verde** (<5 minutos): Orden reciente, tiempo normal
  - 🟡 **Amarillo** (5-10 minutos): Atención, llevan ya un tiempo
  - 🔴 **Rojo** (>10 minutos): ¡Urgente! Tiempo excedido

### **2. Estados de Preparación** 🔄

**Flujo completo:**

1. **Pendiente** (amarillo) → Orden recién llegada
2. **En Preparación** (azul) → Alguien ya la tomó
3. **Listo** (verde) → Listo para que el mesero lo entregue
4. **Entregado** (verde) → Mesero confirmó entrega (se oculta de cocina)
5. **Cancelado** (rojo) → Orden cancelada (se oculta de cocina)

**Botones de cambio rápido:**

- **Pendiente** → Botón: "Iniciar Preparación" (azul)
- **En Preparación** → Botón: "Marcar Listo" (verde)
- **Listo** → Botón: "Marcar Entregado" (primary)
- **Pendiente** → Botón adicional: Cancelar (rojo, solo en pendientes)

### **3. Agrupación Inteligente** 📊

**Tres modos de vista:**

#### **a) Todas (sin agrupar)**

- Lista simple de todas las órdenes activas
- Ordenadas cronológicamente
- Ideal para cocinas pequeñas o poco movimiento

#### **b) Por Mesa**

- Agrupa órdenes de la misma mesa
- Útil cuando hay órdenes separadas para la misma mesa
- Facilita preparar todo junto para una mesa
- Ejemplo: "Mesa 5 (2 órdenes)"

#### **c) Por Categoría**

- Agrupa por tipo de item (Cafetería, Comida Dulce, Comida Salada)
- Útil para cocinas con estaciones especializadas
- Permite que el barista vea solo bebidas, pastelero solo dulces, etc.
- **Importante:** Una orden puede aparecer en múltiples categorías si tiene items mixtos

### **4. Vista Tipo "Tickets de Cocina"** 🎫

**Diseño optimizado para lectura:**

- **Número de mesa gigante** (4xl, bold) - fácil de ver desde lejos
- **Cantidades grandes** (2xl) - sin errores en preparación
- **Colores por estado** - borde de la tarjeta cambia de color
- **Notas destacadas** - fondo amarillo para notas especiales
- **Items agrupados** - fondo gris claro para cada item
- **Hora de creación** - al pie de cada tarjeta

### **5. Notificaciones Visuales y Sonido** 🔔

**Sistema de alertas:**

- **Detección automática** de nuevas órdenes (cada 10 segundos)
- **Banner amarillo parpadeante** cuando llegan nuevas órdenes
- **Contador** de cuántas órdenes nuevas llegaron
- **Sonido opcional** (botón de toggle en header)
  - Tono simple de 800Hz, 0.2 segundos
  - Se puede activar/desactivar según preferencia
- **Auto-ocultar** el banner después de 5 segundos

**Ejemplo de notificación:**

```
🔔 3 Nuevas Órdenes!
```

### **6. Auto-Refresh Inteligente** 🔄

**Actualización automática:**

- **Cada 10 segundos** actualiza órdenes en segundo plano
- No requiere recargar la página
- Mantiene scroll position del usuario
- Indicador visual de refresh en el botón
- **Detección de cambios** - solo notifica si hay órdenes realmente nuevas

**Refresh manual:**

- Botón grande en el header
- Animación de spin mientras carga
- Se deshabilita temporalmente mientras actualiza

### **7. Modo Tablet/Desktop Optimizado** 📱💻

**Grid responsive:**

- **Mobile** (< 768px): 1 columna - pantalla completa
- **Tablet** (768px - 1024px): 2 columnas - lado a lado
- **Desktop** (> 1024px): 3 columnas - visión completa

**Características tablet horizontal:**

- Headers sticky al hacer scroll
- Nombres de grupos sticky (cuando se agrupa)
- Sombras y bordes más pronunciados
- Touch-friendly buttons (mínimo 44x44px)

---

## 🎨 Diseño Visual

### **Header (Fondo oscuro)**

- Gradiente gris oscuro (800-900)
- Texto blanco para contraste
- **Estadísticas en tiempo real:**
  - Pendientes (fondo amarillo transparente)
  - En Preparación (fondo azul transparente)
  - Listos (fondo verde transparente)

### **Tarjetas de Orden**

```
┌─────────────────────────────────────┐
│  [MESA 5]  [Badge: Pendiente]  [⏱️ 3min] │
│  👤 Juan Pérez                        │
├─────────────────────────────────────┤
│  [2x] Capuccino                      │
│       Cafetería                       │
│                                       │
│  [1x] Queque                         │
│       Comida Dulce                    │
│                                       │
│  📝 Nota: Sin azúcar en café         │
├─────────────────────────────────────┤
│  [Iniciar Preparación] [X]           │
│  Orden creada a las 14:30            │
└─────────────────────────────────────┘
```

### **Colores de Estado**

| Estado         | Color Borde                    | Color Badge | Descripción              |
| -------------- | ------------------------------ | ----------- | ------------------------ |
| Pendiente      | Amarillo (`border-yellow-300`) | Amarillo    | Nueva orden              |
| En Preparación | Azul (`border-blue-400`)       | Azul        | Alguien la está haciendo |
| Listo          | Verde (`border-green-400`)     | Verde       | Listo para entregar      |

---

## 📱 Ruta y Navegación

### **URL:** `/kitchen`

**Acceso:**

- Disponible desde cualquier navegador
- No requiere BottomNav (es vista independiente)
- Pensada para tablet/pantalla fija en cocina
- Requiere autenticación de mesero (reutiliza authStore)

**Recomendación de uso:**

- Tablet o monitor en la cocina
- Modo landscape (horizontal) para mejor aprovechamiento
- Configurar sonido según preferencia del equipo
- Dejar abierta todo el día, se actualiza sola

---

## 🔧 Componentes Creados

### **1. KitchenOrderCard.tsx**

`src/components/kitchen/KitchenOrderCard.tsx`

**Props:**

```typescript
interface KitchenOrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}
```

**Características:**

- Temporizador interno con `useEffect`
- Cálculo de tiempo transcurrido en tiempo real
- Colores dinámicos según tiempo
- Botones contextuales según estado
- Oculta automáticamente órdenes entregadas/canceladas

### **2. Página Kitchen**

`src/app/kitchen/page.tsx`

**Estado local:**

```typescript
- orders: Order[] - Lista de órdenes activas
- groupBy: "none" | "mesa" | "categoria" - Modo de agrupación
- soundEnabled: boolean - Si el sonido está activo
- newOrdersCount: number - Contador de nuevas órdenes
- isRefreshing: boolean - Si está actualizando
```

**Funciones principales:**

- `fetchOrders(isAutoRefresh)` - Obtiene órdenes del servidor
- `playNotificationSound()` - Reproduce sonido de alerta
- `handleStatusChange()` - Actualiza estado de orden
- `getGroupedOrders()` - Agrupa órdenes según modo seleccionado

---

## 📊 Integración con Backend

### **Endpoints usados:**

```
GET /api/orders?fecha=today
```

- Obtiene todas las órdenes del día
- Frontend filtra activas (no entregadas/canceladas)

```
PATCH /api/orders/[id]
Body: { estado: "en-preparacion" | "listo" | "entregado" | "cancelado" }
```

- Actualiza estado de una orden
- Validado por `UpdateOrderStatusUseCase`

---

## 🎯 Flujo de Trabajo Típico

### **Escenario: Mañana en la cocina**

1. **8:00 AM** - Equipo de cocina llega
   - Abre `/kitchen` en tablet
   - Activa sonido de notificaciones
   - Pantalla muestra: "No hay órdenes pendientes"

2. **8:15 AM** - Primera orden llega
   - 🔔 **Suena alerta**
   - Banner: "1 Nueva Orden!"
   - Tarjeta aparece: Mesa 3, 1x Capuccino
   - Temporizador: 🟢 0 minutos

3. **Barista toma la orden**
   - Click en "Iniciar Preparación"
   - Tarjeta se pone azul (En Preparación)
   - Desaparece de la vista de "Pendientes"

4. **8:17 AM** - Capuccino listo
   - Click en "Marcar Listo"
   - Tarjeta se pone verde (Listo)
   - Mesero ve en su vista que está listo

5. **8:18 AM** - Mesero entrega
   - Mesero marca "Entregado" desde su app
   - Tarjeta **desaparece** de vista de cocina
   - Ya no molesta al equipo

6. **9:00 AM** - Rush matutino
   - 5 órdenes pendientes
   - Vista por categoría activa
   - Barista ve solo bebidas
   - Pastelero ve solo dulces
   - Cada uno trabaja su sección

---

## 🚀 Ventajas del Sistema

✅ **Sin papel** - Adiós tickets impresos  
✅ **Actualización en vivo** - No más gritar "¿está lista la mesa 5?"  
✅ **Priorización visual** - Colores indican urgencia  
✅ **Menos errores** - Números grandes, fáciles de leer  
✅ **Coordinación** - Todos ven el mismo estado  
✅ **Trazabilidad** - Se sabe quién hizo cada orden (garzonNombre)  
✅ **Personalización** - Notas especiales destacadas  
✅ **Escalable** - Funciona igual con 2 o 20 órdenes

---

## 📈 Próximas Mejoras (Futuro)

🔮 **V2.0 - Potenciales mejoras:**

- Filtro por mesero (ver solo órdenes de Juan)
- Estadísticas de tiempo promedio
- Modo "Solo mi estación" (Barista, Pastelero, etc.)
- Printer API para ticket backup opcional
- Vista split-screen (2 categorías simultáneas)
- Notificaciones push en móvil
- Historial de órdenes completadas del día
- Métricas de rendimiento (items/hora)

---

## 🎨 Personalización Visual

Para cambiar el diseño según preferencias de la cocina:

**Colores del header:**

```tsx
// Archivo: src/app/kitchen/page.tsx
className = "bg-gradient-to-r from-gray-800 to-gray-900";
```

**Colores de urgencia:**

```tsx
// Archivo: src/components/kitchen/KitchenOrderCard.tsx
const getTimeColor = () => {
  if (elapsedTime < 5) return "text-green-600 bg-green-50"; // 🟢
  if (elapsedTime < 10) return "text-yellow-600 bg-yellow-50"; // 🟡
  return "text-red-600 bg-red-50"; // 🔴
};
```

**Grid columns:**

```tsx
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
// Cambiar lg:grid-cols-3 a lg:grid-cols-4 para 4 columnas en desktop grande
```

---

## 💡 Tips de Uso

1. **Pantalla dedicada**: Usa una tablet vieja como display fijo en cocina
2. **Modo landscape**: Rota la tablet horizontal para ver más órdenes
3. **Brillo alto**: Configura brillo al máximo para ver en ambiente iluminado
4. **No cerrar pestaña**: Déjala abierta, se actualiza sola
5. **Sonido moderado**: Si hay mucho ruido, tal vez quieras desactivarlo
6. **Agrupación dinámica**: Cambia según el momento del día (rush vs calma)

---

**Última actualización:** 10 de Abril, 2026  
**Versión:** 1.0  
**Estado:** ✅ Producción
