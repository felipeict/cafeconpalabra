# ☕ Café con Palabra - Sistema POS

Sistema de punto de venta (POS) para cafetería de iglesia con Google Sheets como base de datos. Todo en un solo proyecto con Next.js.

## 🚀 Tecnologías

- **Framework:** Next.js 15 (App Router)
- **Frontend:** React 19 + TypeScript
- **Backend:** Next.js API Routes
- **Estilos:** Tailwind CSS
- **Estado:** Zustand
- **Base de Datos:** Google Sheets API
- **Deploy:** Vercel

## ✨ Características

- 🔐 Autenticación de cajeros
- 🛒 Sistema de carrito de compras
- 📦 Gestión de inventario en tiempo real
- 💰 Procesamiento de ventas (Efectivo, Tarjeta, Transferencia)
- 📊 Visualización de donaciones
- 🏗️ Arquitectura limpia (Clean Architecture + SOLID)

---

## 📋 Prerequisitos

1. **Node.js 18+** y npm
2. **Cuenta de Google Cloud** con Sheets API habilitada
3. **Service Account** de Google con acceso al spreadsheet

---

## 🔧 Configuración Inicial

### 1. Crear el Google Spreadsheet

Crea un nuevo Google Sheet con **4 pestañas** con estos nombres exactos:

#### 📄 Pestaña "Productos"

| id   | nombre         | categoria         | precio | stock | stock_minimo |
| ---- | -------------- | ----------------- | ------ | ----- | ------------ |
| P001 | Café Americano | Bebidas Calientes | 3.50   | 50    | 10           |
| P002 | Cappuccino     | Bebidas Calientes | 4.00   | 30    | 10           |
| P003 | Jugo Naranja   | Bebidas Frías     | 2.50   | 20    | 5            |

#### 📄 Pestaña "Cajeros"

| id   | nombre      | usuario | password |
| ---- | ----------- | ------- | -------- |
| C001 | Juan Pérez  | juan    | 1234     |
| C002 | María López | maria   | 1234     |

#### 📄 Pestaña "Transacciones"

| id          | fecha      | hora     | cajero | productos           | metodo_pago | total |
| ----------- | ---------- | -------- | ------ | ------------------- | ----------- | ----- |
| TRX-1234567 | 2026-04-09 | 10:30:45 | C001   | [JSON de productos] | efectivo    | 7.50  |

_Nota: La columna `productos` almacena un JSON string con el detalle de los items_

#### 📄 Pestaña "Donaciones"

| fecha      | monto | nombre      |
| ---------- | ----- | ----------- |
| 2026-04-09 | 50.00 | Juan Pérez  |
| 2026-04-08 | 25.00 | María López |

---

### 2. Configurar Google Cloud Service Account

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Sheets API**:
   - Ve a "APIs & Services" > "Enable APIs and Services"
   - Busca "Google Sheets API" y habilítala
4. Crea una **Service Account**:
   - Ve a "IAM & Admin" > "Service Accounts"
   - Click en "Create Service Account"
   - Dale un nombre (ej: `cafe-service-account`)
   - No necesitas asignarle roles
5. Crea una **Key** para la Service Account:
   - Click en la service account creada
   - Ve a la pestaña "Keys"
   - "Add Key" > "Create new key" > "JSON"
   - Descarga el archivo JSON
6. **Comparte el Google Sheet** con el email de la service account:
   - Email ejemplo: `cafe-service-account@proyecto.iam.gserviceaccount.com`
   - Dale permisos de **Editor**

---

### 3. Instalar Dependencias

```bash
cd cafe-nextjs
npm install
```

---

### 4. Configurar Variables de Entorno

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

2. Abre `.env` y completa las variables:

```env
# Email de la Service Account (del archivo JSON descargado)
GOOGLE_SERVICE_ACCOUNT_EMAIL=cafe-service-account@tu-proyecto.iam.gserviceaccount.com

# Private Key (del archivo JSON, campo "private_key")
# IMPORTANTE: Mantén los \n en el string
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n"

# ID del Spreadsheet (de la URL del Google Sheet)
GOOGLE_SPREADSHEET_ID=1AbC123XyZ456...
```

**⚠️ Importante sobre GOOGLE_PRIVATE_KEY:**

- Debe estar entre comillas dobles
- Mantén los `\n` (saltos de línea) tal como vienen en el JSON
- No agregues espacios adicionales

---

## 🏃 Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Credenciales de Prueba

Usa alguno de los cajeros que agregaste en la hoja "Cajeros":

- Usuario: `juan` / Password: `1234`
- Usuario: `maria` / Password: `1234`

---

## 📦 Deploy en Vercel

### Opción 1: Deploy desde GitHub (Recomendado)

