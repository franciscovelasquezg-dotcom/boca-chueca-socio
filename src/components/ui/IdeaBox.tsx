import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { BookOpen, CheckCheck, Tag } from 'lucide-react'
import { useIdeaStore } from '../../store/ideaStore'
import { useAuthStore } from '../../store/authStore'
import type { IdeaSource } from '../../types'

const TIPOS: { value: IdeaSource; label: string; color: string }[] = [
  { value: 'francisco',   label: '📌 Avance',   color: 'bg-[#3c2f00] text-[#eac349] border-[#eac349]'  },
  { value: 'cliente',     label: '💡 Idea',      color: 'bg-[#2b110b] text-[#ecbbb0] border-[#8e241e]'  },
  { value: 'observacion', label: '🔍 Decisión',  color: 'bg-[#0d1a2b] text-[#93c5fd] border-[#1d4ed8]'  },
  { value: 'staff',       label: '📝 Nota',      color: 'bg-[#1c1b1b] text-[#9d8d8a] border-[#504441]'  },
]

export function IdeaBox() {
  const [text, setText]     = useState('')
  const [tipo, setTipo]     = useState<IdeaSource>('francisco')
  const [sent, setSent]     = useState(false)
  const submitIdea = useIdeaStore(s => s.submitIdea)
  const ideas      = useIdeaStore(s => s.ideas)
  const nombre     = useAuthStore(s => s.nombre)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    submitIdea(text.trim(), nombre, tipo)
    setText('')
    setSent(true)
    setTimeout(() => setSent(false), 2000)

    const cfg = TIPOS.find(t => t.value === tipo)
    toast.custom((t) => (
      <div className={`
        flex items-center gap-3 bg-[#1c1b1b] border border-[#eac349]
        px-4 py-3 shadow-[0_4px_20px_rgba(234,195,73,0.1)] max-w-[90vw]
        transition-all duration-300
        ${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}>
        <CheckCheck size={16} className="text-[#eac349] shrink-0" />
        <div>
          <p className="font-bold text-[#e5e2e1] text-sm">¡Registrado en la bitácora!</p>
          <p className="text-[#9d8d8a] text-xs">{cfg?.label} guardado correctamente.</p>
        </div>
      </div>
    ), { duration: 3000, position: 'top-center' })
  }

  // Últimas 3 entradas para preview
  const recientes = ideas.slice(0, 3)

  return (
    <div className="bg-[#1c1b1b] border border-[#504441] overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 border-b border-[#504441] bg-[#131313] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={15} className="text-[#eac349] shrink-0" />
          <h3 className="font-display text-[#ecbbb0] italic font-bold text-base">Bitácora del Proyecto</h3>
        </div>
        {ideas.length > 0 && (
          <span className="text-[10px] font-bold text-[#9d8d8a] uppercase tracking-wider">
            {ideas.length} registros
          </span>
        )}
      </div>

      <div className="p-4 space-y-4">

        {/* Tipo de registro */}
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#504441] mb-2 flex items-center gap-1">
            <Tag size={9} /> Tipo de registro
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {TIPOS.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTipo(t.value)}
                className={`
                  py-2 px-2 text-[11px] font-bold border transition-all duration-150 text-left
                  ${tipo === t.value ? t.color : 'bg-transparent border-[#353534] text-[#504441] hover:border-[#504441]'}
                `}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* TextArea */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#504441] mb-2">
              ¿Qué quieres registrar?
            </p>
            <textarea
              rows={5}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={
                tipo === 'francisco'   ? 'Ej: Encontramos local en Barrio Italia, vamos a verlo el viernes...' :
                tipo === 'cliente'     ? 'Ej: Podríamos ofrecer una opción de tabla sin mariscos...' :
                tipo === 'observacion' ? 'Ej: Decidimos que el horario de apertura será de martes a domingo...' :
                                        'Ej: Recordar revisar los permisos de funcionamiento antes de mayo...'
              }
              className="
                w-full bg-[#131313] border border-[#504441]
                focus:border-[#eac349] text-[#e5e2e1] text-sm
                px-3 py-3 outline-none resize-none transition-colors
                placeholder:text-[#353534] leading-relaxed
              "
            />
            <p className="text-right text-[10px] text-[#353534] mt-1">{text.length} caracteres</p>
          </div>

          <button
            type="submit"
            disabled={!text.trim()}
            className="
              w-full min-h-[48px] flex items-center justify-center gap-2
              font-bold uppercase tracking-wider text-sm
              bg-[#eac349] text-[#131313]
              hover:bg-[#cca830] disabled:opacity-30 disabled:cursor-not-allowed
              active:scale-[0.99] transition-all duration-150
            "
          >
            {sent
              ? <><CheckCheck size={15} /> ¡Guardado!</>
              : <><BookOpen size={15} /> Guardar en Bitácora</>
            }
          </button>
        </form>

        {/* Preview últimas entradas */}
        {recientes.length > 0 && (
          <div className="border-t border-[#504441]/50 pt-3 space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#504441]">
              Últimas entradas
            </p>
            {recientes.map(idea => {
              const cfg = TIPOS.find(t => t.value === idea.source) ?? TIPOS[3]
              return (
                <div key={idea.id} className="flex gap-2 p-2.5 bg-[#131313] border border-[#504441]/40">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 border shrink-0 self-start ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[#d5c3bf] text-xs leading-relaxed line-clamp-2">{idea.contenido}</p>
                    <p className="text-[#504441] text-[10px] mt-1">
                      {new Date(idea.fecha).toLocaleDateString('es-CL', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
            <a href="/ideas" className="block text-center text-[10px] text-[#9d8d8a] hover:text-[#eac349] uppercase tracking-wider pt-1 transition-colors">
              Ver bitácora completa →
            </a>
          </div>
        )}

      </div>
    </div>
  )
}
