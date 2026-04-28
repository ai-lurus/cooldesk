import { Search, ListFilter, Bell, Plus } from "lucide-react"

export function Header() {
  return (
    <header className="h-20 bg-brand-background flex items-center justify-between px-10 shrink-0">
      <div className="flex-1 max-w-2xl">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Buscar actividades, proyectos o tareas..."
            className="w-full bg-[#f4f4f5] border-transparent focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium text-brand-text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-4">
        {/* Icons */}
        <div className="flex items-center gap-1">
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-200/50 hover:text-gray-700 transition-colors">
            <ListFilter className="w-5 h-5" />
          </button>
          
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-200/50 hover:text-gray-700 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-brand-primary rounded-full ring-2 ring-brand-background"></span>
          </button>
        </div>

        {/* Action Button */}
        <button className="bg-brand-primary hover:bg-brand-primary-hover text-white flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all">
          <Plus className="w-4 h-4" />
          Nueva tarea
        </button>
      </div>
    </header>
  )
}
