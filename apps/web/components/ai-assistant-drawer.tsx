"use client"

import { useState } from "react"
import { Bot, X, Send } from "lucide-react"

export function AiAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-0 right-0 z-10 w-12 h-12 rounded-xl bg-[#F6F0EB] flex items-center justify-center hover:bg-[#F2E5D9] transition-colors shadow-sm"
      >
        <Bot className="w-6 h-6 text-[#E46B26]" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-2xl border-l border-gray-100 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-[#E46B26] font-bold text-xl">AI Assistant</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile */}
        <div className="px-6 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F6F0EB] flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#E46B26]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-brand-text">Cognitive Architect</h3>
            <p className="text-[10px] text-gray-400 tracking-wider uppercase font-semibold">
              Online & Ready
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex items-center gap-6 border-b border-gray-100 pb-2">
          <button className="text-sm font-bold text-[#E46B26] border-b-2 border-[#E46B26] pb-2 -mb-[9px]">
            Chat
          </button>
          <button className="text-sm font-semibold text-gray-400 hover:text-gray-600 pb-2">
            Insights
          </button>
          <button className="text-sm font-semibold text-gray-400 hover:text-gray-600 pb-2">
            History
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Bot Message */}
          <div className="flex gap-2">
            <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-700 leading-relaxed shadow-sm">
              ¡Hola! Soy tu asistente. ¿En qué puedo ayudarte hoy a optimizar tu flujo de trabajo?
            </div>
          </div>

          {/* User/Waiting Message */}
          <div className="flex gap-2 self-end w-[85%]">
            <div className="bg-[#F6F0EB] rounded-2xl rounded-tr-sm p-4 text-sm text-gray-600 w-full shadow-sm">
              Esperando tu mensaje...
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 pt-2 bg-white">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2 border border-gray-100">
            <input 
              type="text" 
              placeholder="Pregunta algo..." 
              className="flex-1 bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-gray-400"
            />
            <button className="bg-[#D9531E] hover:bg-[#C24115] text-white p-2 rounded-lg transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
