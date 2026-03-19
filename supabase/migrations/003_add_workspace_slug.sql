-- ============================================================
-- CoolDesk — Agregar slug a workspaces
-- Sprint 1 · 2026-03-19
-- ============================================================

alter table public.workspaces
  add column if not exists slug varchar(50) unique;

-- Backfill slug from name for existing workspaces
update public.workspaces
set slug = lower(regexp_replace(name, '[^a-z0-9]+', '-', 'g'))
where slug is null;

-- Add not-null constraint after backfill
alter table public.workspaces
  alter column slug set not null;

create index if not exists workspaces_slug_idx on public.workspaces(slug);
