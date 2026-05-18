import { useState } from 'react'
import { CheckCircle2, Clock, Circle, Globe, Server, Briefcase, Scale, Megaphone, Plus, Check } from 'lucide-react'
import { useProgressStore } from '../store/progressStore'
import { useAuthStore }     from '../store/authStore'
import { useIdeaStore }     from '../store/ideaStore'

import type { Milestone }   from '../types'

// ─── Configuración visual ────────────────────────────────────────────────────
const catIcon  = { web: Globe, admin: Server, negocio: Briefcase, legal: Scale, marketing: Megaphone }
const catLabel = { web: 'Web', admin: 'Admin', negocio: 'Negocio', legal: 'Legal', marketing: 'Marketing' }

// ─── Tareas con subtareas (hardcodeadas hasta conectar Supabase) ──────────────
interface Subtarea { id: string; texto: string; hecha: boolean }
interface TareaActiva {
  id: string; titulo: string; prioridad: 'Alta' | 'Media' | 'Baja'
  subtareas: Subtarea[]
}

const TAREAS_INICIALES: TareaActiva[] = [
  {
    id: '1', titulo: 'Buscar local en Barrio Italia', prioridad: 'Alta',
    subtareas: [
      { id: '1a', texto: 'Definir m² mínimos y presupuesto de arriendo', hecha: true },
      { id: '1b', texto: 'Visitar locales disponibles en Condell y Girardi', hecha: false },
      { id: '1c', texto: 'Evaluar cocina habilitada y extractor', hecha: false },
      { id: '1d', texto: 'Negociar condiciones con arrendador', hecha: false },
    ],
  },
  {
    id: '2', titulo: 'Carta definitiva lista para imprimir', prioridad: 'Alta',
    subtareas: [
      { id: '2a', texto: 'Aprobar tapas incluidas con jarra', hecha: true },
      { id: '2b', texto: 'Definir precios tablas y platos', hecha: true },
      { id: '2c', texto: 'Diseño gráfico de carta física', hecha: false },
      { id: '2d', texto: 'Impresión prueba y revisión final', hecha: false },
    ],
  },
  {
    id: '3', titulo: 'Estructura legal de la sociedad', prioridad: 'Media',
    subtareas: [
      { id: '3a', texto: 'Definir porcentajes entre socios', hecha: false },
      { id: '3b', texto: 'Reunión con notaría', hecha: false },
      { id: '3c', texto: 'Inscripción SII y obtención RUT', hecha: false },
    ],
  },
]

