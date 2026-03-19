# CLAUDE.md — CoolDesk

## Qué es este proyecto
CoolDesk es un SaaS kanban + IA para equipos pequeños. Brand: AI-LURUS.
Stack: Next.js 14 App Router · Supabase (Auth + DB + Storage + Realtime) · Tailwind CSS · shadcn/ui · TypeScript.

## Antes de tocar cualquier archivo
1. Lee docs/ARCHITECTURE.md
2. Lee docs/CONVENTIONS.md
3. Si vas a modificar la DB, lee docs/DATA_MODEL.md primero

## Reglas de trabajo
- Nunca hagas cambios directos en `supabase/migrations/` si hay migraciones sin aplicar
- Siempre genera tipos de TypeScript desde el schema de Supabase (`npx supabase gen types`)
- Los componentes de UI van en `apps/web/components/ui/` (primitivos shadcn) o `components/[feature]/` (compuestos)
- Server Components por defecto. Client Components solo cuando hay interactividad
- Toda llamada a Supabase desde el servidor usa el cliente con service role; desde el cliente usa el cliente anon con RLS
- Los endpoints de IA usan Route Handlers en `/app/api/ai/`
- Nunca hardcodees secrets. Usa `.env.local` y valida con zod en `lib/env.ts`

## Colores de marca
- Primario (naranja): #F97316
- Fondo beige: #EDE8E0
- Texto oscuro: #1C1917
- Violeta IA: #7C5CFC
- Blanco: #FFFFFF
- Font: Inter

## Modelo de negocio
Freemium: Free · Pro ($12/usr/mes) · Business ($25/usr/mes) · Enterprise
La IA solo está disponible en Pro y Business. Aplica límites en middleware.

## Sprints
- Sprint 1 (sem 1–2): Auth + Onboarding
- Sprint 2 (sem 3–4): Tablero Kanban
- Sprint 3 (sem 5–6): Vistas + Búsqueda + Notificaciones
- Sprint 4 (sem 7–8): Asistente IA + Config + Billing UI
- Sprint 5 (sem 9): QA + Launch

## Contacto del PRD
Si tienes dudas de producto, lee docs/PRD.md. No inventes features.
