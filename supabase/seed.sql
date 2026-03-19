-- CoolDesk — Seed data for development
-- Run after migrations: supabase db reset

-- Create default columns for a project (called by trigger or manually)
-- In production, columns are created during onboarding

-- Example: seed a test workspace (uncomment for local dev)
/*
INSERT INTO workspaces (id, name, owner_id) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Demo Workspace', '00000000-0000-0000-0000-000000000000');

INSERT INTO projects (id, workspace_id, name, color, created_by) VALUES
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Demo Project', '#F97316', '00000000-0000-0000-0000-000000000000');

INSERT INTO columns (id, project_id, name, position) VALUES
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', 'Sin iniciar', 0),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', 'En progreso', 1),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000002', 'Bloqueado', 2),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000002', 'Hecho', 3);
*/
