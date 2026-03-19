# Arquitectura de CoolDesk

## Decisión: Monorepo con un solo repo

**Stack final:**
- Frontend + Backend: Next.js 14 App Router (monolito full-stack)
- Base de datos: Supabase (PostgreSQL gestionado)
- Auth: Supabase Auth (email/password + 2FA con TOTP)
- Storage: Supabase Storage (avatares, adjuntos de tareas)
- Realtime: Supabase Realtime (WebSockets para tablero kanban)
- UI: Tailwind CSS + shadcn/ui
- Deploy: Vercel (frontend/API) + Supabase Cloud (DB)
- IA: Anthropic Claude API (producción) / Ollama (desarrollo local)
- Email: Resend (transaccional)

## Por qué NO repos separados FE/BE

CoolDesk es un proyecto SaaS en etapa MVP lanzado por un equipo pequeño o solo.
Separar repos solo tiene sentido cuando:
- Hay equipos distintos trabajando en FE y BE en paralelo
- El BE necesita escalar independientemente del FE (no aplica con Supabase manejando DB/Auth)
- Se consume la API desde múltiples clientes (móvil nativo, terceros) — diferido a v2

Con Next.js App Router, los Route Handlers son el "backend" y viven en el mismo repo.
Supabase maneja el 80% del trabajo de backend (auth, DB, storage, realtime, RLS).
Costo de operación y complejidad de CI/CD se reduce significativamente.

**Revisitar en v2** si: se agrega app móvil nativa o se necesita un worker independiente para IA.

## Por qué Supabase (y no Neon + Express separado)

| Criterio | Supabase | Neon + Express propio |
|---|---|---|
| Auth completo (2FA, magic link, OAuth) | ✅ incluido | ❌ hay que construirlo |
| Realtime / WebSockets | ✅ incluido | ❌ hay que construirlo |
| Storage de archivos | ✅ incluido | ❌ R2/S3 aparte |
| RLS (seguridad a nivel fila) | ✅ nativo | Manual |
| Costo MVP | $0–25/mes | $0 DB + infra propia |
| Velocidad de desarrollo | Alta | Media-baja |
| Escalabilidad | Buena hasta ~10k usuarios concurrentes | Muy alta |

**Veredicto**: Supabase gana en calidad/precio para MVP y primeros 12–18 meses.
Migrar a Neon + BE propio solo si: costos de Supabase superan $500/mes O se necesita lógica de servidor compleja que no cabe en Edge Functions.

## Flujo de datos

```
Browser
  └─► Next.js App Router (Vercel)
        ├─► Server Components → Supabase (service role, sin RLS)
        ├─► Client Components → Supabase JS (anon key, con RLS)
        ├─► Route Handlers /api/ai/* → Anthropic API
        └─► Supabase Realtime (WebSocket directo desde el cliente)
```

## Estructura del monorepo

```
cooldesk/
├── apps/
│   └── web/                     ← Next.js 14+ App Router
│       ├── app/
│       │   ├── (auth)/          ← rutas de autenticación
│       │   ├── (app)/           ← rutas protegidas
│       │   └── api/ai/          ← Route Handlers de IA
│       ├── components/
│       ├── lib/
│       ├── hooks/
│       └── types/
├── packages/
│   └── db/                      ← tipos generados de Supabase, helpers
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── .env.example
```

## Plan de costos estimado (producción, 100 usuarios activos)

| Servicio | Plan | Costo/mes |
|---|---|---|
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| Anthropic Claude API | Pay-per-use (~$0.01/msg × 300 msg/día) | ~$90 |
| Resend | Free (3k emails/mes) | $0 |
| **Total** | | **~$135/mes** |

Punto de equilibrio: 12 usuarios en plan Pro ($12/usr) cubren la infra.

## Decisiones de IA

- **Desarrollo local**: Ollama (modelos locales, sin costo, sin latencia de red)
- **Producción**: Anthropic Claude API (calidad superior para sugerencias y chat)
- El cliente se configura vía variable de entorno `AI_PROVIDER=anthropic|ollama`

## Seguridad

- RLS habilitado en todas las tablas
- Service Role Key NUNCA expuesta al cliente
- Validación de env vars con zod al inicio
- Middleware verifica sesión en todas las rutas `(app)/`
- Cuotas de IA verificadas en middleware antes de llamar a la API
