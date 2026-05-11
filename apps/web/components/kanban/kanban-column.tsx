import { Plus } from "lucide-react"

export interface KanbanColumnProps {
  id: string
  title: string
  count: number
  children?: React.ReactNode
}

export function KanbanColumn({ title, count, children }: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-[280px] shrink-0">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            {title}
          </h3>
          <span className="flex items-center justify-center bg-gray-100 text-gray-600 text-[10px] font-bold h-5 min-w-[20px] px-1.5 rounded-full">
            {count}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex flex-col gap-3 min-h-[150px] rounded-lg">
        {children}
        
        {/* Helper text for empty "Hecho" column based on mockup */}
        {!children && title === "HECHO" && (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50">
            <span className="text-2xl mb-2">🎉</span>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              ¡BUEN TRABAJO!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
