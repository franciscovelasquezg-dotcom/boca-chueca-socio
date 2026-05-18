import { CheckCheck, Clock, Eye, XCircle, Lightbulb } from 'lucide-react'
import { useIdeaStore } from '../store/ideaStore'
import { IdeaBox }      from '../components/ui/IdeaBox'

const estadoConfig = {
  pendiente:    { label: 'Pendiente',     icon: Clock,       color: 'text-[#9d8d8a] border-[#504441] bg-[#1c1b1b]' },
  en_revision:  { label: 'En revisión',   icon: Eye,         color: 'text-[#eac349] border-[#eac349] bg-[#3c2f00]' },
  implementada: { label: 'Implementada',  icon: CheckCheck,  color: 'text-[#4ade80] border-[#4ade80] bg-[#14321a]' },
  descartada:   { label: 'Descartada',    icon: XCircle,     color: 'text-[#9d8d8a] border-[#504441] bg-[#1c1b1b]' },
}

export function MisIdeas() {
  const ideas = useIdeaStore(s => s.ideas)

  return (
    <div className="space-y-8">

      <div>
        <h1 className="font-display text-[#ecbbb0] font-black italic text-3xl sm:text-4xl">Mis Aportes</h1>
        <p className="text-[#9d8d8a] text-sm mt-1">Todo lo que has enviado a la agenda de trabajo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Lista de ideas */}
        <div className="lg:col-span-2 space-y-3">
          {ideas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-[#504441]/30 gap-4">
              <Lightbulb size={40} className="text-[#504441]" />
              <p className="text-[#504441] text-sm uppercase tracking-wider">Aún no has enviado aportes</p>
              <p className="text-[#504441] text-xs">Usa el buzón para enviar tu primera idea</p>
            </div>
          ) : (
            ideas.map((idea, i) => {
              const cfg  = estadoConfig[idea.estado]
              const Icon = cfg.icon
              return (
                <div key={idea.id} className="bg-[#1c1b1b] border border-[#504441] p-5 hover:border-[#9d8d8a] transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-[#9d8d8a] font-bold text-xs shrink-0 mt-0.5">#{ideas.length - i}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#e5e2e1] text-sm leading-relaxed">{idea.contenido}</p>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 border ${cfg.color}`}>
                          <Icon size={10} /> {cfg.label}
                        </span>
                        <span className="text-[#504441] text-[10px]">
                          {new Date(idea.fecha).toLocaleDateString('es-CL', {
                            day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* IdeaBox lateral */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <IdeaBox />
          </div>
        </div>
      </div>
    </div>
  )
}
