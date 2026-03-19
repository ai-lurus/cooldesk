-- ============================================================
-- CoolDesk — Realtime channels
-- Sprint 1 · 2026-03-19
-- ============================================================

-- Habilitar Realtime en tablas que necesitan sincronización en tiempo real

-- Nota: en Supabase, Realtime se habilita en el Dashboard o via:
-- Replication > Tables > enable for each table

-- Las tablas que deben tener Realtime habilitado:
--   ✓ tasks         — movimientos de tarjetas en el tablero
--   ✓ comments      — nuevos comentarios en tareas abiertas
--   ✓ notifications — badge de notificaciones en tiempo real
--   ✓ subtasks      — progreso de subtareas

-- Ejecutar en Supabase Dashboard → Database → Replication
-- O via supabase CLI:
--   supabase realtime enable tasks
--   supabase realtime enable comments
--   supabase realtime enable notifications
--   supabase realtime enable subtasks

-- ============================================================
-- Publication para Realtime (alternativa vía SQL)
-- ============================================================

-- Si el publication supabase_realtime ya existe, solo añadir tablas:
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.subtasks;
