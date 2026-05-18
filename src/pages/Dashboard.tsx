import { useState } from 'react'
import {
  CheckCircle2, Clock, Circle,
  Globe, Server, Briefcase, Scale, Megaphone,
  Plus, Check, Zap, ListTodo,
} from 'lucide-react'
import { useProgressStore }         from '../store/progressStore'
import { useAuthStore }             from '../store/authStore'
import { useAdminTasks, type AdminTask } from '../hooks/useAdminTasks'
import type { Milestone }           from '../types'

// ─── Config visual ────────────────────────────────────────────────────────────
const catIcon  = { web: Globe, admin: Server, negocio: Briefcase, legal: Scale, marketing: Megaphone }
const catLabel = { web: 'Web', admin: 'Admin', negocio: 'Negocio', legal: 'Legal', marketing: 'Marketing' }

const PRIORIDAD_CFG = {
  high:   { label: 'Alta',  color: 'bg-secondary-container text-on-secondary-container border-secondary' },
  medium: { label: 'Media', color: 'bg-surface-container-highest text-on-surface-variant border-outline-variant' },
  low:    { label: 'Baja',  color: 'bg-surface-container text-outline border-outline-variant' },
}

const TIPO_LABEL: Record<string, string> = {
  user_feedback: 'Idea Cliente', dev: 'Dev', ops: 'Ops',
  recipe: 'Receta', market: 'Mercado', general: 'General',
}

const STATUS_CFG = {
  pending:     { label: 'Pendiente',   icon: Clock,        color: 'text-on-surface-variant' },
  in_progress: { label: 'En Progreso', icon: Zap,          color: 'text-primary-container'  },
  done:        { label: 'Completada',  icon: CheckCircle2, color: 'text-tertiary'            },
}

