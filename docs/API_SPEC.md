# API Spec — CoolDesk

API RESTful implementada como Route Handlers de Next.js.
Base URL: `/api/v1`. Autenticación vía Better Auth. Todas las respuestas en JSON.

## Formato de respuesta estándar

```typescript
// Éxito
{ success: true, data: T, meta?: { total, page, limit } }

// Error
{ success: false, error: string, code?: string }
```

## 8.1 Autenticación

Manejada por Better Auth.

| Método | Ruta | Body | Respuesta | Auth |
|---|---|---|---|---|
| POST | /auth/register | name, email, password | 201 {user, token} | No |
| POST | /auth/login | email, password | 200 {user, token} | No |
| POST | /auth/logout | — | 200 {message} | Sí |
| POST | /auth/forgot-password | email | 200 {message} | No |
| POST | /auth/reset-password | token, new_password | 200 {message} | No |
| POST | /auth/verify-email | token | 200 {message} | No |
| POST | /auth/resend-verification | email | 200 {message} | No |

## 8.2 Workspaces

| Método | Ruta | Body | Respuesta | Auth | Rol |
|---|---|---|---|---|---|
| POST | /workspaces | name | 201 {workspace} | Sí | — |
| GET | /workspaces | — | 200 [{workspace}] | Sí | — |
| GET | /workspaces/:id | — | 200 {workspace} | Sí | viewer |
| PATCH | /workspaces/:id | name | 200 {workspace} | Sí | owner |
| DELETE | /workspaces/:id | — | 200 {message} | Sí | owner |
| GET | /workspaces/:id/members | — | 200 [{member}] | Sí | viewer |
| POST | /workspaces/:id/members | email, role | 201 {invitation} | Sí | admin |
| PATCH | /workspaces/:id/members/:uid | role | 200 {member} | Sí | admin |
| DELETE | /workspaces/:id/members/:uid | — | 200 {message} | Sí | admin |

## 8.3 Proyectos

| Método | Ruta | Body | Respuesta | Auth | Rol |
|---|---|---|---|---|---|
| POST | /workspaces/:wid/projects | name, description, color | 201 {project} | Sí | editor |
| GET | /workspaces/:wid/projects | — | 200 [{project}] | Sí | viewer |
| GET | /projects/:id | — | 200 {project} | Sí | viewer |
| PATCH | /projects/:id | name, description, color | 200 {project} | Sí | editor |
| DELETE | /projects/:id | — | 200 {message} | Sí | admin |
| POST | /projects/:id/archive | — | 200 {project} | Sí | admin |
| POST | /projects/:id/restore | — | 200 {project} | Sí | admin |

## 8.4 Columnas

| Método | Ruta | Body | Respuesta | Auth | Rol |
|---|---|---|---|---|---|
| GET | /projects/:pid/columns | — | 200 [{column}] | Sí | viewer |
| POST | /projects/:pid/columns | name, color | 201 {column} | Sí | admin (v2) |
| PATCH | /columns/:id | name, color | 200 {column} | Sí | admin (v2) |
| DELETE | /columns/:id | — | 200 {message} | Sí | admin (v2) |
| PATCH | /projects/:pid/columns/reorder | [{id, position}] | 200 [{column}] | Sí | admin (v2) |

## 8.5 Tareas

| Método | Ruta | Body | Respuesta | Auth | Rol |
|---|---|---|---|---|---|
| POST | /projects/:pid/tasks | title, desc, priority, column_id, assigned_to, due_date | 201 {task} | Sí | editor |
| GET | /projects/:pid/tasks | ?column_id, priority, assigned_to | 200 [{task}] | Sí | viewer |
| GET | /tasks/:id | — | 200 {task, subtasks, comments, attachments} | Sí | viewer |
| PATCH | /tasks/:id | title, description, priority, ... | 200 {task} | Sí | editor |
| DELETE | /tasks/:id | — | 200 {message} | Sí | editor |
| POST | /tasks/:id/move | column_id, position | 200 {task} | Sí | editor |
| PATCH | /projects/:pid/tasks/reorder | [{id, column_id, position}] | 200 [{task}] | Sí | editor |
| PATCH | /projects/:pid/tasks/bulk | {task_ids, updates} | 200 [{task}] | Sí | editor |

## 8.6 Subtareas

