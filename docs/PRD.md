  
**CoolDesk**

PRD Operativo v4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tablero kanban con asistente IA para equipos pequeños

Versión 4.0  ·  16 de marzo de 2026

Documento confidencial — AI-LURUS

## **Visión general**

CoolDesk es una herramienta de gestión de proyectos y tareas que combina un tablero visual tipo kanban con un Asistente IA embebido en el panel, para ayudar a equipos pequeños (freelancers, agencias, startups) a organizar su trabajo, priorizar, y tomar decisiones más rápido sin salir del flujo.  
La experiencia central es que el usuario ve su tablero y, en el mismo espacio, puede hacer preguntas en lenguaje natural (“¿qué tareas están bloqueadas?”, “ayúdame a planear esta semana”) y la IA responde usando el contexto del propio tablero.

**Problema que resolvemos**

Para equipos pequeños, las herramientas de proyectos resultan demasiado complejas (tipo “mini‑Jira”) o demasiado simples (listas sin contexto).  
Los usuarios terminan con muchas tareas dispersas, poca claridad de prioridades y pierden tiempo moviéndose entre herramientas de notas, chat e IA genérica que no conoce su contexto.

## **Propuesta de valor**

* Un tablero claro y ligero para organizar proyectos, tareas y estados.

* Un Asistente IA siempre visible en el panel, que entiende el contenido de proyectos/tareas y puede responder preguntas, resumir, priorizar y proponer planes de acción.

* Una UX enfocada en reducir fricción: menos clicks, más acciones directas y comandos naturales (texto/voz) dentro del mismo espacio.

Público objetivo / Personas

1. Fundador o líder de equipo en startup pequeña

   * Necesita tener a la vista el estado de proyectos clave, riesgos, prioridades de la semana.

   * Dolor: pierde tiempo pidiendo updates por chat, rehaciendo planes y tratando de alinear al equipo.

2. Freelancer / consultor con varios clientes

   * Maneja múltiples proyectos en paralelo, cada uno con tareas, deadlines y dependencias.

   * Dolor: no tiene una vista unificada ni ayuda para decidir “qué va primero hoy”.

3. Project manager / operations en agencia o estudio creativo

   * Orquesta proyectos con muchos stakeholders y entregables.

   * Dolor: la herramienta actual es rígida; el equipo no la usa consistentemente y no hay insights accionables.

**Índice**