// ─── Card de tarea real ───────────────────────────────────────────────────────
function TareaCard({ tarea }: { tarea: AdminTask }) {
  const [open, setOpen]       = useState(false)
  const [subtareas, setSub]   = useState<{ id: string; texto: string; hecha: boolean }[]>([])
  const [nuevaSub, setNueva]  = useState('')

  const prioridad = PRIORIDAD_CFG[tarea.priority] ?? PRIORIDAD_CFG.medium
  const status    = STATUS_CFG[tarea.status]
  const StatusIcon = status.icon

  const addSub = () => {
    if (!nuevaSub.trim()) return
    setSub(s => [...s, { id: Date.now().toString(), texto: nuevaSub.trim(), hecha: false }])
    setNueva('')
  }
  const toggleSub = (id: string) =>
    setSub(s => s.map(x => x.id === id ? { ...x, hecha: !x.hecha } : x))

  const pct = subtareas.length > 0
    ? Math.round((subtareas.filter(s => s.hecha).length / subtareas.length) * 100)
    : 0

  return (
    <div className={`border-2 bg-surface-container p-5 shadow-block-sm transition-all
      ${tarea.status === 'in_progress' ? 'border-primary-container' : 'border-outline-variant'}
    `}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 border uppercase ${prioridad.color}`}>
              {prioridad.label}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-outline bg-surface-container-highest px-1.5 py-0.5">
              {TIPO_LABEL[tarea.type] ?? tarea.type}
            </span>
            <span className={`flex items-center gap-1 text-[10px] font-bold ${status.color}`}>
              <StatusIcon size={10} /> {status.label}
            </span>
          </div>
          <h4 className="font-display italic font-bold text-on-surface text-lg leading-snug">
            {tarea.title}
          </h4>
          {tarea.description && (
            <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">{tarea.description}</p>
          )}
        </div>
        <button onClick={() => setOpen(!open)}
          className="text-on-surface-variant hover:text-primary-container transition-colors p-1 shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">{open ? 'expand_less' : 'expand_more'}</span>
        </button>
      </div>

      {/* Tags */}
      {tarea.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tarea.tags.map(t => (
            <span key={t} className="text-[9px] text-outline bg-surface-container-highest px-1.5 py-0.5 uppercase tracking-wider">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Subtareas (solo si hay o expandido) */}
      {(open || subtareas.length > 0) && (
        <>
          {subtareas.length > 0 && (
            <>
              <div className="flex justify-between text-[11px] font-bold mb-1.5">
                <span className="text-on-surface-variant uppercase tracking-wider">
                  Subtareas {subtareas.filter(s => s.hecha).length}/{subtareas.length}
                </span>
                <span className="text-primary-container">{pct}%</span>
              </div>
              <div className="w-full h-1.5 border border-on-surface bg-background mb-3">
                <div className="h-full progress-gradient transition-all" style={{ width: `${pct}%` }} />
              </div>
              <ul className="space-y-2 mb-3">
                {subtareas.map(sub => (
                  <li key={sub.id} className="flex items-center gap-2.5 cursor-pointer group"
                    onClick={() => toggleSub(sub.id)}>
                    <div className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-all
                      ${sub.hecha ? 'bg-tertiary-container border-tertiary-container' : 'border-outline-variant group-hover:border-primary-container bg-background'}`}>
                      {sub.hecha && <Check size={11} className="text-background" strokeWidth={3} />}
                    </div>
                    <span className={`text-sm transition-colors ${sub.hecha ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                      {sub.texto}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {open && (
            <div className="flex gap-2 pt-3 border-t border-outline-variant">
              <input value={nuevaSub} onChange={e => setNueva(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSub()}
                placeholder="Agregar subtarea..."
                className="flex-1 bg-background border border-outline-variant focus:border-primary-container text-on-surface px-3 py-2 text-sm outline-none transition-colors placeholder:text-outline" />
              <button onClick={addSub}
                className="bg-primary-container text-on-primary-container border-2 border-on-surface shadow-block-sm px-3 py-2 font-bold active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
                <Plus size={14} />
              </button>
            </div>
          )}
        </>
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
      {!last && (
        <div className={`absolute left-[15px] top-8 bottom-0 w-[2px] ${isDone ? 'bg-tertiary-container' : 'bg-outline-variant'}`} />
      )}
      <div className={`absolute left-0 top-1 w-8 h-8 border-2 flex items-center justify-center z-10
        ${isDone ? 'bg-surface-container-low border-tertiary-container' :
          isWIP  ? 'bg-surface-container-low border-primary-container pulse-gold' :
                   'bg-surface-container-low border-outline-variant'}`}>
        {isDone ? <CheckCircle2 size={14} className="text-tertiary" /> :
         isWIP  ? <Clock size={14} className="text-primary" /> :
                  <Circle size={12} className="text-outline-variant" />}
      </div>
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className={`font-bold text-[11px] uppercase tracking-widest ${isDone ? 'text-tertiary' : isWIP ? 'text-primary' : 'text-on-surface-variant'}`}>
            {isDone ? `COMPLETADO${m.fecha ? ` · ${new Date(m.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}` : ''}` :
             isWIP  ? 'EN CURSO · ACTUAL' : 'PENDIENTE'}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-outline inline-flex items-center gap-0.5">
            <Icon size={9} /> {catLabel[m.categoria]}
          </span>
        </div>
        <h4 className={`font-display italic font-bold text-xl leading-snug ${isDone ? 'text-on-surface' : isWIP ? 'text-on-surface' : 'text-outline'}`}>
          {m.titulo}
        </h4>
        {m.descripcion && (
          <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">{m.descripcion}</p>
        )}
      </div>
    </div>
  )
}

// ─── Vista principal ──────────────────────────────────────────────────────────
export function Dashboard() {
  const milestones          = useProgressStore(s => s.milestones)
  const nombre              = useAuthStore(s => s.nombre)
  const { active, done: tasksDone, tasks } = useAdminTasks()

  const done    = milestones.filter(m => m.status === 'done')
  const active2 = milestones.filter(m => m.status === 'in_progress')
  const pending = milestones.filter(m => m.status === 'pending')
  const all     = [...active2, ...done, ...pending]
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
            {tasks.length} tareas · {tasksDone.length} completadas
          </span>
        </div>
      </section>

      {/* Progreso del proyecto */}
      <section className="bg-surface-container-low border-2 border-outline-variant p-6 shadow-block">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h2 className="font-bold text-[11px] uppercase tracking-widest text-on-surface-variant">Progreso Global del Proyecto</h2>
          <span className="font-display italic font-bold text-primary-container text-2xl">{pct}% completado</span>
        </div>
        <div className="w-full h-8 border-2 border-on-surface bg-surface-container-highest">
          <div className="h-full progress-gradient border-r-2 border-on-surface transition-all duration-1000" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex gap-6 mt-3 text-[11px] font-bold text-on-surface-variant flex-wrap">
          <span><span className="text-tertiary">{done.length}</span> hitos completados</span>
          <span><span className="text-primary">{active2.length}</span> en curso</span>
          <span><span className="text-outline">{pending.length}</span> pendientes</span>
        </div>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Timeline */}
        <div className="lg:col-span-7">
          <section className="bg-surface-container-low border-2 border-outline-variant p-6 shadow-block">
            <h3 className="font-bold text-[11px] uppercase tracking-widest text-on-surface-variant mb-6">Línea de Tiempo del Proyecto</h3>
            <div className="relative before:content-[''] before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant">
              {all.map((m, i) => (
                <MilestoneItem key={m.id} m={m} last={i === all.length - 1} />
              ))}
            </div>
          </section>
        </div>

        {/* Tareas activas reales */}
        <div className="lg:col-span-5">
          <section className="bg-surface-container-low border-2 border-outline-variant p-6 shadow-block">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[11px] uppercase tracking-widest text-on-surface-variant">
                Tareas Activas
              </h3>
              <span className="text-primary-container font-bold text-sm flex items-center gap-1">
                <ListTodo size={14} /> {active.length} tareas
              </span>
            </div>

            {active.length === 0 ? (
              <div className="text-center py-12 border border-outline-variant/30">
                <CheckCircle2 size={32} className="text-tertiary mx-auto mb-2" />
                <p className="text-on-surface-variant text-sm">Sin tareas activas</p>
                <p className="text-outline text-xs uppercase tracking-wider mt-1">Todo al día</p>
              </div>
            ) : (
              <div className="space-y-4">
                {active.slice(0, 4).map(t => <TareaCard key={t.id} tarea={t} />)}
                {active.length > 4 && (
                  <p className="text-center text-[11px] text-outline uppercase tracking-wider">
                    +{active.length - 4} tareas más en la agenda
                  </p>
                )}
              </div>
            )}
          </section>
        </div>

      </div>
    </div>
  )
}
