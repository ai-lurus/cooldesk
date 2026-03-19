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
  supabase/
    client.ts       ← cliente browser (anon key)
    server.ts       ← cliente server (service role, solo en Server Components)
    middleware.ts   ← refresh de sesión en middleware.ts raíz
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
  database.types.ts ← generado por supabase gen types (NO editar manualmente)
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
| Env vars públicas | `NEXT_PUBLIC_` prefijo | `NEXT_PUBLIC_SUPABASE_URL` |
| Env vars privadas | SCREAMING_SNAKE_CASE | `SUPABASE_SERVICE_ROLE_KEY` |
| Rutas API | kebab-case | `/api/v1/task-comments` |

## Server vs Client Components

- **Default**: Server Component (sin directiva)
- **Agregar `"use client"`** solo si el componente usa:
  - Hooks de React (`useState`, `useEffect`, `useCallback`, etc.)
  - Eventos del DOM (`onClick`, `onChange`, etc.)
  - Estado local o contexto del cliente
  - WebSockets / Supabase Realtime
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
// Server Component: usa cliente server (service role)
import { createServerClient } from "@/lib/supabase/server"

async function getProjects(workspaceId: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("workspace_id", workspaceId)

  if (error) throw new Error(`Failed to fetch projects: ${error.message}`)
  return data
}

// Client Component: usa cliente browser (anon key + RLS)
import { createBrowserClient } from "@/lib/supabase/client"

function useProjects(workspaceId: string) {
  const supabase = createBrowserClient()
  // usar SWR o React Query para re-fetching
}
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
- **Nunca hacer fetch directo a Supabase desde el cliente** para writes que requieren validación de permisos — siempre pasar por un Route Handler o Server Action

## RLS (Row Level Security)

- **Toda tabla tiene RLS habilitado** — sin excepciones
- El cliente browser **NUNCA** usa service role key
- Revisar policies en `supabase/migrations/` antes de hacer queries nuevos
- El cliente server (service role) bypassa RLS — úsalo solo en Server Components y Route Handlers verificados

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

## Tipos de Supabase

```bash
# Regenerar siempre que cambies el schema
npx supabase gen types typescript --local > apps/web/types/database.types.ts
```

- **NUNCA** editar `database.types.ts` manualmente
- Tipos de dominio adicionales van en `types/app.types.ts`

## Imports

```typescript
// Orden: externos → internos absolutos → relativos
import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { formatDate } from "./utils"
```

## Límites de archivos y funciones

- Archivos: máx 800 líneas (idealmente 200–400)
- Funciones: máx 50 líneas
- Nesting: máx 4 niveles
- Extraer helpers cuando un archivo crece — no monolitos

## Colores y estilos

```typescript
// Usar variables CSS de marca, no valores hardcodeados
const brandColors = {
  primary: "#F97316",   // naranja
  background: "#EDE8E0", // beige
  text: "#1C1917",       // oscuro
  ai: "#7C5CFC",         // violeta IA
  white: "#FFFFFF",
}
```

Configurar en `tailwind.config.ts` como colores extendidos.