[**1\. Resumen del producto**](#bookmark=id.jek5rimxa195)

[**2\. Identidad de marca**](#bookmark=id.jzfubzh5x0p6)

[**3\. Alcance: MVP vs. v2**](#bookmark=id.z1cfwarppmqy)

[3.1 Incluido en MVP](#bookmark=id.tl4fn6o9rj2l)

[3.2 Diferido a v2](#bookmark=id.m77cv8ro24a)

[**4\. Roles y permisos**](#bookmark=id.ezio6ebitcaw)

[**5\. Monetización**](#bookmark=id.w2wpyh58b4yd)

[**6\. Inventario de frames (72/72)**](#bookmark=id.i5apdjr8b3hu)

[**7\. Modelo de datos**](#bookmark=id.lsi757gqev70)

[**8\. Mapa de API / Endpoints**](#bookmark=id.3v38f14kjnuq)

[**9\. Reglas de negocio del Asistente IA**](#bookmark=id.vxpn2kq3u1xv)

[**10\. Especificación de tiempo real**](#bookmark=id.kkb6ckr4r7c8)

[**11\. Reglas de notificaciones por canal**](#bookmark=id.7gvzcr3ei26t)

[**12\. Plan de sprints**](#bookmark=id.izn1fko4tha8)

[**13\. Decisiones pendientes**](#bookmark=id.8uef98egmc3o)

# **1\. Resumen del producto**

| Producto | CoolDesk |
| :---- | :---- |
| Tipo | Aplicación web (SaaS) |
| Mercado principal | Freelancers, PyMEs y startups (equipos de 2–20 personas) |
| Mercado secundario | Empresas medianas y enterprise |
| Propuesta de valor | Tablero kanban con asistente de IA integrado que sugiere prioridades, detecta cuellos de botella y redistribuye carga de trabajo. |
| Modelo de negocio | Freemium (Free \+ Pro \+ Business \+ Enterprise) |
| Plataforma | Web responsive (desktop-first, mobile-friendly) |
| Stack | Next.js 14+ · Supabase · Tailwind CSS · shadcn/ui |
| Asistente IA | Híbrido (Ollama local para desarrollo \+ API cloud para producción) |

# **2\. Identidad de marca**

| Elemento | Valor | Muestra |
| :---- | :---- | :---- |
| Primario (naranja) | \#F97316 |  |
| Fondo beige | \#EDE8E0 |  |
| Texto oscuro | \#1C1917 | — |
| Violeta IA | \#7C5CFC | — |
| Blanco | \#FFFFFF | — |
| Tipografía | Inter (Google Fonts) | — |

# **3\. Alcance: MVP vs. v2**

## **3.1 Incluido en MVP**

●  Autenticación completa (registro, login, recuperar contraseña, verificación de email, 2FA).

●  Onboarding: crear workspace, invitar miembros, crear primer proyecto.

●  Tablero kanban con columnas fijas: Sin iniciar, En progreso, Bloqueado, Hecho.

●  Tareas: crear, editar, mover (drag & drop), eliminar, asignar, prioridad, fecha límite.

●  Subtareas, comentarios y archivos adjuntos.

●  Vistas: Hoy, Atención (tareas urgentes/vencidas), Novedades (actividad reciente).

●  Búsqueda global con filtros.

●  Notificaciones (in-app, email).

●  Asistente IA (sugerencias básicas para plan Pro, completo para Business).

●  Configuración: perfil, workspace, miembros, roles, preferencias de notificación.

●  UI de integraciones y facturación (pantallas listas, sin backend).

●  Roles: Owner, Admin, Editor, Viewer.

●  Estados vacíos, errores, confirmaciones, carga.

## **3.2 Diferido a v2**

○  Backend de integraciones (Slack, GitHub, Figma, Google Drive).

○  Backend de facturación y pasarela de pago (Stripe).

○  Columnas editables: crear, renombrar, eliminar, reordenar columnas personalizadas.

○  Presencia en tiempo real (quién está en línea).

○  SSO / SAML para plan Enterprise.

○  Aplicación móvil nativa.

○  Notificaciones push (web y móvil).

○  On-premise deployment.

# **4\. Roles y permisos**

| Rol | Permisos |
| :---- | :---- |
| **Owner** | Acceso total: facturación, eliminar workspace, gestión de miembros, configuración global. |
| **Admin** | Gestionar miembros, configurar proyecto, gestionar todas las tareas, no puede eliminar workspace ni cambiar plan. |
| **Editor** | Crear y editar tareas propias y asignadas, comentar, adjuntar archivos. |
| **Viewer** | Solo lectura. No puede crear ni editar tareas, pero sí ver el tablero y comentarios. |

# **5\. Monetización**

| Plan | Precio | Proyectos | Miembros | Tareas | Storage | IA |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Free** | $0 | 1 | 3 | 50 | 100 MB | No |
| **Pro** | $12/usr/mes | Ilimitados | 10 | Ilimitadas | 5 GB | Básica |
| **Business** | $25/usr/mes | Ilimitados | Ilimitados | Ilimitadas | 50 GB | Completa |
| **Enterprise** | Personalizado | Ilimitados | Ilimitados | Ilimitadas | Ilimitado | Completa \+ SLA |

# **6\. Inventario de frames (72/72)**

Todas las pantallas están implementadas en el prototipo interactivo. Total: 72 frames.

## **Autenticación (6 frames)**

| \# | Nombre del frame | Estado |
| ----- | :---- | :---- |
| **1** | Iniciar sesión | ✓ Implementado |
| **2** | Crear cuenta | ✓ Implementado |
| **3** | Verifica tu correo | ✓ Implementado |
| **4** | Recuperar contraseña | ✓ Implementado |
| **5** | Restablecer contraseña | ✓ Implementado |
| **6** | Login fallido | ✓ Implementado |

## **Onboarding (5 frames)**

| \# | Nombre del frame | Estado |
| ----- | :---- | :---- |
| **7** | ¡Bienvenido a CoolDesk\! | ✓ Implementado |
| **8** | Configura tu espacio de trabajo | ✓ Implementado |
| **9** | Invita a tu equipo | ✓ Implementado |
| **10** | Crea tu primer proyecto | ✓ Implementado |
| **11** | Tour rápido | ✓ Implementado |

## **Vistas principales (5 frames)**

| \# | Nombre del frame | Estado |
| ----- | :---- | :---- |
| **12** | Tablero Kanban | ✓ Implementado |
| **13** | Hoy | ✓ Implementado |
| **14** | Novedades | ✓ Implementado |
| **15** | Requiere atención | ✓ Implementado |
| **16** | Filtros | ✓ Implementado |

## **Modales de tarea (5 frames)**

| \# | Nombre del frame | Estado |
| ----- | :---- | :---- |
| **17** | Crear actividad | ✓ Implementado |
| **18** | Detalle de actividad | ✓ Implementado |
| **19** | Detalle — comentario | ✓ Implementado |
| **20** | Confirmación — Eliminar actividad | ✓ Implementado |
| **21** | Confirmación — Descartar cambios | ✓ Implementado |

## **Búsqueda y notificaciones (2 frames)**

| \# | Nombre del frame | Estado |
| ----- | :---- | :---- |
| **22** | Búsqueda global | ✓ Implementado |
| **23** | Notificaciones | ✓ Implementado |

## **Asistente IA (2 frames)**

| \# | Nombre del frame | Estado |
| ----- | :---- | :---- |
| **24** | Asistente IA | ✓ Implementado |
| **25** | Sin sugerencias | ✓ Implementado |

## **Configuración (7 frames)**

| \# | Nombre del frame | Estado |
| ----- | :---- | :---- |
| **26** | Mi perfil | ✓ Implementado |
| **27** | Equipo | ✓ Implementado |
| **28** | Proyecto | ✓ Implementado |
| **29** | Notificaciones | ✓ Implementado |
| **30** | Integraciones | ✓ Implementado |
| **31** | Plan y facturación | ✓ Implementado |
| **32** | Configuración — vista Editor | ✓ Implementado |

## **Modales de configuración (14 frames)**

| \# | Nombre del frame | Estado |
| ----- | :---- | :---- |
| **33** | Cambiar contraseña | ✓ Implementado |
| **34** | Activar autenticación 2FA | ✓ Implementado |
| **35** | Desactivar 2FA | ✓ Implementado |
| **36** | Invitar miembro | ✓ Implementado |
| **37** | Editar rol | ✓ Implementado |
| **38** | Remover miembro | ✓ Implementado |
| **39** | Crear proyecto | ✓ Implementado |
| **40** | Crear columna | ✓ Implementado |
| **41** | Editar columna | ✓ Implementado |
| **42** | Conectar integración | ✓ Implementado |
| **43** | Configurar integración | ✓ Implementado |
| **44** | Configurar Webhook | ✓ Implementado |
| **45** | Cambiar plan | ✓ Implementado |
| **46** | Método de pago | ✓ Implementado |

## **Confirmaciones (7 frames)**

| \# | Nombre del frame | Estado |
| ----- | :---- | :---- |
| **47** | ¿Archivar proyecto? | ✓ Implementado |
| **48** | Eliminar proyecto | ✓ Implementado |
| **49** | Eliminar columna | ✓ Implementado |
| **50** | Cancelar suscripción | ✓ Implementado |
| **51** | Eliminar método de pago | ✓ Implementado |
| **52** | Regenerar API Key | ✓ Implementado |
| **53** | ¿Cerrar sesión? | ✓ Implementado |

## **Estados vacíos (9 frames)**

| \# | Nombre del frame | Estado |
| ----- | :---- | :---- |
| **54** | Board vacío (primer uso) | ✓ Implementado |
| **55** | Columna vacía | ✓ Implementado |
| **56** | Hoy vacío | ✓ Implementado |
| **57** | Novedades vacío | ✓ Implementado |
| **58** | Atención vacío (todo OK) | ✓ Implementado |
| **59** | Equipo de 1 persona | ✓ Implementado |
| **60** | Sin integraciones | ✓ Implementado |
| **61** | Sin método de pago | ✓ Implementado |
| **62** | Historial facturación vacío | ✓ Implementado |

## **Errores y sistema (10 frames)**

| \# | Nombre del frame | Estado |
| ----- | :---- | :---- |
| **63** | 404 — Página no encontrada | ✓ Implementado |
| **64** | Sin conexión a internet | ✓ Implementado |
| **65** | Tu sesión ha expirado | ✓ Implementado |
| **66** | Error al guardar | ✓ Implementado |
| **67** | Validación de campos | ✓ Implementado |
| **68** | Límite de plan excedido | ✓ Implementado |
| **69** | Error inesperado | ✓ Implementado |
| **70** | Warning — Límite próximo | ✓ Implementado |
| **71** | Warning — Mover tarea bloqueada | ✓ Implementado |
| **72** | Proyectos archivados | ✓ Implementado |

# **7\. Modelo de datos**

PostgreSQL gestionado por Supabase. Todas las tablas usan UUID como clave primaria.

### **users**

Usuarios registrados en la plataforma.

| Columna | Tipo | Notas |
| :---- | :---- | :---- |
| **id** | UUID PK | gen\_random\_uuid() |
| **name** | VARCHAR(255) | Nombre completo |
| **email** | VARCHAR(255) UNIQUE | Email único, índice |
| **password\_hash** | TEXT | Hash bcrypt |
| **avatar\_url** | TEXT NULL | URL de avatar en storage |
| **role** | VARCHAR(20) | Rol global. Default: user |
| **language** | VARCHAR(10) | Default: es-MX |
| **timezone** | VARCHAR(50) | Zona horaria IANA |
| **theme** | VARCHAR(10) | light | dark | system |
| **two\_factor\_enabled** | BOOLEAN | Default: false |
| **created\_at** | TIMESTAMPTZ | now() |
| **updated\_at** | TIMESTAMPTZ | Trigger on update |

### **workspaces**

Espacios de trabajo.

| Columna | Tipo | Notas |
| :---- | :---- | :---- |
| **id** | UUID PK | gen\_random\_uuid() |
| **name** | VARCHAR(255) | Nombre del workspace |
| **owner\_id** | UUID FK → users.id | ON DELETE RESTRICT |
| **created\_at** | TIMESTAMPTZ | now() |

### **workspace\_members**

Relación N:M entre workspaces y usuarios.

| Columna | Tipo | Notas |
| :---- | :---- | :---- |
| **workspace\_id** | UUID FK → workspaces.id | PK compuesto |
| **user\_id** | UUID FK → users.id | PK compuesto |
| **role** | ENUM | owner | admin | editor | viewer |
| **invited\_at** | TIMESTAMPTZ | Fecha de invitación |
| **joined\_at** | TIMESTAMPTZ NULL | NULL si no aceptó |

### **projects**

Proyectos dentro de un workspace.

| Columna | Tipo | Notas |
| :---- | :---- | :---- |
| **id** | UUID PK | gen\_random\_uuid() |
| **workspace\_id** | UUID FK → workspaces.id | ON DELETE CASCADE |
| **name** | VARCHAR(255) | Nombre del proyecto |
| **description** | TEXT NULL | Descripción opcional |
| **color** | VARCHAR(7) | Color hex |
| **is\_archived** | BOOLEAN | Default: false |
| **created\_by** | UUID FK → users.id | Creador |
| **created\_at** | TIMESTAMPTZ | now() |

### **columns**

Columnas del tablero kanban. Fijas en MVP, editables en v2.

| Columna | Tipo | Notas |
| :---- | :---- | :---- |
| **id** | UUID PK | gen\_random\_uuid() |
| **project\_id** | UUID FK → projects.id | ON DELETE CASCADE |
| **name** | VARCHAR(100) | Nombre de la columna |
| **position** | INTEGER | Orden en el tablero |
| **color** | VARCHAR(7) NULL | Color opcional |
| **created\_at** | TIMESTAMPTZ | now() |

### **tasks**

Tareas asignadas a una columna.

| Columna | Tipo | Notas |
| :---- | :---- | :---- |
| **id** | UUID PK | gen\_random\_uuid() |
| **project\_id** | UUID FK → projects.id | ON DELETE CASCADE |
| **column\_id** | UUID FK → columns.id | ON DELETE SET NULL |
| **title** | VARCHAR(500) | Título de la tarea |
| **description** | TEXT NULL | Descripción con formato |
| **priority** | ENUM | urgent | high | medium | low |
| **assigned\_to** | UUID FK → users.id NULL | Responsable |
| **created\_by** | UUID FK → users.id | Creador |
| **due\_date** | DATE NULL | Fecha límite |
| **position** | INTEGER | Orden en columna |
| **created\_at** | TIMESTAMPTZ | now() |
| **updated\_at** | TIMESTAMPTZ | Trigger on update |

### **subtasks**

Checklist de subtareas dentro de una tarea.

| Columna | Tipo | Notas |
| :---- | :---- | :---- |
| **id** | UUID PK | gen\_random\_uuid() |
| **task\_id** | UUID FK → tasks.id | ON DELETE CASCADE |
| **title** | VARCHAR(500) | Texto de la subtarea |
| **is\_completed** | BOOLEAN | Default: false |
| **position** | INTEGER | Orden en la lista |

### **comments**

Comentarios en tareas.

| Columna | Tipo | Notas |
| :---- | :---- | :---- |
| **id** | UUID PK | gen\_random\_uuid() |
| **task\_id** | UUID FK → tasks.id | ON DELETE CASCADE |
| **user\_id** | UUID FK → users.id | Autor |
| **content** | TEXT | Contenido del comentario |
| **created\_at** | TIMESTAMPTZ | now() |
| **updated\_at** | TIMESTAMPTZ | Trigger on update |

### **attachments**

Archivos adjuntos. Storage en Supabase.

| Columna | Tipo | Notas |
| :---- | :---- | :---- |
| **id** | UUID PK | gen\_random\_uuid() |
| **task\_id** | UUID FK → tasks.id | ON DELETE CASCADE |
| **user\_id** | UUID FK → users.id | Quien subió |
| **file\_name** | VARCHAR(255) | Nombre original |
| **file\_url** | TEXT | URL en storage |
| **file\_size** | BIGINT | Tamaño en bytes |
| **file\_type** | VARCHAR(100) | MIME type |
| **created\_at** | TIMESTAMPTZ | now() |

### **activity\_log**

Registro para auditoría y vista Novedades.

| Columna | Tipo | Notas |
| :---- | :---- | :---- |
| **id** | UUID PK | gen\_random\_uuid() |
| **workspace\_id** | UUID FK → workspaces.id | Índice |
| **project\_id** | UUID FK → projects.id NULL | Índice |
| **task\_id** | UUID FK → tasks.id NULL | Referencia |
| **user\_id** | UUID FK → users.id | Quien realizó la acción |
| **action** | VARCHAR(100) | ej. task.created, task.moved |
| **metadata** | JSONB | {from, to, field, ...} |
| **created\_at** | TIMESTAMPTZ | Índice, now() |

### **notifications**

Notificaciones para los usuarios.

| Columna | Tipo | Notas |
| :---- | :---- | :---- |
| **id** | UUID PK | gen\_random\_uuid() |
| **user\_id** | UUID FK → users.id | Índice |
| **type** | VARCHAR(50) | ej. task.assigned |
| **title** | VARCHAR(255) | Título |
| **body** | TEXT | Contenido descriptivo |
| **reference\_id** | UUID NULL | ID del objeto referenciado |
| **reference\_type** | VARCHAR(50) NULL | task | project | comment |
| **is\_read** | BOOLEAN | Default: false |
| **created\_at** | TIMESTAMPTZ | now() |

### **invitations**

Invitaciones pendientes a un workspace.

| Columna | Tipo | Notas |
| :---- | :---- | :---- |
| **id** | UUID PK | gen\_random\_uuid() |
| **workspace\_id** | UUID FK → workspaces.id | ON DELETE CASCADE |
| **email** | VARCHAR(255) | Email del invitado |
| **role** | ENUM | admin | editor | viewer |
| **invited\_by** | UUID FK → users.id | Quien invitó |
| **token** | VARCHAR(255) UNIQUE | Token de invitación |
| **expires\_at** | TIMESTAMPTZ | Expiración (7 días) |
| **accepted\_at** | TIMESTAMPTZ NULL | NULL si no aceptó |

### **ai\_conversations**

Historial de conversaciones con el asistente IA.

| Columna | Tipo | Notas |
| :---- | :---- | :---- |
| **id** | UUID PK | gen\_random\_uuid() |
| **user\_id** | UUID FK → users.id | Índice |
| **workspace\_id** | UUID FK → workspaces.id | Índice |
| **messages** | JSONB | \[{role, content, timestamp}\] |
| **created\_at** | TIMESTAMPTZ | now() |

### **notification\_preferences**

Preferencias de notificación por tipo y canal.

| Columna | Tipo | Notas |
| :---- | :---- | :---- |
| **user\_id** | UUID FK → users.id | PK compuesto |
| **type** | VARCHAR(50) | PK compuesto |
| **email\_enabled** | BOOLEAN | Default: true |
| **push\_enabled** | BOOLEAN | Default: true |
| **inapp\_enabled** | BOOLEAN | Default: true |

## **7.1 Índices principales**

●  tasks(project\_id, column\_id) — consultas de tablero.

●  tasks(assigned\_to, due\_date) — vista Hoy y Atención.

●  activity\_log(workspace\_id, created\_at DESC) — vista Novedades.

●  notifications(user\_id, is\_read, created\_at DESC) — panel de notificaciones.

●  workspace\_members(workspace\_id, user\_id) — verificación de pertenencia.

●  invitations(token) — aceptar invitación.

●  invitations(workspace\_id, email) — evitar duplicados.

## **7.2 Relaciones clave**

●  users 1:N workspace\_members — un usuario pertenece a varios workspaces.

●  workspaces 1:N workspace\_members — un workspace tiene varios miembros.

●  workspaces 1:N projects — un workspace contiene varios proyectos.

●  projects 1:N columns — un proyecto tiene varias columnas.

●  columns 1:N tasks — una columna contiene varias tareas.

●  tasks 1:N subtasks, comments, attachments — relaciones de composición.

●  activity\_log referencia polimórfica a workspace, project, task.

●  notifications referencia polimórfica vía reference\_id \+ reference\_type.

# **8\. Mapa de API / Endpoints**

API RESTful. Base URL: /api/v1. Autenticación vía Bearer token (JWT). Todas las respuestas en JSON.

## **8.1 Autenticación**

| Método | Ruta | Body | Respuesta | Auth | Rol |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **POST** | /auth/register | name, email, password | 201 {user, token} | No | — |
| **POST** | /auth/login | email, password | 200 {user, token} | No | — |
| **POST** | /auth/logout | — | 200 {message} | Sí | — |
| **POST** | /auth/forgot-password | email | 200 {message} | No | — |
| **POST** | /auth/reset-password | token, new\_password | 200 {message} | No | — |
| **POST** | /auth/verify-email | token | 200 {message} | No | — |
| **POST** | /auth/resend-verification | email | 200 {message} | No | — |

## **8.2 Workspaces**

| Método | Ruta | Body | Respuesta | Auth | Rol |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **POST** | /workspaces | name | 201 {workspace} | Sí | — |
| **GET** | /workspaces | — | 200 \[{workspace}\] | Sí | — |
| **GET** | /workspaces/:id | — | 200 {workspace} | Sí | viewer |
| **PATCH** | /workspaces/:id | name | 200 {workspace} | Sí | owner |
| **DELETE** | /workspaces/:id | — | 200 {message} | Sí | owner |
| **GET** | /workspaces/:id/members | — | 200 \[{member}\] | Sí | viewer |
| **POST** | /workspaces/:id/members | email, role | 201 {invitation} | Sí | admin |
| **PATCH** | /workspaces/:id/members/:uid | role | 200 {member} | Sí | admin |
| **DELETE** | /workspaces/:id/members/:uid | — | 200 {message} | Sí | admin |

## **8.3 Proyectos**

| Método | Ruta | Body | Respuesta | Auth | Rol |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **POST** | /workspaces/:wid/projects | name, description, color | 201 {project} | Sí | editor |
| **GET** | /workspaces/:wid/projects | — | 200 \[{project}\] | Sí | viewer |
| **GET** | /projects/:id | — | 200 {project} | Sí | viewer |
| **PATCH** | /projects/:id | name, description, color | 200 {project} | Sí | editor |
| **DELETE** | /projects/:id | — | 200 {message} | Sí | admin |
| **POST** | /projects/:id/archive | — | 200 {project} | Sí | admin |
| **POST** | /projects/:id/restore | — | 200 {project} | Sí | admin |

## **8.4 Columnas**

| Método | Ruta | Body | Respuesta | Auth | Rol |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **GET** | /projects/:pid/columns | — | 200 \[{column}\] | Sí | viewer |
| **POST** | /projects/:pid/columns | name, color | 201 {column} | Sí | admin (v2) |
| **PATCH** | /columns/:id | name, color | 200 {column} | Sí | admin (v2) |
| **DELETE** | /columns/:id | — | 200 {message} | Sí | admin (v2) |
| **PATCH** | /projects/:pid/columns/reorder | \[{id, position}\] | 200 \[{column}\] | Sí | admin (v2) |

## **8.5 Tareas**

| Método | Ruta | Body | Respuesta | Auth | Rol |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **POST** | /projects/:pid/tasks | title, desc, priority, column\_id, assigned\_to, due\_date | 201 {task} | Sí | editor |
| **GET** | /projects/:pid/tasks | ?column\_id, priority, assigned\_to | 200 \[{task}\] | Sí | viewer |
| **GET** | /tasks/:id | — | 200 {task, subtasks, comments, attachments} | Sí | viewer |
| **PATCH** | /tasks/:id | title, description, priority, ... | 200 {task} | Sí | editor |
| **DELETE** | /tasks/:id | — | 200 {message} | Sí | editor |
| **POST** | /tasks/:id/move | column\_id, position | 200 {task} | Sí | editor |
| **PATCH** | /projects/:pid/tasks/reorder | \[{id, column\_id, position}\] | 200 \[{task}\] | Sí | editor |
| **PATCH** | /projects/:pid/tasks/bulk | {task\_ids, updates} | 200 \[{task}\] | Sí | editor |

## **8.6 Subtareas**

| Método | Ruta | Body | Respuesta | Auth | Rol |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **POST** | /tasks/:tid/subtasks | title | 201 {subtask} | Sí | editor |
| **PATCH** | /subtasks/:id | title, is\_completed | 200 {subtask} | Sí | editor |
| **DELETE** | /subtasks/:id | — | 200 {message} | Sí | editor |
| **POST** | /subtasks/:id/toggle | — | 200 {subtask} | Sí | editor |

## **8.7 Comentarios**

| Método | Ruta | Body | Respuesta | Auth | Rol |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **POST** | /tasks/:tid/comments | content | 201 {comment} | Sí | editor |
| **GET** | /tasks/:tid/comments | — | 200 \[{comment}\] | Sí | viewer |
| **PATCH** | /comments/:id | content | 200 {comment} | Sí | editor (own) |
| **DELETE** | /comments/:id | — | 200 {message} | Sí | editor (own) |

## **8.8 Archivos adjuntos**

| Método | Ruta | Body | Respuesta | Auth | Rol |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **POST** | /tasks/:tid/attachments | file (multipart) | 201 {attachment} | Sí | editor |
| **GET** | /attachments/:id/download | — | 302 redirect signed URL | Sí | viewer |
| **DELETE** | /attachments/:id | — | 200 {message} | Sí | editor (own) |

## **8.9 Notificaciones**

| Método | Ruta | Body | Respuesta | Auth | Rol |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **GET** | /notifications | ?is\_read, page, limit | 200 {items, total, unread} | Sí | — |
| **PATCH** | /notifications/:id/read | — | 200 {notification} | Sí | — |
| **POST** | /notifications/mark-all-read | — | 200 {message} | Sí | — |
| **GET** | /notifications/preferences | — | 200 \[{preference}\] | Sí | — |
| **PATCH** | /notifications/preferences | \[{type, email, push, inapp}\] | 200 \[{preference}\] | Sí | — |

## **8.10 Búsqueda**

| Método | Ruta | Body | Respuesta | Auth | Rol |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **GET** | /search | ?q, type, project\_id, assigned\_to, priority | 200 {tasks, projects, comments} | Sí | viewer |

## **8.11 Asistente IA**

| Método | Ruta | Body | Respuesta | Auth | Rol |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **GET** | /ai/suggestions | ?project\_id | 200 \[{suggestion}\] | Sí | editor |
| **POST** | /ai/suggestions | project\_id | 200 \[{suggestion}\] | Sí | editor |
| **POST** | /ai/chat | message, workspace\_id | 200 {response, conversation\_id} | Sí | editor |

## **8.12 Actividad**

| Método | Ruta | Body | Respuesta | Auth | Rol |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **GET** | /activity | ?workspace\_id, project\_id, user\_id, page, limit | 200 {items, total} | Sí | viewer |

# **9\. Reglas de negocio del Asistente IA**

## **9.1 Tipos de sugerencias y triggers**

| Tipo | Trigger | Mensaje plantilla | CTA | Prioridad |
| :---- | :---- | :---- | :---- | :---- |
| **Tarea estancada** | Misma columna \>3 días sin actividad | "\[Tarea\] lleva {n} días sin movimiento." | Ver tarea | Alta |
| **Vence pronto** | due\_date \= mañana | "\[Tarea\] vence mañana. ¿Lista para Hecho?" | Mover a Hecho | Alta |
| **Carga desbalanceada** | Miembro con \>2x tareas vs promedio | "\[Miembro\] tiene {n} tareas vs promedio de {m}." | Ver miembro | Media |
| **Sin descripción** | Tarea sin desc. creada hace \>1 día | "\[Tarea\] no tiene descripción." | Editar tarea | Baja |
| **Tarea vencida** | due\_date \< hoy y columna ≠ Hecho | "\[Tarea\] está vencida desde hace {n} días." | Ver tarea | Urgente |

## **9.2 Datos consumidos por el modelo**

●  Estado de tareas: columna actual, fecha de último movimiento.

●  Fechas: due\_date, created\_at, updated\_at de cada tarea.

●  Asignaciones: assigned\_to de cada tarea, conteo por miembro.

●  Registro de actividad: últimas acciones en activity\_log.

●  Subtareas: porcentaje de completado para medir avance.

●  Prioridad: prioridad de cada tarea para ponderar urgencia.

## **9.3 Formato de sugerencia**

Cada sugerencia devuelta por la API:

{ type, message, action: { label, href }, priority, task\_id?, created\_at }

## **9.4 Límites por plan**

| Plan | Sugerencias/día | Mensajes chat/día | Notas |
| :---- | :---- | :---- | :---- |
| Free | Sin acceso | Sin acceso | Funcionalidad bloqueada |
| **Pro** | 20 | 10 | Se reinician a las 00:00 UTC |
| **Business** | Ilimitadas | Ilimitados | Acceso completo |
| Enterprise | Ilimitadas | Ilimitados | Acceso completo \+ SLA |

## **9.5 Privacidad**

●  El asistente IA solo accede a datos del workspace actual del usuario.

●  No existe aprendizaje cruzado entre workspaces.

●  Las conversaciones de chat se almacenan en ai\_conversations y solo son visibles para el usuario que las creó.

●  En el plan Enterprise, los datos de IA pueden procesarse on-premise.

# **10\. Especificación de tiempo real**

CoolDesk utiliza Supabase Realtime (WebSockets) para mantener la interfaz sincronizada entre usuarios conectados al mismo workspace.

## **10.1 Eventos sincronizados**

| Área | Evento | Tabla escuchada | Comportamiento en UI |
| :---- | :---- | :---- | :---- |
| **Tablero** | Tarea creada | tasks (INSERT) | Nueva tarjeta aparece en la columna |
| Tablero | Tarea movida | tasks (UPDATE column\_id) | Tarjeta se mueve animada a nueva columna |
| Tablero | Tarea eliminada | tasks (DELETE) | Tarjeta desaparece con fade out |
| Tablero | Tarea actualizada | tasks (UPDATE) | Campos se actualizan si modal está abierto |
| **Comentarios** | Nuevo comentario | comments (INSERT) | Comentario aparece al final de la lista |
| **Notificaciones** | Nueva notificación | notifications (INSERT) | Badge de contador se incrementa |
| **Presencia (v2)** | Usuario conectado | Supabase Presence | Avatar con indicador verde en sidebar |

## **10.2 Canales de suscripción**

●  workspace:{workspace\_id} — eventos generales del workspace (miembros, proyectos).

●  project:{project\_id} — eventos de tareas, columnas, subtareas del proyecto activo.

●  task:{task\_id} — eventos de comentarios y adjuntos (cuando el detalle está abierto).

●  user:{user\_id} — notificaciones personales del usuario.

## **10.3 Resolución de conflictos**

Estrategia: Last-Write-Wins (LWW) para ediciones de campos individuales.

●  Cada campo se actualiza independientemente. Si dos usuarios editan campos distintos, ambos cambios se aplican.

●  Si editan el mismo campo, gana la última escritura recibida por el servidor.

●  UI optimista: el cambio se refleja inmediatamente. Si el servidor rechaza, se revierte con toast de error.

●  Drag & drop: posición numérica. Conflictos se resuelven en el servidor recalculando posiciones.

## **10.4 Reconexión**

●  Reconexión automática con backoff exponencial (1s, 2s, 4s, 8s, máx 30s).

●  Al reconectar, solicita delta de cambios desde el último timestamp conocido.

●  Si la desconexión duró \>5 minutos, refresh completo del estado del tablero.

# **11\. Reglas de notificaciones por canal**

Cada tipo de notificación tiene canales activos por defecto. El usuario puede personalizar desde Configuración \> Preferencias.

| Tipo | In-app | Email | Push (v2) | Config. | Notas |
| :---- | ----- | ----- | ----- | ----- | :---- |
| **Tarea asignada** | ✓ | ✓ | ✓ | Sí | — |
| **Comentario nuevo** | ✓ | ✓ | ✓ | Sí | Solo en tareas propias/asignadas |
| **Tarea vencida** | ✓ | ✓ | ✓ | Sí | Se envía el día de vencimiento |
| **Tarea movida** | ✓ | ✗ | ✗ | Sí | Solo tareas asignadas al usuario |
| **Miembro invitado** | ✓ | ✓ | ✗ | No | Email obligatorio |
| **Rol cambiado** | ✓ | ✓ | ✗ | No | Notificación obligatoria |
| **Proyecto archivado** | ✓ | ✗ | ✗ | Sí | Todos los miembros del proyecto |
| **Mención en comentario** | ✓ | ✓ | ✓ | Sí | @usuario en texto |
| **Sugerencia IA** | ✓ | ✗ | ✗ | Sí | Solo planes Pro y Business |
| **Límite de plan** | ✓ | ✓ | ✗ | No | Al 80% y 100% del límite |
| **Archivo adjunto nuevo** | ✓ | ✗ | ✗ | Sí | Solo tareas asignadas |
| **Workspace eliminado** | ✓ | ✓ | ✓ | No | Obligatoria a todos |

## **11.1 Reglas de agrupación**

●  Emails se agrupan en digest cada 15 minutos (máximo 1 email por tipo cada 15 min).

●  In-app se muestran individualmente, sin agrupación.

●  Push (v2) se colapsan: si hay \>3 notificaciones del mismo tipo en 5 minutos, se muestra un resumen.

# **12\. Plan de sprints**

| Sprint | Semanas | Entregables |
| :---- | :---- | :---- |
| **Sprint 1** | Semana 1–2 | Autenticación completa (registro, login, 2FA, verificar email). Onboarding (crear workspace, invitar, primer proyecto). |
| **Sprint 2** | Semana 3–4 | Tablero kanban \+ Tareas (CRUD, drag & drop, filtros, prioridad, subtareas, comentarios, adjuntos). |
| **Sprint 3** | Semana 5–6 | Vistas Hoy, Atención y Novedades. Búsqueda global. Notificaciones (in-app, email). |
| **Sprint 4** | Semana 7–8 | Asistente IA (sugerencias \+ chat). Configuración completa. UI de integraciones y facturación. |
| **Sprint 5** | Semana 9 | QA integral, corrección de bugs, pruebas de rendimiento, lanzamiento a producción. |

# **13\. Decisiones pendientes**

| \# | Decisión | Responsable | Notas |
| ----- | :---- | :---- | :---- |
| **1** | Proveedor de IA para producción (OpenAI, Anthropic, Mistral) | CTO / Tech Lead | Evaluar costo por token, latencia, calidad de sugerencias |
| **2** | Pasarela de pago (Stripe, Mercado Pago) | Product / Finanzas | Stripe global; Mercado Pago para LATAM |
| **3** | Migración columnas fijas → editables (v2) | Tech Lead | Migrar datos sin romper posiciones |
| **4** | Soporte multi-idioma (i18n) | Product | Evaluar demanda: inglés, portugués |
| **5** | Dominio y hosting de producción | DevOps | Vercel frontend, Supabase cloud backend |
| **6** | Política de retención de datos y backups | Tech Lead / Legal | Frecuencia de backups por plan |

— Fin del documento —