// ─── Componente tarea con subtareas ──────────────────────────────────────────
function TareaCard({ tarea }: { tarea: TareaActiva }) {
  const [subtareas, setSubtareas] = useState(tarea.subtareas)
  const [expanded, setExpanded]   = useState(false)
  const [nuevaSub, setNuevaSub]   = useState('')

  const toggle  = (id: string) => setSubtareas(s => s.map(x => x.id === id ? { ...x, hecha: !x.hecha } : x))
  const addSub  = () => {
    if (!nuevaSub.trim()) return
    setSubtareas(s => [...s, { id: Date.now().toString(), texto: nuevaSub.trim(), hecha: false }])
    setNuevaSub('')
  }

  const hechas  = subtareas.filter(s => s.hecha).length
  const pct     = subtareas.length > 0 ? Math.round((hechas / subtareas.length) * 100) : 0
  const prioCol = { Alta: 'bg-secondary-container text-on-secondary-container border-secondary', Media: 'bg-surface-container-highest text-on-surface-variant border-outline-variant', Baja: 'bg-surface-container text-outline border-outline-variant' }

  return (
    <div className="border-2 border-outline-variant bg-surface-container p-5 shadow-block-sm hover-lift">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0 pr-2">
          <h4 className="font-display italic font-bold text-on-surface text-lg leading-snug">{tarea.titulo}</h4>
          <span className={`mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 border uppercase ${prioCol[tarea.prioridad]}`}>
            Prioridad: {tarea.prioridad}
          </span>
        </div>
        <button onClick={() => setExpanded(!expanded)}
          className="text-on-surface-variant hover:text-primary-container transition-colors p-1 shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">{expanded ? 'expand_less' : 'expand_more'}</span>
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex justify-between text-[11px] font-bold mb-1.5">
          <span className="text-on-surface-variant uppercase tracking-wider">Subtareas {hechas}/{subtareas.length}</span>
          <span className="text-primary-container">{pct}%</span>
        </div>
        <div className="w-full h-2 border border-on-surface bg-background">
          <div className="h-full progress-gradient transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Checklist */}
      <ul className="space-y-3">
        {subtareas.slice(0, expanded ? undefined : 3).map(sub => (
          <li key={sub.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggle(sub.id)}>
            <div className={`
              w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-all
              ${sub.hecha ? 'bg-tertiary-container border-tertiary-container' : 'border-outline-variant group-hover:border-primary-container bg-background'}
            `}>
              {sub.hecha && <Check size={12} className="text-background" strokeWidth={3} />}
            </div>
            <span className={`text-sm transition-colors leading-snug ${sub.hecha ? 'line-through text-on-surface-variant' : 'text-on-surface group-hover:text-primary'}`}>
              {sub.texto}
            </span>
          </li>
        ))}
        {!expanded && subtareas.length > 3 && (
          <li className="text-[11px] text-outline uppercase tracking-wider pl-8 cursor-pointer hover:text-primary-container transition-colors"
            onClick={() => setExpanded(true)}>
            +{subtareas.length - 3} más...
          </li>
        )}
      </ul>

      {/* Agregar subtarea (solo expandido) */}
      {expanded && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-outline-variant">
          <input value={nuevaSub} onChange={e => setNuevaSub(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSub()}
            placeholder="Nueva subtarea..."
            className="flex-1 bg-background border border-outline-variant focus:border-primary-container text-on-surface px-3 py-2 text-sm outline-none transition-colors placeholder:text-outline" />
          <button onClick={addSub}
            className="bg-primary-container text-on-primary-container border-2 border-on-surface shadow-block-sm px-4 py-2 font-bold uppercase text-xs tracking-widest active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all min-w-[44px]">
            <Plus size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Item del timeline ────────────────────────────────────────────────────────
function MilestoneItem({ m, last }: { m: Milestone; last: boolean }) {
  const Icon   = catIcon[m.categoria]
  const isDone = m.status === 'done'
  const isWIP  = m.status === 'in_progress'

  return (
    <div className="relative pl-12 pb-8">
      {/* Línea vertical */}
      {!last && (
        <div className={`absolute left-[15px] top-8 bottom-0 w-[2px] ${isDone ? 'bg-tertiary-container' : 'bg-outline-variant'}`} />
      )}

      {/* Dot */}
      <div className={`
        absolute left-0 top-1 w-8 h-8 border-2 flex items-center justify-center z-10
        ${isDone ? 'bg-surface-container-low border-tertiary-container' :
          isWIP  ? 'bg-surface-container-low border-primary-container pulse-gold' :
                   'bg-surface-container-low border-outline-variant'}
      `}>
        {isDone
          ? <CheckCircle2 size={14} className="text-tertiary" />
          : isWIP
            ? <Clock size={14} className="text-primary" />
            : <Circle size={12} className="text-outline-variant" />
        }
      </div>

      {/* Contenido */}
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className={`font-bold text-[11px] uppercase tracking-widest ${isDone ? 'text-tertiary' : isWIP ? 'text-primary' : 'text-on-surface-variant'}`}>
            {isDone ? `COMPLETADO${m.fecha ? ` · ${new Date(m.fecha).toLocaleDateString('es-CL',{day:'numeric',month:'short'})}` : ''}` :
             isWIP  ? 'EN CURSO · ACTUAL' : 'PENDIENTE'}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-0.5 ${isDone ? 'text-tertiary/70' : 'text-outline'}`}>
            <Icon size={9} /> {catLabel[m.categoria]}
          </span>
        </div>
        <h4 className={`font-display italic font-bold text-xl leading-snug ${isDone ? 'text-on-surface' : isWIP ? 'text-on-surface' : 'text-outline'}`}>
          {m.titulo}
        </h4>
        {m.descripcion && (
          <p className="font-body-md text-on-surface-variant text-sm mt-1 leading-relaxed">{m.descripcion}</p>
        )}
      </div>
    </div>
  )
}

// ─── Vista principal ──────────────────────────────────────────────────────────
export function Dashboard() {
  const milestones = useProgressStore(s => s.milestones)
  const nombre     = useAuthStore(s => s.nombre)
  const ideas      = useIdeaStore(s => s.ideas)

  const done    = milestones.filter(m => m.status === 'done')
  const active  = milestones.filter(m => m.status === 'in_progress')
  const pending = milestones.filter(m => m.status === 'pending')
  const all     = [...active, ...done, ...pending]
  const pct     = Math.round((done.length / milestones.length) * 100)
  const hoy     = new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="space-y-8">

      {/* Hero */}
      <section>
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-2">
          <div>
            <h1 className="font-display italic font-bold text-primary text-4xl sm:text-5xl leading-tight">
              Hola, {nombre} 👋
            </h1>
            <p className="text-on-surface-variant mt-1 capitalize">{hoy}</p>
          </div>
          <span className="hidden md:inline font-bold text-[11px] border-2 border-primary-container text-primary-container px-4 py-1.5 uppercase tracking-widest">
            PORTAL v1.0 · {ideas.length} registros
          </span>
        </div>
      </section>

      {/* Barra de progreso */}
      <section className="bg-surface-container-low border-2 border-outline-variant p-6 shadow-block">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h2 className="font-bold text-[11px] uppercase tracking-widest text-on-surface-variant">Progreso Global del Proyecto</h2>
          <span className="font-display italic font-bold text-primary-container text-2xl">{pct}% completado</span>
        </div>
        <div className="w-full h-8 border-2 border-on-surface bg-surface-container-highest">
          <div className="h-full progress-gradient border-r-2 border-on-surface transition-all duration-1000" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex gap-6 mt-3 text-[11px] font-bold text-on-surface-variant flex-wrap">
          <span><span className="text-tertiary">{done.length}</span> completados</span>
          <span><span className="text-primary">{active.length}</span> en curso</span>
          <span><span className="text-outline">{pending.length}</span> pendientes</span>
        </div>
      </section>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Columna izquierda — Timeline */}
        <div className="lg:col-span-7 space-y-8">

          {/* Timeline */}
          <section className="bg-surface-container-low border-2 border-outline-variant p-6 shadow-block">
            <h3 className="font-bold text-[11px] uppercase tracking-widest text-on-surface-variant mb-6">Línea de Tiempo</h3>
            <div className="relative before:content-[''] before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant">
              {all.map((m, i) => (
                <MilestoneItem key={m.id} m={m} last={i === all.length - 1} />
              ))}
            </div>
          </section>

        </div>

        {/* Columna derecha — Tareas activas + IdeaBox desktop */}
        <div className="lg:col-span-5 space-y-8">

          {/* Tareas con subtareas */}
          <section className="bg-surface-container-low border-2 border-outline-variant p-6 shadow-block">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[11px] uppercase tracking-widest text-on-surface-variant">Tareas Activas</h3>
              <span className="text-primary-container font-bold text-sm">{TAREAS_INICIALES.length} tareas</span>
            </div>
            <div className="space-y-4">
              {TAREAS_INICIALES.map(t => <TareaCard key={t.id} tarea={t} />)}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