| Método | Ruta | Body | Respuesta | Auth | Rol |
|---|---|---|---|---|---|
| POST | /tasks/:tid/subtasks | title | 201 {subtask} | Sí | editor |
| PATCH | /subtasks/:id | title, is_completed | 200 {subtask} | Sí | editor |
| DELETE | /subtasks/:id | — | 200 {message} | Sí | editor |
| POST | /subtasks/:id/toggle | — | 200 {subtask} | Sí | editor |

## 8.7 Comentarios

| Método | Ruta | Body | Respuesta | Auth | Rol |
|---|---|---|---|---|---|
| POST | /tasks/:tid/comments | content | 201 {comment} | Sí | editor |
| GET | /tasks/:tid/comments | — | 200 [{comment}] | Sí | viewer |
| PATCH | /comments/:id | content | 200 {comment} | Sí | editor (own) |
| DELETE | /comments/:id | — | 200 {message} | Sí | editor (own) |

## 8.8 Archivos adjuntos

| Método | Ruta | Body | Respuesta | Auth | Rol |
|---|---|---|---|---|---|
| POST | /tasks/:tid/attachments | file (multipart) | 201 {attachment} | Sí | editor |
| GET | /attachments/:id/download | — | 302 redirect signed URL | Sí | viewer |
| DELETE | /attachments/:id | — | 200 {message} | Sí | editor (own) |

## 8.9 Notificaciones

| Método | Ruta | Body | Respuesta | Auth | Rol |
|---|---|---|---|---|---|
| GET | /notifications | ?is_read, page, limit | 200 {items, total, unread} | Sí | — |
| PATCH | /notifications/:id/read | — | 200 {notification} | Sí | — |
| POST | /notifications/mark-all-read | — | 200 {message} | Sí | — |
| GET | /notifications/preferences | — | 200 [{preference}] | Sí | — |
| PATCH | /notifications/preferences | [{type, email, push, inapp}] | 200 [{preference}] | Sí | — |

## 8.10 Búsqueda

| Método | Ruta | Query params | Respuesta | Auth |
|---|---|---|---|---|
| GET | /search | q, type, project_id, assigned_to, priority | 200 {tasks, projects, comments} | Sí |

## 8.11 Asistente IA

Todos los endpoints verifican el plan del usuario antes de responder.

| Método | Ruta | Body | Respuesta | Auth | Plan mínimo |
|---|---|---|---|---|---|
| GET | /ai/suggestions | ?project_id | 200 [{suggestion}] | Sí | Pro |
| POST | /ai/suggestions | project_id | 200 [{suggestion}] | Sí | Pro |
| POST | /ai/chat | message, workspace_id | 200 {response, conversation_id} | Sí | Pro |

### Formato de sugerencia

```typescript
interface AISuggestion {
  type: "stalled" | "due_soon" | "overloaded" | "no_description" | "overdue"
  message: string
  action: { label: string; href: string }
  priority: "urgent" | "high" | "medium" | "low"
  task_id?: string
  created_at: string
}
```

### Límites IA por plan

| Plan | Sugerencias/día | Mensajes chat/día |
|---|---|---|
| Free | 0 (bloqueado) | 0 (bloqueado) |
| Pro | 20 | 10 |
| Business | Ilimitadas | Ilimitados |
| Enterprise | Ilimitadas | Ilimitados |

Los contadores se reinician a las 00:00 UTC.

## 8.12 Actividad

| Método | Ruta | Query params | Respuesta | Auth |
|---|---|---|---|---|
| GET | /activity | workspace_id, project_id, user_id, page, limit | 200 {items, total} | Sí |

## Códigos de error comunes

| Código HTTP | Código interno | Significado |
|---|---|---|
| 400 | VALIDATION_ERROR | Input inválido |
| 401 | UNAUTHORIZED | Sin sesión válida |
| 403 | FORBIDDEN | Sin permisos suficientes |
| 403 | PLAN_LIMIT_EXCEEDED | Límite del plan alcanzado |
| 404 | NOT_FOUND | Recurso no encontrado |
| 409 | CONFLICT | Conflicto (ej. email duplicado) |
| 429 | RATE_LIMITED | Demasiadas solicitudes |
| 500 | INTERNAL_ERROR | Error inesperado del servidor |
