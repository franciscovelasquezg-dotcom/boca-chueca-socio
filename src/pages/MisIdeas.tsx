import { BookOpen, Trash2 } from 'lucide-react'
import { useIdeaStore } from '../store/ideaStore'
import { IdeaBox }      from '../components/ui/IdeaBox'
import type { IdeaSource } from '../types'

const tipoConfig: Record<IdeaSource, { label: string; color: string }> = {
  francisco:   { label: '📌 Avance',  color: 'bg-[#3c2f00] text-[#eac349] border-[#eac349]'  },
  cliente:     { label: '💡 Idea',    color: 'bg-[#2b110b] text-[#ecbbb0] border-[#8e241e]'  },
  observacion: { label: '🔍 Decisión',color: 'bg-[#0d1a2b] text-[#93c5fd] border-[#1d4ed8]'  },
  staff:       { label: '📝 Nota',    color: 'bg-[#1c1b1b] text-[#9d8d8a] border-[#504441]'  },
}

export function MisIdeas() {
  const { ideas, removeIdea } = useIdeaStore()

  // Agrupar por fecha
  const grouped = ideas.reduce<Record<string, typeof ideas>>((acc, idea) => {
    const fecha = new Date(idea.fecha).toLocaleDateString('es-CL', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
    if (!acc[fecha]) acc[fecha] = []
    acc[fecha].push(idea)
    return acc
  }, {})

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="font-display text-[#ecbbb0] font-black italic text-3xl sm:text-4xl">
          Bitácora del Proyecto
        </h1>
        <p className="text-[#9d8d8a] text-sm mt-1">
          Registro cronológico de avances, ideas, decisiones y notas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Historial */}
        <div className="lg:col-span-2 space-y-6">

          {ideas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-[#504441]/30 gap-4 text-center px-4">
              <BookOpen size={40} className="text-[#504441]" />
              <p className="text-[#9d8d8a] text-sm">La bitácora está vacía.</p>
              <p className="text-[#504441] text-xs">Usa el formulario para registrar el primer avance del proyecto.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([fecha, entradas]) => (
              <div key={fecha}>
                {/* Fecha como separador */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px flex-1 bg-[#504441]/40" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9d8d8a] shrink-0 capitalize">
                    {fecha}
                  </p>
                  <div className="h-px flex-1 bg-[#504441]/40" />
                </div>

                <div className="space-y-2">
                  {entradas.map(idea => {
                    const cfg = tipoConfig[idea.source] ?? tipoConfig.staff
                    return (
                      <div
                        key={idea.id}
                        className="bg-[#1c1b1b] border border-[#504441] p-4 hover:border-[#9d8d8a] transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          {/* Tipo */}
                          <span className={`text-[10px] font-bold px-2 py-1 border shrink-0 ${cfg.color}`}>
                            {cfg.label}
                          </span>

                          {/* Contenido */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[#e5e2e1] text-sm leading-relaxed">{idea.contenido}</p>
                            <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                              <p className="text-[#504441] text-[10px] uppercase tracking-wider">
                                {new Date(idea.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                {' · '}{idea.autor}
                              </p>
                              <button
                                onClick={() => removeIdea(idea.id)}
                                className="opacity-0 group-hover:opacity-100 text-[#504441] hover:text-[#ffb4ab] transition-all p-1"
                                title="Eliminar entrada"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* IdeaBox lateral */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-20">
            <IdeaBox />
          </div>
        </div>

      </div>
    </div>
  )
}
