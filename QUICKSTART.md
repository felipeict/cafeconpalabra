# 🚀 Quick Start Guide

## Setup rápido en 5 pasos

### 1️⃣ Instalar dependencias

```bash
npm install
```

### 2️⃣ Configurar Google Sheets

- Crea un Google Sheet con 4 pestañas: Productos, Cajeros, Transacciones, Donaciones
- Crea una Service Account en Google Cloud
- Habilita Google Sheets API
- Comparte el Sheet con el email de la Service Account

### 3️⃣ Configurar variables de entorno

```bash
cp .env.example .env
# Edita .env con tus credenciales
```

### 4️⃣ Ejecutar en desarrollo

```bash
npm run dev
```

### 5️⃣ Deploy en Vercel

```bash
# Opción 1: CLI
npm i -g vercel
vercel --prod

# Opción 2: GitHub
# Sube a GitHub y conecta con Vercel
```

## 📝 Credenciales de prueba

Usuario: `juan` / Password: `1234`

## 🔗 Links útiles

- [Documentación completa](./README.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Google Cloud Console](https://console.cloud.google.com)

## ⚠️ Importante

- Las variables de entorno deben configurarse tanto en local (.env) como en Vercel
- La GOOGLE_PRIVATE_KEY debe incluir las comillas dobles y los `\n`
- Asegúrate de compartir el Google Sheet con el Service Account email
