# Arquitectura de CoolDesk

## Decisión: Monorepo con un solo repo

**Stack final:**
- Frontend + Backend: Next.js App Router (monolito full-stack)
- Base de datos: Neon (PostgreSQL serverless) + Prisma ORM
- Auth: Better Auth (email/password + 2FA con TOTP)
- Storage: Vercel Blob o similar
- Realtime: WebSockets (opcional v2)
- UI: Tailwind CSS + shadcn/ui
- Deploy: Vercel (frontend/API) + Neon (DB)
- IA: Anthropic Claude API (producción) / Ollama (desarrollo local)
- Email: Resend (transaccional)

## Por qué NO repos separados FE/BE

CoolDesk es un proyecto SaaS en etapa MVP lanzado por un equipo pequeño o solo.
Separar repos solo tiene sentido cuando:
- Hay equipos distintos trabajando en FE y BE en paralelo
- El BE necesita escalar independientemente del FE
- Se consume la API desde múltiples clientes (móvil nativo, terceros) — diferido a v2

Con Next.js App Router, los Route Handlers son el "backend" y viven en el mismo repo.
Servicios como Better Auth y Neon Postgres ayudan a simplificar la infraestructura.
Costo de operación y complejidad de CI/CD se reduce significativamente.

**Revisitar en v2** si: se agrega app móvil nativa o se necesita un worker independiente para IA.

## Arquitectura de Backend

Se ha optado por Neon (Serverless Postgres) junto con Prisma ORM por su flexibilidad y tipado estricto, acompañado de Better Auth para el manejo robusto de identidades.

## Flujo de datos

```
Browser
  └─► Next.js App Router (Vercel)
        ├─► Server Components → Prisma
        ├─► Client Components → API Routes / Server Actions
        ├─► Route Handlers /api/ai/* → Anthropic API
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
│   └── db/                      ← schema de Prisma, types
└── .env.example
```

## Plan de costos estimado (producción, 100 usuarios activos)

| Servicio | Plan | Costo/mes |
|---|---|---|
| Vercel | Pro | $20 |
| Neon Postgres | Pro | $0-$20 |
| Anthropic Claude API | Pay-per-use (~$0.01/msg × 300 msg/día) | ~$90 |
| Resend | Free (3k emails/mes) | $0 |
| **Total** | | **~$135/mes** |

Punto de equilibrio: 12 usuarios en plan Pro ($12/usr) cubren la infra.

## Decisiones de IA

- **Desarrollo local**: Ollama (modelos locales, sin costo, sin latencia de red)
- **Producción**: Anthropic Claude API (calidad superior para sugerencias y chat)
- El cliente se configura vía variable de entorno `AI_PROVIDER=anthropic|ollama`

## Seguridad

- Validación de permisos en servidor
- Validación de env vars con zod al inicio
- Middleware verifica sesión en todas las rutas `(app)/`
- Cuotas de IA verificadas en middleware antes de llamar a la API
