"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calendar, ChevronDown, Pencil, X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useKanbanContext } from "@/components/kanban/kanban-context"
import type { Priority } from "@/components/kanban/kanban-card"
import type { Task } from "@/components/kanban/kanban-context"
import { updateTask as updateTaskAction } from "@/app/actions/task"

const taskSchema = z.object({
  title: z.string().min(1, "El nombre de la actividad es requerido"),
  description: z.string().optional(),
  columnId: z.string(),
  dueDate: z.string().optional(),
  priority: z.enum(["baja", "media", "alta", "urgente"]),
})

type TaskFormValues = z.infer<typeof taskSchema>

interface TaskDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task
  columnId: string
}

// Priority badge styles & labels
const priorityConfig: Record<Priority, { label: string; bg: string; text: string }> = {
  urgente: { label: "Urgente", bg: "bg-red-50", text: "text-red-600" },
  alta: { label: "Alta", bg: "bg-orange-50", text: "text-orange-600" },
  media: { label: "Media", bg: "bg-yellow-50", text: "text-yellow-600" },
  baja: { label: "Baja", bg: "bg-emerald-50", text: "text-emerald-600" },
}

export function TaskDetailsDialog({ open, onOpenChange, task, columnId }: TaskDetailsDialogProps) {
  const { columns, updateTask } = useKanbanContext()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      columnId: columnId,
      dueDate: "",
      priority: task.priority,
    },
  })

  const handleEdit = () => {
    reset({
      title: task.title,
      description: task.description || "",
      columnId: columnId,
      dueDate: "",
      priority: task.priority,
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset()
  }

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await updateTaskAction({
        id: task.id,
        title: data.title,
        description: data.description,
        columnId: data.columnId,
        priority: data.priority,
        dueDate: data.dueDate || null,
      })

      if (result.success) {
        // Build dateInfo from the server result
        const updatedDueDate = result.task.dueDate
        let dateInfo = task.dateInfo
        if (updatedDueDate) {
          const d = new Date(updatedDueDate)
          dateInfo = {
            text: d.toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
            isOverdue: d < new Date(new Date().setHours(0, 0, 0, 0)),
            isToday: d.toDateString() === new Date().toDateString(),
          }
        } else if (data.dueDate === "") {
          // Keep existing if no change was made
        }

        updateTask(task.id, {
          title: data.title,
          description: data.description,
          priority: data.priority as Priority,
          ...(updatedDueDate ? { dateInfo } : {}),
        })
      }

      setIsSubmitting(false)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update task", error)
      setIsSubmitting(false)
    }
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      setIsEditing(false)
    }
    onOpenChange(open)
  }

  const pConfig = priorityConfig[task.priority]

  // ─── VIEW MODE ───
  const viewContent = (
    <div className="bg-white rounded-3xl w-full p-10 shadow-2xl relative">
      {/* Top bar: Edit + Close */}
      <div className="absolute right-6 top-6 flex gap-2">
        <button
          onClick={handleEdit}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Editar
        </button>
        <button
          onClick={() => handleClose(false)}
          className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Priority badge */}
      <div className="mb-4">
        <span className={`text-[9px] font-bold px-3 py-1 rounded-full tracking-wider ${pConfig.bg} ${pConfig.text}`}>
          {pConfig.label.toUpperCase()}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-extrabold text-brand-text leading-tight mb-2 pr-28">
        {task.title}
      </h2>

      {/* Description */}
      {task.description ? (
        <p className="text-sm text-gray-500 leading-relaxed mb-6 whitespace-pre-wrap">
          {task.description}
        </p>
      ) : (
        <p className="text-sm text-gray-400 italic mb-6">Sin descripción</p>
      )}

      {/* Meta grid */}
      <div className="bg-[#f9fafb] rounded-2xl p-6 grid grid-cols-2 gap-y-5 gap-x-8">
        {/* Column */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Columna</p>
          <p className="text-sm font-semibold text-gray-700">
            {columns.find((c) => c.id === columnId)?.title || "—"}
          </p>
        </div>

        {/* Due date */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Fecha límite</p>
          {task.dateInfo ? (
            <span
              className={`text-sm font-semibold ${
                task.dateInfo.isOverdue
                  ? "text-red-500"
                  : task.dateInfo.isToday
                    ? "text-red-500"
                    : "text-gray-700"
              }`}
            >
              📅 {task.dateInfo.text}
            </span>
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </div>

        {/* Assignee */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Asignado a</p>
          {task.assignee ? (
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: task.assignee.color || "#F97316" }}
              >
                {task.assignee.initials}
              </div>
              <span className="text-sm font-semibold text-gray-700">{task.assignee.name}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-400">Sin asignar</span>
          )}
        </div>

        {/* Priority (visual) */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Prioridad</p>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${pConfig.bg} ${pConfig.text}`}>
            {pConfig.label}
          </span>
        </div>
      </div>
    </div>
  )

  // ─── EDIT MODE ───
  const editContent = (
    <div className="bg-white rounded-3xl w-full p-10 shadow-2xl relative">
      {/* Header */}
      <div className="mb-8 pl-4">
        <h1 className="text-[40px] font-extrabold text-[#A64A0B] inline-block relative mb-1 tracking-tight">
          Editar tarea
          <div className="absolute -bottom-1 left-0 w-full h-[4px] bg-[#3B82F6]"></div>
        </h1>
        <p className="text-gray-500 font-medium text-[15px] mt-3">
          Modifica los detalles de esta tarea.
        </p>
      </div>

      {/* Form */}
      <div className="bg-[#f9fafb] rounded-[24px] p-8 pb-10">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-title" className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              NOMBRE DE LA ACTIVIDAD
            </label>
            <input
              id="edit-title"
              type="text"
              placeholder="Ej: Finalizar wireframes de usuario"
              className={`w-full bg-white border border-transparent focus:border-brand-primary/30 rounded-xl py-3 px-4 text-[14px] outline-none placeholder:text-gray-400 focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium text-gray-800 shadow-sm ${errors.title ? "ring-2 ring-red-500/20 border-red-500" : ""}`}
              {...register("title")}
            />
            {errors.title && (
              <span className="text-xs text-red-500">{errors.title.message}</span>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-description" className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              DESCRIPCIÓN (OPCIONAL)
            </label>
            <textarea
              id="edit-description"
              placeholder="Añade detalles sobre esta actividad..."
              rows={4}
              className="w-full bg-white border border-transparent focus:border-brand-primary/30 rounded-xl py-3 px-4 text-[14px] outline-none placeholder:text-gray-400 focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium text-gray-800 resize-none shadow-sm"
              {...register("description")}
            />
          </div>

          {/* 2 Columns: Column & Due Date */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 relative">
              <label htmlFor="edit-columnId" className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                COLUMNA
              </label>
              <div className="relative">
                <select
                  id="edit-columnId"
                  className="w-full bg-white border border-transparent focus:border-brand-primary/30 rounded-xl py-3 px-4 text-[14px] outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium text-gray-800 appearance-none shadow-sm pr-10"
                  {...register("columnId")}
                >
                  {columns.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.title.charAt(0) + col.title.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="edit-dueDate" className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                FECHA LÍMITE
              </label>
              <div className="relative">
                <input
                  id="edit-dueDate"
                  type="date"
                  className="w-full bg-white border border-transparent focus:border-brand-primary/30 rounded-xl py-3 px-4 text-[14px] outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium text-gray-800 appearance-none shadow-sm pr-10 [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  {...register("dueDate")}
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              PRIORIDAD
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <div className="flex gap-3">
                  {(["urgente", "alta", "media", "baja"] as const).map((p) => {
                    const isSelected = field.value === p
                    const label = p.charAt(0).toUpperCase() + p.slice(1)
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => field.onChange(p)}
                        className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all ${
                          isSelected
                            ? "bg-[#F97316] text-white shadow-md"
                            : "bg-[#e5e7eb] text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              )}
            />
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-4 rounded-[14px] text-base font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 rounded-[14px] text-base font-bold bg-[#F97316] hover:bg-[#EA580C] text-white transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[760px] p-0 border-none bg-transparent shadow-none [&>button]:hidden">
        <DialogTitle className="sr-only">Detalles de tarea</DialogTitle>
        {isEditing ? editContent : viewContent}
      </DialogContent>
    </Dialog>
  )
}
