import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Send, Lightbulb, CheckCheck } from 'lucide-react'
import { useIdeaStore } from '../../store/ideaStore'
import { useAuthStore } from '../../store/authStore'

export function IdeaBox() {
  const [text, setText]     = useState('')
  const [sent, setSent]     = useState(false)
  const submitIdea = useIdeaStore(s => s.submitIdea)
  const ideas      = useIdeaStore(s => s.ideas)
  const nombre     = useAuthStore(s => s.nombre)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    submitIdea(text.trim(), nombre)
    setText('')
    setSent(true)
    setTimeout(() => setSent(false), 2000)

    toast.custom((t) => (
      <div className={`
        flex items-center gap-3 bg-[#14321a] border border-[#4ade80]
        px-4 py-3 shadow-[0_4px_20px_rgba(74,222,128,0.15)] max-w-[90vw]
        transition-all duration-300
        ${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}>
        <CheckCheck size={16} className="text-[#4ade80] shrink-0" />
        <div>
          <p className="font-bold text-[#e5e2e1] text-sm">¡Idea enviada a la agenda!</p>
          <p className="text-[#86efac] text-xs">Francisco la verá en el Hub.</p>
        </div>
      </div>
    ), { duration: 3500, position: 'top-center' })
  }

  return (
    <div className="bg-[#1c1b1b] border border-[#504441] overflow-hidden">

      <div className="px-4 py-3 border-b border-[#504441] bg-[#131313] flex items-center gap-2">
        <Lightbulb size={15} className="text-[#eac349] shrink-0" />
        <h3 className="font-display text-[#ecbbb0] italic font-bold text-base">Buzón de Aportes</h3>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-[#9d8d8a] text-xs leading-relaxed">
          ¿Se te ocurrió algo? Escríbelo y llega directo a la agenda de trabajo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={4}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Ej: Vi en un bar que tienen la carta en QR con fotos de cada plato..."
            className="
              w-full bg-[#131313] border border-[#504441]
              focus:border-[#eac349] text-[#e5e2e1] text-sm
              px-3 py-3 outline-none resize-none transition-colors
              placeholder:text-[#504441] leading-relaxed
            "
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="
              w-full min-h-[48px] flex items-center justify-center gap-2
              font-bold uppercase tracking-wider text-sm
              bg-[#eac349] text-[#131313]
              hover:bg-[#cca830] disabled:opacity-30 disabled:cursor-not-allowed
              active:scale-[0.99] transition-all duration-200
            "
          >
            {sent ? <><CheckCheck size={15} /> ¡Enviada!</> : <><Send size={15} /> Enviar a la Agenda</>}
          </button>
        </form>

        {ideas.length > 0 && (
          <div className="pt-2 border-t border-[#504441]/50">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#504441] mb-3">
              Tus aportes ({ideas.length})
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {ideas.slice(0, 5).map(idea => (
                <div key={idea.id} className="flex items-start gap-2 p-2.5 bg-[#131313] border border-[#504441]/50">
                  <div className="w-1.5 h-1.5 bg-[#eac349] shrink-0 mt-1.5" />
                  <div className="min-w-0">
                    <p className="text-[#d5c3bf] text-xs leading-relaxed line-clamp-2">{idea.contenido}</p>
                    <p className="text-[#504441] text-[10px] mt-1">
                      {new Date(idea.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
