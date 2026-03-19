# Modelo de datos — CoolDesk

PostgreSQL gestionado por Supabase. Todas las tablas usan UUID como clave primaria.

## Tablas

### users
Usuarios registrados en la plataforma.

| Columna | Tipo | Notas |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| name | VARCHAR(255) | Nombre completo |
| email | VARCHAR(255) UNIQUE | Email único, índice |
| password_hash | TEXT | Hash bcrypt |
| avatar_url | TEXT NULL | URL de avatar en storage |
| role | VARCHAR(20) | Rol global. Default: user |
| language | VARCHAR(10) | Default: es-MX |
| timezone | VARCHAR(50) | Zona horaria IANA |
| theme | VARCHAR(10) | light \| dark \| system |
| two_factor_enabled | BOOLEAN | Default: false |
| created_at | TIMESTAMPTZ | now() |
| updated_at | TIMESTAMPTZ | Trigger on update |

### workspaces
Espacios de trabajo.

| Columna | Tipo | Notas |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| name | VARCHAR(255) | Nombre del workspace |
| owner_id | UUID FK → users.id | ON DELETE RESTRICT |
| created_at | TIMESTAMPTZ | now() |

### workspace_members
Relación N:M entre workspaces y usuarios.

| Columna | Tipo | Notas |
|---|---|---|
| workspace_id | UUID FK → workspaces.id | PK compuesto |
| user_id | UUID FK → users.id | PK compuesto |
| role | ENUM | owner \| admin \| editor \| viewer |
| invited_at | TIMESTAMPTZ | Fecha de invitación |
| joined_at | TIMESTAMPTZ NULL | NULL si no aceptó |

### projects
Proyectos dentro de un workspace.

| Columna | Tipo | Notas |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| workspace_id | UUID FK → workspaces.id | ON DELETE CASCADE |
| name | VARCHAR(255) | Nombre del proyecto |
| description | TEXT NULL | Descripción opcional |
| color | VARCHAR(7) | Color hex |
| is_archived | BOOLEAN | Default: false |
| created_by | UUID FK → users.id | Creador |
| created_at | TIMESTAMPTZ | now() |

### columns
Columnas del tablero kanban. Fijas en MVP, editables en v2.

| Columna | Tipo | Notas |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| project_id | UUID FK → projects.id | ON DELETE CASCADE |
| name | VARCHAR(100) | Nombre de la columna |
| position | INTEGER | Orden en el tablero |
| color | VARCHAR(7) NULL | Color opcional |
| created_at | TIMESTAMPTZ | now() |

**Columnas fijas MVP:** Sin iniciar (pos 0) · En progreso (pos 1) · Bloqueado (pos 2) · Hecho (pos 3)

### tasks
Tareas asignadas a una columna.

| Columna | Tipo | Notas |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| project_id | UUID FK → projects.id | ON DELETE CASCADE |
| column_id | UUID FK → columns.id | ON DELETE SET NULL |
| title | VARCHAR(500) | Título de la tarea |
| description | TEXT NULL | Descripción con formato |
| priority | ENUM | urgent \| high \| medium \| low |
| assigned_to | UUID FK → users.id NULL | Responsable |
| created_by | UUID FK → users.id | Creador |
| due_date | DATE NULL | Fecha límite |
| position | INTEGER | Orden en columna |
| created_at | TIMESTAMPTZ | now() |
| updated_at | TIMESTAMPTZ | Trigger on update |

### subtasks
Checklist de subtareas dentro de una tarea.

| Columna | Tipo | Notas |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| task_id | UUID FK → tasks.id | ON DELETE CASCADE |
| title | VARCHAR(500) | Texto de la subtarea |
| is_completed | BOOLEAN | Default: false |
| position | INTEGER | Orden en la lista |

### comments
Comentarios en tareas.

| Columna | Tipo | Notas |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| task_id | UUID FK → tasks.id | ON DELETE CASCADE |
| user_id | UUID FK → users.id | Autor |
| content | TEXT | Contenido del comentario |
| created_at | TIMESTAMPTZ | now() |
| updated_at | TIMESTAMPTZ | Trigger on update |

### attachments
Archivos adjuntos. Storage en Supabase.

