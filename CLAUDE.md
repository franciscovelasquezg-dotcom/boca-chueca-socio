# CLAUDE.md — Boca Chueca Socio

## Stack
Vite + React 19 + TypeScript + Tailwind CSS v4 + Supabase + Zustand + Vercel

## Contexto
Portal para socios de La Tapería Boca Chueca. Permite ver consumos, hacer reservas y acceder a beneficios exclusivos. Acceso con partner key (sin registro tradicional).

## Estructura
```
src/
  components/
    layout/     → navbar, footer
    ui/         → componentes base reutilizables
  hooks/        → custom hooks
  lib/
    schemas.ts  → schemas Zod (login socio, reserva, pedido)
  pages/        → páginas del portal socio
  store/        → estado global Zustand
  types/        → tipos globales
```

## Reglas
- Supabase como único backend (RLS activado en todas las tablas)
- Autenticación por `VITE_PARTNER_KEY` (sin Supabase Auth)
- Formularios con React Hook Form + Zod (`src/lib/schemas.ts`)
- Estado global con Zustand
- Tailwind v4 con `@tailwindcss/vite` — sin tailwind.config.ts
- Puerto de dev: 5174 (distinto al admin en 5173)

## Paleta
Dark gastronómico — primary: `#eac349` (dorado), secondary: `#ffb4aa` (coral), background: `#131313`

## Deploy
Vercel — rama `master`
