-- ============================================================
-- CoolDesk — Migración inicial
-- Sprint 1 · 2026-03-19
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMs
-- ============================================================

create type member_role as enum ('owner', 'admin', 'editor', 'viewer');
create type task_priority as enum ('urgent', 'high', 'medium', 'low');
create type user_theme as enum ('light', 'dark', 'system');
create type invitation_role as enum ('admin', 'editor', 'viewer');

-- ============================================================
-- FUNCIÓN updated_at trigger (reusable)
-- ============================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- TABLA: users (perfil público, vinculado a auth.users)
-- ============================================================

create table public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  name         varchar(255) not null,
  email        varchar(255) not null unique,
  avatar_url   text,
  role         varchar(20)  not null default 'user',
  language     varchar(10)  not null default 'es-MX',
  timezone     varchar(50)  not null default 'America/Mexico_City',
  theme        user_theme   not null default 'system',
  two_factor_enabled boolean not null default false,
  created_at   timestamptz  not null default now(),
  updated_at   timestamptz  not null default now()
);

create trigger users_updated_at
  before update on public.users
  for each row execute function set_updated_at();

-- Trigger: crear perfil automáticamente al registrarse en Supabase Auth
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- TABLA: workspaces
-- ============================================================

create table public.workspaces (
  id         uuid primary key default gen_random_uuid(),
  name       varchar(255) not null,
  owner_id   uuid not null references public.users(id) on delete restrict,
  created_at timestamptz  not null default now()
);

-- ============================================================
-- TABLA: workspace_members
-- ============================================================

create table public.workspace_members (
  workspace_id uuid        not null references public.workspaces(id) on delete cascade,
  user_id      uuid        not null references public.users(id) on delete cascade,
  role         member_role not null,
  invited_at   timestamptz not null default now(),
  joined_at    timestamptz,
  primary key (workspace_id, user_id)
);

create index workspace_members_workspace_id_idx on public.workspace_members(workspace_id);
create index workspace_members_user_id_idx      on public.workspace_members(user_id);

-- ============================================================
-- TABLA: invitations
-- ============================================================

create table public.invitations (
  id           uuid            primary key default gen_random_uuid(),
  workspace_id uuid            not null references public.workspaces(id) on delete cascade,
  email        varchar(255)    not null,
  role         invitation_role not null,
  invited_by   uuid            not null references public.users(id),
  token        varchar(255)    not null unique default encode(gen_random_bytes(32), 'hex'),
  expires_at   timestamptz     not null default now() + interval '7 days',
  accepted_at  timestamptz
);

create index invitations_token_idx          on public.invitations(token);
create unique index invitations_ws_email_idx on public.invitations(workspace_id, email)
  where accepted_at is null;

-- ============================================================
-- TABLA: projects
-- ============================================================

create table public.projects (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references public.workspaces(id) on delete cascade,
  name         varchar(255) not null,
  description  text,
  color        varchar(7)  not null default '#F97316',
  is_archived  boolean     not null default false,
  created_by   uuid        not null references public.users(id),
  created_at   timestamptz not null default now()
);

create index projects_workspace_id_idx on public.projects(workspace_id);

-- ============================================================
-- TABLA: columns
-- ============================================================

create table public.columns (
  id         uuid        primary key default gen_random_uuid(),
  project_id uuid        not null references public.projects(id) on delete cascade,
  name       varchar(100) not null,
  position   integer     not null,
  color      varchar(7),
  created_at timestamptz not null default now(),
  unique (project_id, position)
);

create index columns_project_id_idx on public.columns(project_id);

-- Trigger: crear 4 columnas fijas al crear un proyecto
create or replace function create_default_columns()
returns trigger as $$
begin
  insert into public.columns (project_id, name, position, color) values
    (new.id, 'Sin iniciar', 0, '#94A3B8'),
    (new.id, 'En progreso', 1, '#F97316'),
    (new.id, 'Bloqueado',   2, '#EF4444'),
    (new.id, 'Hecho',       3, '#22C55E');
  return new;
end;
$$ language plpgsql;

create trigger on_project_created
  after insert on public.projects
  for each row execute function create_default_columns();

-- ============================================================
-- TABLA: tasks
-- ============================================================

