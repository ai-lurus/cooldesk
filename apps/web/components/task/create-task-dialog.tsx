"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calendar, ChevronDown, Info } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useKanbanContext, mockAssignees } from "@/components/kanban/kanban-context"
import type { Priority } from "@/components/kanban/kanban-card"
import { createTask } from "@/app/actions/task"

const taskSchema = z.object({
  title: z.string().min(1, "El nombre de la actividad es requerido"),
  description: z.string().optional(),
  columnId: z.string(),
  dueDate: z.string().optional(),
  priority: z.enum(["baja", "media", "alta", "urgente"]),
  assigneeId: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskSchema>

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const { columns, addTask } = useKanbanContext()
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
      priority: "urgente",
      columnId: "sin_iniciar",
      assigneeId: "",
      description: "",
      dueDate: "",
    },
  })

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await createTask({
        title: data.title,
        description: data.description,
        columnId: data.columnId,
        priority: data.priority,
        dueDate: data.dueDate,
        assigneeId: data.assigneeId || undefined,
      })

      if (result.success && result.task) {
        const newTask = {
          id: result.task.id,
          title: result.task.title,
          priority: data.priority as Priority,
          assignee: data.assigneeId ? mockAssignees[data.assigneeId] : undefined,
          dateInfo: data.dueDate ? { text: data.dueDate, isToday: false } : undefined,
        }
        addTask(data.columnId, newTask)
      }

      setIsSubmitting(false)
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create task", error)
      setIsSubmitting(false)
    }
  }

  // Selected assignees mock for the UI (using all 3 to match the design)
  const selectedAssignees = Object.values(mockAssignees)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* We use a visually hidden DialogTitle to satisfy accessibility requirements, 
          and render our own custom styled title below. */}
      <DialogContent className="sm:max-w-[760px] p-0 border-none bg-transparent shadow-none [&>button]:hidden">
        <DialogTitle className="sr-only">Nueva Tarea</DialogTitle>

        <div className="bg-white rounded-3xl w-full p-10 shadow-2xl relative">
          {/* Header section matching design */}
          <div className="mb-8 pl-4">
            <h1 className="text-[40px] font-extrabold text-[#A64A0B] inline-block relative mb-1 tracking-tight">
              Nueva tarea
              {/* Blue underline */}
              <div className="absolute -bottom-1 left-0 w-full h-[4px] bg-[#3B82F6]"></div>
            </h1>
            <p className="text-gray-500 font-medium text-[15px] mt-3">
              Define los parámetros para tu siguiente gran hito.
            </p>
          </div>

          {/* Form inside grey box */}
          <div className="bg-[#f9fafb] rounded-[24px] p-8 pb-10">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

              {/* Title */}
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  NOMBRE DE LA ACTIVIDAD
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Ej: Finalizar wireframes de usuario"
                  className={`w-full bg-white border border-transparent focus:border-brand-primary/30 rounded-xl py-3 px-4 text-[14px] outline-none placeholder:text-gray-400 focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium text-gray-800 shadow-sm ${errors.title ? "ring-2 ring-red-500/20 border-red-500" : ""
                    }`}
                  {...register("title")}
                />
                {errors.title && (
                  <span className="text-xs text-red-500">{errors.title.message}</span>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  DESCRIPCIÓN (OPCIONAL)
                </label>
                <textarea
                  id="description"
                  placeholder="Añade detalles sobre esta actividad..."
                  rows={4}
                  className="w-full bg-white border border-transparent focus:border-brand-primary/30 rounded-xl py-3 px-4 text-[14px] outline-none placeholder:text-gray-400 focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium text-gray-800 resize-none shadow-sm"
                  {...register("description")}
                />
              </div>

              {/* 2 Columns: Column & Due Date */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 relative">
                  <label htmlFor="columnId" className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    COLUMNA
                  </label>
                  <div className="relative">
                    <select
                      id="columnId"
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
                  <label htmlFor="dueDate" className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    FECHA LÍMITE
                  </label>
                  <div className="relative">
                    <input
                      id="dueDate"
                      type="date"
                      className="w-full bg-white border border-transparent focus:border-brand-primary/30 rounded-xl py-3 px-4 text-[14px] outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium text-gray-800 appearance-none shadow-sm pr-10 [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      {...register("dueDate")}
                    />
                    {/* Placeholder when empty since input type="date" doesn't support text placeholders natively the same way */}
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
                        const isSelected = field.value === p;
                        const label = p.charAt(0).toUpperCase() + p.slice(1);
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => field.onChange(p)}
                            className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all ${isSelected
                                ? "bg-[#F97316] text-white shadow-md"
                                : "bg-[#e5e7eb] text-gray-700 hover:bg-gray-300"
                              }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              {/* Assignee */}
              <div className="flex flex-col gap-3 mt-2">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  ASIGNAR A
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {selectedAssignees.map((assignee) => (
                      <div
                        key={assignee.id}
                        className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: assignee.color }}
                      >
                        {assignee.initials}
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 bg-white flex items-center justify-center text-gray-400 cursor-pointer hover:border-gray-400 transition-colors">
                      <span className="text-lg">+</span>
                    </div>
                  </div>
                  <span className="text-gray-500 font-medium text-sm ml-2">
                    {selectedAssignees.length} miembros seleccionados
                  </span>

                  {/* Hidden input to store value if we needed to hook it up to RHF */}
                  <input type="hidden" {...register("assigneeId")} value="JR" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-[14px] text-base font-bold bg-[#F97316] hover:bg-[#EA580C] text-white transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Creando..." : "Crear actividad"}
                </button>
              </div>

            </form>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-center gap-2 mt-6 text-gray-400">
            <Info className="w-4 h-4" />
            <span className="text-[12px] font-medium">
              Los cambios se guardarán automáticamente en el proyecto seleccionado.
            </span>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