1. **Sube tu proyecto a GitHub:**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/cafe-nextjs.git
git push -u origin main
```

2. **Importa en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Add New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es Next.js

3. **Configura las Variables de Entorno:**
   - En la sección "Environment Variables" agrega:
     - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
     - `GOOGLE_PRIVATE_KEY`
     - `GOOGLE_SPREADSHEET_ID`

   ⚠️ **Para GOOGLE_PRIVATE_KEY en Vercel:**
   - Pega el valor completo CON las comillas dobles
   - Ejemplo: `"-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"`

4. **Deploy:**
   - Click en "Deploy"
   - Espera a que termine el build
   - Tu app estará lista en `https://tu-proyecto.vercel.app`

### Opción 2: Deploy desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Cuando te pregunte por las variables de entorno, agrégalas una por una.

---

## 🗂️ Estructura del Proyecto

```
cafe-nextjs/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes (Backend)
│   │   │   ├── auth/
│   │   │   │   └── login/
│   │   │   ├── products/
│   │   │   ├── sales/
│   │   │   └── donations/
│   │   ├── login/                # Página de Login
│   │   ├── pos/                  # Página del POS
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/               # Componentes React
│   │   └── common/
│   │       ├── Avatar.tsx
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   │
│   ├── stores/                   # Zustand stores
│   │   ├── authStore.ts
│   │   └── cartStore.ts
│   │
│   └── lib/                      # Lógica de negocio
│       ├── domain/
│       │   ├── entities/         # Entidades del dominio
│       │   └── repositories/     # Interfaces
│       ├── application/
│       │   └── use-cases/        # Casos de uso
│       ├── infrastructure/
│       │   ├── config/
│       │   │   └── GoogleSheetsClient.ts
│       │   └── repositories/     # Implementaciones
│       └── dependencies.ts        # Inyección de dependencias
│
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env
```

---

## 🔌 API Endpoints

### Auth

- `POST /api/auth/login` - Login de cajero

  ```json
  // Request
  {
    "username": "juan",
    "password": "1234"
  }

  // Response
  {
    "id": "C001",
    "nombre": "Juan Pérez",
    "usuario": "juan"
  }
  ```

### Products

- `GET /api/products` - Obtener todos los productos
- `GET /api/products?category=Bebidas%20Calientes` - Filtrar por categoría
- `GET /api/products/categories` - Obtener lista de categorías

### Sales

- `POST /api/sales` - Procesar una venta
  ```json
  {
    "cajeroId": "C001",
    "items": [
      {
        "productId": "P001",
        "nombre": "Café Americano",
        "cantidad": 2,
        "precioUnitario": 3.5,
        "subtotal": 7.0
      }
    ],
    "metodoPago": "efectivo"
  }
  ```

### Donations

- `GET /api/donations` - Obtener todas las donaciones
- `GET /api/donations/total` - Obtener total de donaciones

---

## 🎨 Personalización

### Cambiar Colores

Edita `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: "#f0fdf4",
        // ... etc
        900: "#14532d",
      },
    },
  },
}
```

### Agregar Logo

Coloca tu logo en `public/logo.png` y actualiza la referencia en la página de login.

---

## 🐛 Troubleshooting

### Error: "Failed to authenticate with Google Sheets API"

- Verifica que el Service Account Email sea correcto
- Asegúrate de que la Private Key esté completa y con `\n`
- Confirma que compartiste el Google Sheet con el email de la service account

### Error: "Module not found: googleapis"

```bash
npm install googleapis
```

### Error en deploy de Vercel

- Revisa los logs en el dashboard de Vercel
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que GOOGLE_PRIVATE_KEY tenga las comillas dobles

### El login no funciona

- Verifica que el cajero exista en la hoja "Cajeros" del Google Sheet
- Confirma que el usuario y contraseña sean correctos
- Revisa la consola del navegador para más detalles

---

## 📝 Próximas Mejoras

- [ ] Componente completo de productos con categorías
- [ ] Sistema de búsqueda de productos
- [ ] Vista de historial de ventas
- [ ] Dashboard con estadísticas
- [ ] Reportes en PDF
- [ ] Modo offline con sincronización

---

## 🤝 Contribuciones

Este proyecto fue creado para la cafetería de la iglesia. Si encuentras bugs o tienes sugerencias, no dudes en crear un issue.

---

## 📄 Licencia

MIT

---

## 📞 Soporte

Si tienes problemas con el setup o deploy, revisa:

1. La documentación de [Next.js](https://nextjs.org/docs)
2. La documentación de [Vercel](https://vercel.com/docs)
3. La [Google Sheets API docs](https://developers.google.com/sheets/api)

---

**¡Disfruta tu café! ☕**