create table public.tasks (
  id          uuid          primary key default gen_random_uuid(),
  project_id  uuid          not null references public.projects(id) on delete cascade,
  column_id   uuid          references public.columns(id) on delete set null,
  title       varchar(500)  not null,
  description text,
  priority    task_priority not null default 'medium',
  assigned_to uuid          references public.users(id) on delete set null,
  created_by  uuid          not null references public.users(id),
  due_date    date,
  position    integer       not null default 0,
  created_at  timestamptz   not null default now(),
  updated_at  timestamptz   not null default now()
);

create trigger tasks_updated_at
  before update on public.tasks
  for each row execute function set_updated_at();

create index tasks_project_column_idx  on public.tasks(project_id, column_id);
create index tasks_assigned_due_idx    on public.tasks(assigned_to, due_date);
create index tasks_project_id_idx      on public.tasks(project_id);

-- ============================================================
-- TABLA: subtasks
-- ============================================================

create table public.subtasks (
  id           uuid        primary key default gen_random_uuid(),
  task_id      uuid        not null references public.tasks(id) on delete cascade,
  title        varchar(500) not null,
  is_completed boolean     not null default false,
  position     integer     not null default 0
);

create index subtasks_task_id_idx on public.subtasks(task_id);

-- ============================================================
-- TABLA: comments
-- ============================================================

