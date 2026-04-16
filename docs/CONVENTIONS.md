# Convenciones de código — CoolDesk

## Estructura de carpetas (apps/web)

```
app/
  (auth)/           ← rutas de autenticación (login, register, etc.)
    login/
    register/
    verify-email/
    forgot-password/
    reset-password/
  (app)/            ← rutas protegidas (requieren sesión)
    dashboard/
    projects/[id]/
    settings/
  api/
    ai/
      chat/route.ts
      suggestions/route.ts
    v1/             ← Route Handlers REST
  layout.tsx
  page.tsx          ← landing/marketing

components/
  ui/               ← primitivos shadcn (Button, Input, etc.) — NO tocar
  layout/           ← Sidebar, Header, AppShell
  kanban/           ← Board, Column, TaskCard, DragOverlay
  tasks/            ← TaskModal, TaskForm, SubtaskList
  ai/               ← AIAssistant, ChatMessage, SuggestionCard
  notifications/
  auth/

lib/
  auth-client.ts    ← cliente Better Auth
  db.ts             ← Prisma client
  ai/
    anthropic.ts    ← cliente Anthropic + helpers
    prompts.ts      ← system prompts y templates
  utils.ts
  env.ts            ← validación de env vars con zod

hooks/
  use-board.ts
  use-tasks.ts
  use-ai-chat.ts
  use-realtime.ts

types/
  app.types.ts      ← tipos de dominio de la app
```

## Naming

| Categoría | Convención | Ejemplo |
|---|---|---|
| Componentes React | PascalCase | `TaskCard.tsx` |
| Hooks | camelCase con prefijo `use-` | `use-tasks.ts` |
| Utilidades | camelCase | `formatDate.ts` |
| Tipos/Interfaces | PascalCase descriptivo | `TaskWithAssignee` |
| Constantes | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE_MB` |
| Env vars públicas | `NEXT_PUBLIC_` prefijo | `NEXT_PUBLIC_APP_URL` |
| Env vars privadas | SCREAMING_SNAKE_CASE | `DATABASE_URL` |
| Rutas API | kebab-case | `/api/v1/task-comments` |

## Server vs Client Components

- **Default**: Server Component (sin directiva)
- **Agregar `"use client"`** solo si el componente usa:
  - Hooks de React (`useState`, `useEffect`, `useCallback`, etc.)
  - Eventos del DOM (`onClick`, `onChange`, etc.)
  - Estado local o contexto del cliente
  - WebSockets
  - APIs del browser (`localStorage`, `window`, etc.)

```tsx
// CORRECTO: Server Component por defecto
export default async function ProjectList() {
  const projects = await fetchProjects() // fetch en el server
  return <ul>{projects.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}

// CORRECTO: Client Component cuando necesita interactividad
"use client"
export function TaskCard({ task }: { task: Task }) {
  const [isOpen, setIsOpen] = useState(false)
  return <div onClick={() => setIsOpen(true)}>...</div>
}
```

## Fetching de datos

```typescript
// Server Component: usando Prisma
import { db } from "@/lib/db"

async function getProjects(workspaceId: string) {
  const projects = await db.project.findMany({
    where: { workspaceId }
  })
  return projects
}

// Client Component
// usar SWR o React Query fetchando desde /api o Server Actions
```

## Manejo de errores

```typescript
// Route Handler: respuesta de error estándar
import { NextResponse } from "next/server"

return NextResponse.json(
  { success: false, error: "Descripción del error", code: "ERROR_CODE" },
  { status: 400 }
)

// Server Action: lanzar error tipado
throw new Error("Mensaje amigable para el usuario")

// Client: toast para errores no bloqueantes
import { toast } from "sonner"
toast.error("No se pudo guardar la tarea")

// Client: página de error para bloqueantes
// → redirigir a /error o mostrar componente de error
```

## Patrones de mutación

- **Preferir Server Actions** para mutaciones simples (forms)
- **Route Handlers** para mutaciones complejas o desde cliente con lógica condicional
- **Validar siempre los permisos en el servidor** — siempre pasar por un Route Handler o Server Action

## Autorización

- Validar permisos en Server Actions y Route Handlers antes de ejecutar mutaciones con Prisma.

## Validación de inputs

```typescript
// Siempre con zod en la frontera del sistema
import { z } from "zod"

const createTaskSchema = z.object({
  title: z.string().min(1).max(500),
  priority: z.enum(["urgent", "high", "medium", "low"]),
  due_date: z.string().date().optional(),
})

// En Route Handler
const parsed = createTaskSchema.safeParse(await req.json())
if (!parsed.success) {
  return NextResponse.json(
    { success: false, error: "Datos inválidos", code: "VALIDATION_ERROR" },
    { status: 400 }
  )
}
```

## Prisma

```bash
# Regenerar siempre que cambies el schema
npx prisma generate
```

- Tipos de dominio adicionales van en `types/app.types.ts`

## Imports

```typescript
// Orden: externos → internos absolutos → relativos
import { z } from "zod"
import { db } from "@/lib/db"
import { formatDate } from "./utils"
```

## Límites de archivos y funciones

- Archivos: máx 800 líneas (idealmente 200–400)
- Funciones: máx 50 líneas
- Nesting: máx 4 niveles
- Extraer helpers cuando un archivo crece — no monolitos

## Colores y estilos

Usar variables CSS de marca definidas en `globals.css`. Evitar valores hardcodeados para mantener consistencia.

| Variable CSS | Uso principal | Ejemplo Tailwind |
|---|---|---|
| `--brand-primary` | Color principal de marca, botones primarios, estados activos. | `text-brand-primary`, `bg-brand-primary` |
| `--brand-primary-hover` | Estado hover para elementos primarios. | `hover:bg-brand-primary-hover` |
| `--brand-background` | Fondo principal de la aplicación (layout). | `bg-brand-background` |
| `--brand-card` | Fondo de tarjetas y contenedores elevados. | `bg-brand-card` |
| `--brand-text` | Color de texto principal para legibilidad máxima. | `text-brand-text` |
| `--brand-text-muted` | Texto de apoyo, placeholders, iconos secundarios. | `text-brand-text-muted` |
| `--brand-border` | Bordes sutiles para divisiones y tarjetas. | `border-brand-border` |
| `--brand-border-muted` | Bordes para inputs y separadores discretos. | `border-brand-border-muted` |
| `--brand-secondary-border`| Bordes para botones secundarios (outline). | `border-brand-secondary-border` |
| `--brand-secondary-hover` | Fondo hover para botones secundarios. | `hover:bg-brand-secondary-hover` |
| `--brand-ai` | Color distintivo para funciones de Inteligencia Artificial. | `text-brand-ai`, `bg-brand-ai` |

Configurar en `app/globals.css` dentro del bloque `@theme inline` para que estén disponibles como clases de utilidad.