| Columna | Tipo | Notas |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| task_id | UUID FK → tasks.id | ON DELETE CASCADE |
| user_id | UUID FK → users.id | Quien subió |
| file_name | VARCHAR(255) | Nombre original |
| file_url | TEXT | URL en storage |
| file_size | BIGINT | Tamaño en bytes |
| file_type | VARCHAR(100) | MIME type |
| created_at | TIMESTAMPTZ | now() |

### activity_log
Registro para auditoría y vista Novedades.

| Columna | Tipo | Notas |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| workspace_id | UUID FK → workspaces.id | Índice |
| project_id | UUID FK → projects.id NULL | Índice |
| task_id | UUID FK → tasks.id NULL | Referencia |
| user_id | UUID FK → users.id | Quien realizó la acción |
| action | VARCHAR(100) | ej. task.created, task.moved |
| metadata | JSONB | {from, to, field, ...} |
| created_at | TIMESTAMPTZ | Índice, now() |

**Acciones estándar:** `task.created` · `task.moved` · `task.updated` · `task.deleted` · `task.assigned` · `comment.created` · `attachment.added` · `member.invited` · `member.joined`

### notifications
Notificaciones para los usuarios.

| Columna | Tipo | Notas |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| user_id | UUID FK → users.id | Índice |
| type | VARCHAR(50) | ej. task.assigned |
| title | VARCHAR(255) | Título |
| body | TEXT | Contenido descriptivo |
| reference_id | UUID NULL | ID del objeto referenciado |
| reference_type | VARCHAR(50) NULL | task \| project \| comment |
| is_read | BOOLEAN | Default: false |
| created_at | TIMESTAMPTZ | now() |

### invitations
Invitaciones pendientes a un workspace.

| Columna | Tipo | Notas |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| workspace_id | UUID FK → workspaces.id | ON DELETE CASCADE |
| email | VARCHAR(255) | Email del invitado |
| role | ENUM | admin \| editor \| viewer |
| invited_by | UUID FK → users.id | Quien invitó |
| token | VARCHAR(255) UNIQUE | Token de invitación |
| expires_at | TIMESTAMPTZ | Expiración (7 días) |
| accepted_at | TIMESTAMPTZ NULL | NULL si no aceptó |

### ai_conversations
Historial de conversaciones con el asistente IA.

| Columna | Tipo | Notas |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| user_id | UUID FK → users.id | Índice |
| workspace_id | UUID FK → workspaces.id | Índice |
| messages | JSONB | [{role, content, timestamp}] |
| created_at | TIMESTAMPTZ | now() |

### notification_preferences
Preferencias de notificación por tipo y canal.

| Columna | Tipo | Notas |
|---|---|---|
| user_id | UUID FK → users.id | PK compuesto |
| type | VARCHAR(50) | PK compuesto |
| email_enabled | BOOLEAN | Default: true |
| push_enabled | BOOLEAN | Default: true |
| inapp_enabled | BOOLEAN | Default: true |

## Índices principales

- `tasks(project_id, column_id)` — consultas de tablero
- `tasks(assigned_to, due_date)` — vista Hoy y Atención
- `activity_log(workspace_id, created_at DESC)` — vista Novedades
- `notifications(user_id, is_read, created_at DESC)` — panel de notificaciones
- `workspace_members(workspace_id, user_id)` — verificación de pertenencia
- `invitations(token)` — aceptar invitación
- `invitations(workspace_id, email)` — evitar duplicados

## Relaciones clave

- `users 1:N workspace_members` — un usuario pertenece a varios workspaces
- `workspaces 1:N workspace_members` — un workspace tiene varios miembros
- `workspaces 1:N projects` — un workspace contiene varios proyectos
- `projects 1:N columns` — un proyecto tiene varias columnas
- `columns 1:N tasks` — una columna contiene varias tareas
- `tasks 1:N subtasks, comments, attachments` — relaciones de composición
- `activity_log` referencia polimórfica a workspace, project, task
- `notifications` referencia polimórfica vía reference_id + reference_type

## Límites por plan (enforced en middleware + RLS)

| Plan | Proyectos | Miembros | Tareas | Storage |
|---|---|---|---|---|
| Free | 1 | 3 | 50 | 100 MB |
| Pro | Ilimitados | 10 | Ilimitadas | 5 GB |
| Business | Ilimitados | Ilimitados | Ilimitadas | 50 GB |
| Enterprise | Ilimitados | Ilimitados | Ilimitadas | Ilimitado |