create table public.comments (
  id         uuid        primary key default gen_random_uuid(),
  task_id    uuid        not null references public.tasks(id) on delete cascade,
  user_id    uuid        not null references public.users(id),
  content    text        not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger comments_updated_at
  before update on public.comments
  for each row execute function set_updated_at();

create index comments_task_id_idx on public.comments(task_id);

-- ============================================================
-- TABLA: attachments
-- ============================================================

create table public.attachments (
  id         uuid        primary key default gen_random_uuid(),
  task_id    uuid        not null references public.tasks(id) on delete cascade,
  user_id    uuid        not null references public.users(id),
  file_name  varchar(255) not null,
  file_url   text        not null,
  file_size  bigint      not null,
  file_type  varchar(100) not null,
  created_at timestamptz not null default now()
);

create index attachments_task_id_idx on public.attachments(task_id);

-- ============================================================
-- TABLA: activity_log
-- ============================================================

create table public.activity_log (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references public.workspaces(id) on delete cascade,
  project_id   uuid        references public.projects(id) on delete set null,
  task_id      uuid        references public.tasks(id) on delete set null,
  user_id      uuid        not null references public.users(id),
  action       varchar(100) not null,
  metadata     jsonb       not null default '{}',
  created_at   timestamptz not null default now()
);

create index activity_log_workspace_created_idx on public.activity_log(workspace_id, created_at desc);
create index activity_log_project_id_idx        on public.activity_log(project_id);

-- ============================================================
-- TABLA: notifications
-- ============================================================

create table public.notifications (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references public.users(id) on delete cascade,
  type           varchar(50) not null,
  title          varchar(255) not null,
  body           text        not null,
  reference_id   uuid,
  reference_type varchar(50) check (reference_type in ('task', 'project', 'comment')),
  is_read        boolean     not null default false,
  created_at     timestamptz not null default now()
);

create index notifications_user_read_idx on public.notifications(user_id, is_read, created_at desc);

-- ============================================================
-- TABLA: notification_preferences
-- ============================================================

create table public.notification_preferences (
  user_id       uuid        not null references public.users(id) on delete cascade,
  type          varchar(50) not null,
  email_enabled boolean     not null default true,
  push_enabled  boolean     not null default true,
  inapp_enabled boolean     not null default true,
  primary key (user_id, type)
);

-- ============================================================
-- TABLA: ai_conversations
-- ============================================================

create table public.ai_conversations (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references public.users(id) on delete cascade,
  workspace_id uuid        not null references public.workspaces(id) on delete cascade,
  messages     jsonb       not null default '[]',
  created_at   timestamptz not null default now()
);

create index ai_conversations_user_id_idx      on public.ai_conversations(user_id);
create index ai_conversations_workspace_id_idx on public.ai_conversations(workspace_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.users                  enable row level security;
alter table public.workspaces             enable row level security;
alter table public.workspace_members      enable row level security;
alter table public.invitations            enable row level security;
alter table public.projects               enable row level security;
alter table public.columns                enable row level security;
alter table public.tasks                  enable row level security;
alter table public.subtasks               enable row level security;
alter table public.comments               enable row level security;
alter table public.attachments            enable row level security;
alter table public.activity_log           enable row level security;
alter table public.notifications          enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.ai_conversations       enable row level security;

-- ============================================================
-- HELPER: verificar si el usuario autenticado es miembro del workspace
-- ============================================================

create or replace function is_workspace_member(ws_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws_id
      and user_id = auth.uid()
      and joined_at is not null
  );
$$ language sql security definer stable;

create or replace function get_workspace_role(ws_id uuid)
returns member_role as $$
  select role from public.workspace_members
  where workspace_id = ws_id
    and user_id = auth.uid()
    and joined_at is not null
  limit 1;
$$ language sql security definer stable;

-- ============================================================
-- RLS POLICIES: users
-- ============================================================

-- Ver tu propio perfil o el de miembros de tus workspaces
create policy "users: select self or workspace member"
  on public.users for select
  using (
    id = auth.uid()
    or exists (
      select 1 from public.workspace_members wm
      join public.workspace_members my_wm on my_wm.workspace_id = wm.workspace_id
      where wm.user_id = public.users.id
        and my_wm.user_id = auth.uid()
        and my_wm.joined_at is not null
    )
  );

-- Solo puedes editar tu propio perfil
create policy "users: update self"
  on public.users for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ============================================================
-- RLS POLICIES: workspaces
-- ============================================================

create policy "workspaces: select as member"
  on public.workspaces for select
  using (is_workspace_member(id));

create policy "workspaces: insert authenticated"
  on public.workspaces for insert
  with check (auth.uid() is not null and owner_id = auth.uid());

create policy "workspaces: update owner only"
  on public.workspaces for update
  using (owner_id = auth.uid());

create policy "workspaces: delete owner only"
  on public.workspaces for delete
  using (owner_id = auth.uid());

-- ============================================================
-- RLS POLICIES: workspace_members
-- ============================================================

create policy "workspace_members: select as member"
  on public.workspace_members for select
  using (is_workspace_member(workspace_id));

create policy "workspace_members: insert admin+"
  on public.workspace_members for insert
  with check (
    get_workspace_role(workspace_id) in ('owner', 'admin')
  );

create policy "workspace_members: update admin+"
  on public.workspace_members for update
  using (get_workspace_role(workspace_id) in ('owner', 'admin'));

create policy "workspace_members: delete admin+ or self"
  on public.workspace_members for delete
  using (
    get_workspace_role(workspace_id) in ('owner', 'admin')
    or user_id = auth.uid()
  );

-- ============================================================
-- RLS POLICIES: invitations
-- ============================================================

create policy "invitations: select admin+"
  on public.invitations for select
  using (get_workspace_role(workspace_id) in ('owner', 'admin'));

create policy "invitations: insert admin+"
  on public.invitations for insert
  with check (get_workspace_role(workspace_id) in ('owner', 'admin'));

create policy "invitations: update by token (public)"
  on public.invitations for update
  using (true); -- controlado en el servidor via service role

-- ============================================================
-- RLS POLICIES: projects
-- ============================================================

create policy "projects: select as member"
  on public.projects for select
  using (is_workspace_member(workspace_id) and is_archived = false
         or get_workspace_role(workspace_id) in ('owner', 'admin'));

create policy "projects: insert editor+"
  on public.projects for insert
  with check (
    get_workspace_role(workspace_id) in ('owner', 'admin', 'editor')
    and created_by = auth.uid()
  );

create policy "projects: update editor+"
  on public.projects for update
  using (get_workspace_role(workspace_id) in ('owner', 'admin', 'editor'));

create policy "projects: delete admin+"
  on public.projects for delete
  using (get_workspace_role(workspace_id) in ('owner', 'admin'));

-- ============================================================
-- RLS POLICIES: columns
-- ============================================================

create policy "columns: select as member"
  on public.columns for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = public.columns.project_id
        and is_workspace_member(p.workspace_id)
    )
  );

-- INSERT/UPDATE/DELETE de columnas: solo admin+ (v2 feature)
-- En MVP las columnas se crean por trigger, no directamente por el usuario
create policy "columns: insert admin+ or trigger"
  on public.columns for insert
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and get_workspace_role(p.workspace_id) in ('owner', 'admin')
    )
  );

-- ============================================================
-- RLS POLICIES: tasks
-- ============================================================

create policy "tasks: select as member"
  on public.tasks for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = public.tasks.project_id
        and is_workspace_member(p.workspace_id)
    )
  );

create policy "tasks: insert editor+"
  on public.tasks for insert
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and get_workspace_role(p.workspace_id) in ('owner', 'admin', 'editor')
    )
    and created_by = auth.uid()
  );

