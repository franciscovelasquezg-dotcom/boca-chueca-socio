import { useState, type FormEvent } from 'react'
import { Trash2, Paperclip, Camera, Send } from 'lucide-react'
import { useIdeaStore } from '../store/ideaStore'
import { useAuthStore } from '../store/authStore'
import type { IdeaSource } from '../types'

const TIPOS: { value: IdeaSource; label: string; mat: string; activeClass: string }[] = [
  { value: 'francisco',   label: 'Avance',  mat: 'push_pin', activeClass: 'border-primary-container bg-primary-container/10 text-primary-container'  },
  { value: 'cliente',     label: 'Idea',    mat: 'lightbulb',activeClass: 'border-outline text-on-surface-variant bg-surface-container'                },
  { value: 'observacion', label: 'Decisión',mat: 'search',   activeClass: 'border-secondary text-secondary bg-secondary-container/10'                 },
  { value: 'staff',       label: 'Nota',    mat: 'note',     activeClass: 'border-on-surface text-on-surface bg-surface-container'                    },
]

const BADGE: Record<IdeaSource, { label: string; cls: string }> = {
  francisco:   { label: '📌 Avance',  cls: 'border-primary-container text-primary-container'  },
  cliente:     { label: '💡 Idea',    cls: 'border-outline text-on-surface-variant'            },
  observacion: { label: '🔍 Decisión',cls: 'border-secondary text-secondary'                  },
  staff:       { label: '📝 Nota',    cls: 'border-on-surface text-on-surface'                },
}

export function MisIdeas() {
  const { ideas, removeIdea, submitIdea } = useIdeaStore()
  const nombre   = useAuthStore(s => s.nombre)
  const [tipo, setTipo]   = useState<IdeaSource>('francisco')
  const [texto, setTexto] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!texto.trim()) return
    submitIdea(texto.trim(), nombre, tipo)
    setTexto('')
  }

  // Agrupar por fecha
  const grouped = ideas.reduce<Record<string, typeof ideas>>((acc, idea) => {
    const d   = new Date(idea.fecha)
    const hoy = new Date()
    const ayer = new Date(); ayer.setDate(hoy.getDate() - 1)
    let label: string
    if (d.toDateString() === hoy.toDateString())  label = 'Hoy'
    else if (d.toDateString() === ayer.toDateString()) label = 'Ayer'
    else label = d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })
    if (!acc[label]) acc[label] = []
    acc[label].push(idea)
    return acc
  }, {})

  return (
    <div className="space-y-6 pb-64 md:pb-8">

      {/* Header */}
      <div>
        <h1 className="font-display italic font-bold text-on-surface text-3xl sm:text-4xl">Bitácora</h1>
        <p className="text-on-surface-variant text-sm mt-1">Registro diario del progreso del proyecto.</p>
      </div>

      {/* Entradas agrupadas por fecha */}
      {ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-outline-variant gap-4 text-center px-4 bg-surface-container-low shadow-block">
          <span className="material-symbols-outlined text-outline text-5xl">history_edu</span>
          <p className="text-on-surface-variant text-sm">La bitácora está vacía.</p>
          <p className="text-outline text-xs uppercase tracking-wider">Usa el formulario inferior para el primer registro</p>
        </div>
      ) : (
        Object.entries(grouped).map(([fecha, entradas]) => (
          <section key={fecha}>
            {/* Separador de fecha — estilo Stitch */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] flex-grow bg-on-surface opacity-20" />
              <h2 className="font-bold text-[11px] uppercase tracking-widest text-primary-fixed-dim shrink-0">{fecha}</h2>
              <div className="h-[2px] flex-grow bg-on-surface opacity-20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entradas.map(idea => {
                const badge = BADGE[idea.source] ?? BADGE.staff
                return (
                  <article
                    key={idea.id}
                    className="bg-surface-container-low border-2 border-outline-variant p-6 shadow-block hover-lift group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-3 py-1 border-2 font-bold text-[10px] uppercase tracking-wider ${badge.cls}`}>
                        {badge.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[11px] text-on-surface-variant">
                          {new Date(idea.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={() => removeIdea(idea.id)}
                          className="opacity-0 group-hover:opacity-100 text-outline hover:text-secondary transition-all p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-on-surface text-base leading-relaxed">{idea.contenido}</p>
                    <p className="text-outline text-[10px] uppercase tracking-wider mt-3">{idea.autor}</p>
                  </article>
                )
              })}
            </div>
          </section>
        ))
      )}

      {/* Form sticky inferior — estilo Stitch (móvil) / inline (desktop) */}
      <div className="
        fixed bottom-0 left-0 w-full z-40 md:static
        px-4 md:px-0 py-4 md:py-0
        bg-gradient-to-t from-background via-background to-transparent
        md:bg-transparent md:from-transparent md:via-transparent md:to-transparent
        pb-24 md:pb-0
      ">
        <form
          onSubmit={handleSubmit}
          className="max-w-7xl mx-auto bg-surface-container-highest border-2 border-on-surface p-4 shadow-block-lg flex flex-col gap-4"
        >
          {/* Selector de tipo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {TIPOS.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTipo(t.value)}
                className={`
                  flex items-center justify-center gap-2 border-2 py-2.5 min-h-[44px]
                  font-bold text-[10px] uppercase tracking-wider transition-all
                  active:translate-y-0.5
                  ${tipo === t.value ? t.activeClass : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'}
                `}
              >
                <span className="material-symbols-outlined text-sm">{t.mat}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(e as unknown as FormEvent) }}
            placeholder="¿Qué pasó hoy en el proyecto?"
            rows={3}
            className="
              w-full bg-surface-container-low border-2 border-outline-variant
              focus:border-primary-container text-on-surface
              p-4 min-h-[80px] outline-none transition-colors resize-none
              placeholder:text-outline
            "
          />

          {/* Fila de acciones */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button type="button" className="text-on-surface-variant hover:text-primary-container transition-colors p-1" title="Adjuntar archivo">
                <Paperclip size={18} />
              </button>
              <button type="button" className="text-on-surface-variant hover:text-primary-container transition-colors p-1" title="Agregar foto">
                <Camera size={18} />
              </button>
            </div>
            <button
              type="submit"
              disabled={!texto.trim()}
              className="
                flex items-center gap-2
                bg-primary-container text-on-primary-container
                px-8 py-3 border-2 border-on-surface shadow-block
                font-bold uppercase tracking-widest text-sm
                active:translate-x-0.5 active:translate-y-0.5 active:shadow-block-sm
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all min-h-[44px]
              "
            >
              <Send size={14} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
