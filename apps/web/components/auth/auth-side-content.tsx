import Image from "next/image"

interface AuthSideContentProps {
  tag?: string
  title: string | React.ReactNode
  description: string
  imageSrc: string
}

export function AuthSideContent({
  tag,
  title,
  description,
  imageSrc,
}: AuthSideContentProps) {
  return (
    <div className="h-full max-h-full flex flex-col relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 w-full max-w-[440px] mb-8 shrink-0">
        {tag && (
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FCECE3] text-[#1A1A1A] text-[11px] font-bold tracking-widest uppercase mb-6">
            {tag}
          </div>
        )}
        
        <h2 className="text-[36px] md:text-[44px] lg:text-[52px] leading-[1.05] font-extrabold text-[#1A1A1A] mb-6 tracking-tighter">
          {title}
        </h2>
        
        <p className="text-[14px] md:text-[15px] text-[#666666] leading-relaxed font-medium">
          {description}
        </p>
      </div>

      {/* Image Container */}
      <div className="relative flex-1 min-h-0 w-full rounded-[24px] overflow-hidden">
        <Image
          src={imageSrc}
          alt="Illustration"
          fill
          className="object-cover"
        />
        
        {/* Overlay for text contrast if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent flex flex-col justify-end p-6 lg:p-8">
          <div className="text-[10px] lg:text-[11px] font-bold text-white/80 uppercase tracking-[0.2em] mb-1 lg:mb-2">
            Inteligencia de espacio de trabajo
          </div>
          <div className="text-lg lg:text-xl font-bold text-white tracking-tight">
            Diseñado para la claridad.
          </div>
        </div>
      </div>
    </div>
  )
}