create policy "tasks: update editor+"
  on public.tasks for update
  using (
    exists (
      select 1 from public.projects p
      where p.id = public.tasks.project_id
        and get_workspace_role(p.workspace_id) in ('owner', 'admin', 'editor')
    )
  );

create policy "tasks: delete editor+"
  on public.tasks for delete
  using (
    exists (
      select 1 from public.projects p
      where p.id = public.tasks.project_id
        and get_workspace_role(p.workspace_id) in ('owner', 'admin', 'editor')
    )
  );

-- ============================================================
-- RLS POLICIES: subtasks
-- ============================================================

create policy "subtasks: select as member"
  on public.subtasks for select
  using (
    exists (
      select 1 from public.tasks t
      join public.projects p on p.id = t.project_id
      where t.id = public.subtasks.task_id
        and is_workspace_member(p.workspace_id)
    )
  );

create policy "subtasks: write editor+"
  on public.subtasks for all
  using (
    exists (
      select 1 from public.tasks t
      join public.projects p on p.id = t.project_id
      where t.id = public.subtasks.task_id
        and get_workspace_role(p.workspace_id) in ('owner', 'admin', 'editor')
    )
  );

-- ============================================================
-- RLS POLICIES: comments
-- ============================================================

create policy "comments: select as member"
  on public.comments for select
  using (
    exists (
      select 1 from public.tasks t
      join public.projects p on p.id = t.project_id
      where t.id = public.comments.task_id
        and is_workspace_member(p.workspace_id)
    )
  );

create policy "comments: insert editor+"
  on public.comments for insert
  with check (
    exists (
      select 1 from public.tasks t
      join public.projects p on p.id = t.project_id
      where t.id = task_id
        and get_workspace_role(p.workspace_id) in ('owner', 'admin', 'editor')
    )
    and user_id = auth.uid()
  );

-- Solo puedes editar/borrar tus propios comentarios (o admin+)
create policy "comments: update own or admin+"
  on public.comments for update
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.tasks t
      join public.projects p on p.id = t.project_id
      where t.id = public.comments.task_id
        and get_workspace_role(p.workspace_id) in ('owner', 'admin')
    )
  );

create policy "comments: delete own or admin+"
  on public.comments for delete
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.tasks t
      join public.projects p on p.id = t.project_id
      where t.id = public.comments.task_id
        and get_workspace_role(p.workspace_id) in ('owner', 'admin')
    )
  );

-- ============================================================
-- RLS POLICIES: attachments
-- ============================================================

create policy "attachments: select as member"
  on public.attachments for select
  using (
    exists (
      select 1 from public.tasks t
      join public.projects p on p.id = t.project_id
      where t.id = public.attachments.task_id
        and is_workspace_member(p.workspace_id)
    )
  );

create policy "attachments: insert editor+"
  on public.attachments for insert
  with check (
    exists (
      select 1 from public.tasks t
      join public.projects p on p.id = t.project_id
      where t.id = task_id
        and get_workspace_role(p.workspace_id) in ('owner', 'admin', 'editor')
    )
    and user_id = auth.uid()
  );

create policy "attachments: delete own or admin+"
  on public.attachments for delete
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.tasks t
      join public.projects p on p.id = t.project_id
      where t.id = public.attachments.task_id
        and get_workspace_role(p.workspace_id) in ('owner', 'admin')
    )
  );

-- ============================================================
-- RLS POLICIES: activity_log (solo lectura para miembros)
-- ============================================================

create policy "activity_log: select as member"
  on public.activity_log for select
  using (is_workspace_member(workspace_id));

-- activity_log se escribe solo desde el servidor (service role), no desde el cliente
-- No hay policy de INSERT/UPDATE/DELETE para usuarios normales

-- ============================================================
-- RLS POLICIES: notifications (solo propias)
-- ============================================================

create policy "notifications: select own"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "notifications: update own (marcar leída)"
  on public.notifications for update
  using (user_id = auth.uid());

-- ============================================================
-- RLS POLICIES: notification_preferences
-- ============================================================

create policy "notification_preferences: select own"
  on public.notification_preferences for select
  using (user_id = auth.uid());

create policy "notification_preferences: write own"
  on public.notification_preferences for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================================
-- RLS POLICIES: ai_conversations
-- ============================================================

create policy "ai_conversations: select own"
  on public.ai_conversations for select
  using (user_id = auth.uid());

create policy "ai_conversations: insert own"
  on public.ai_conversations for insert
  with check (user_id = auth.uid());

create policy "ai_conversations: update own"
  on public.ai_conversations for update
  using (user_id = auth.uid());
