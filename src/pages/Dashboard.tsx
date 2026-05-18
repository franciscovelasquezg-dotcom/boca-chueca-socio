import { CheckCircle2, Clock, Circle, Globe, Server, Briefcase, Scale, Megaphone } from 'lucide-react'
import { useProgressStore } from '../store/progressStore'
import { useAuthStore }     from '../store/authStore'
import { IdeaBox }          from '../components/ui/IdeaBox'
import type { Milestone }   from '../types'

const catIcon = {
  web:       Globe,
  admin:     Server,
  negocio:   Briefcase,
  legal:     Scale,
  marketing: Megaphone,
}
const catColor = {
  web:       'text-[#93c5fd]',
  admin:     'text-[#c4b5fd]',
  negocio:   'text-[#eac349]',
  legal:     'text-[#86efac]',
  marketing: 'text-[#fdba74]',
}

function MilestoneItem({ m, last }: { m: Milestone; last: boolean }) {
  const Icon    = catIcon[m.categoria]
  const isDone  = m.status === 'done'
  const isWIP   = m.status === 'in_progress'

  return (
    <div className="flex gap-4 group">
      {/* Línea vertical + dot */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`
          w-9 h-9 rounded-none border-2 flex items-center justify-center shrink-0 transition-all
          ${isDone  ? 'bg-[#14321a] border-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.2)]' :
            isWIP   ? 'bg-[#3c2f00] border-[#eac349] shadow-[0_0_12px_rgba(234,195,73,0.2)]' :
                      'bg-[#1c1b1b] border-[#504441]'}
        `}>
          {isDone ? <CheckCircle2 size={16} className="text-[#4ade80]" /> :
           isWIP  ? <Clock size={16} className="text-[#eac349] animate-pulse" /> :
                    <Circle size={16} className="text-[#504441]" />}
        </div>
        {!last && <div className={`w-px flex-1 mt-1 min-h-[24px] ${isDone ? 'bg-[#4ade80]/30' : 'bg-[#504441]/40'}`} />}
      </div>

      {/* Contenido */}
      <div className={`pb-6 flex-1 min-w-0 ${last ? '' : ''}`}>
        <div className="flex items-start gap-2 flex-wrap">
          <h3 className={`font-display italic font-bold text-base leading-tight ${isDone ? 'text-[#e5e2e1]' : isWIP ? 'text-[#eac349]' : 'text-[#9d8d8a]'}`}>
            {m.titulo}
          </h3>
          <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider shrink-0 ${catColor[m.categoria]}`}>
            <Icon size={10} />
            <span>{m.categoria}</span>
          </div>
        </div>
        {m.descripcion && (
          <p className="text-[#9d8d8a] text-sm mt-1 leading-relaxed">{m.descripcion}</p>
        )}
        {m.fecha && isDone && (
          <p className="text-[#504441] text-[10px] mt-1.5 uppercase tracking-wider">
            Completado {new Date(m.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  )
}

export function Dashboard() {
  const milestones = useProgressStore(s => s.milestones)
  const nombre     = useAuthStore(s => s.nombre)

  const done    = milestones.filter(m => m.status === 'done')
  const active  = milestones.filter(m => m.status === 'in_progress')
  const pending = milestones.filter(m => m.status === 'pending')
  const pct     = Math.round((done.length / milestones.length) * 100)

  return (
    <div className="space-y-10">

      {/* ── Bienvenida ── */}
      <div>
        <p className="text-[#9d8d8a] text-xs uppercase tracking-[0.15em] mb-2">
          {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h1 className="font-display text-[#ecbbb0] font-black italic text-4xl sm:text-5xl leading-tight">
          Hola, {nombre}. 👋
        </h1>
        <p className="text-[#d5c3bf] text-lg mt-2">
          Aquí está el estado real del proyecto.
        </p>
      </div>

      {/* ── Barra de progreso ── */}
      <div className="bg-[#1c1b1b] border border-[#504441] p-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9d8d8a]">Progreso global del proyecto</p>
            <p className="font-display text-[#eac349] font-black italic text-4xl mt-1">{pct}%</p>
          </div>
          <div className="text-right text-sm text-[#9d8d8a] space-y-1">
            <p><span className="text-[#4ade80] font-bold">{done.length}</span> completados</p>
            <p><span className="text-[#eac349] font-bold">{active.length}</span> en progreso</p>
            <p><span className="text-[#504441] font-bold">{pending.length}</span> pendientes</p>
          </div>
        </div>
        <div className="h-3 bg-[#131313] border border-[#504441]">
          <div
            className="h-full bg-gradient-to-r from-[#eac349] to-[#4ade80] transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* ── Grid: Timeline + IdeaBox ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Timeline — 2/3 */}
        <div className="lg:col-span-2 space-y-8">

          {/* En progreso */}
          {active.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#504441]">
                <div className="w-2.5 h-2.5 bg-[#eac349] rounded-none animate-pulse" />
                <h2 className="font-display text-[#eac349] italic font-bold text-xl">En qué estamos trabajando</h2>
                <span className="text-[10px] text-[#9d8d8a] uppercase tracking-wider ml-auto">{active.length} hitos</span>
              </div>
              <div>
                {active.map((m, i) => <MilestoneItem key={m.id} m={m} last={i === active.length - 1} />)}
              </div>
            </section>
          )}

          {/* Completados */}
          <section>
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#504441]">
              <CheckCircle2 size={18} className="text-[#4ade80]" />
              <h2 className="font-display text-[#e5e2e1] italic font-bold text-xl">Lo que ya está listo</h2>
              <span className="text-[10px] text-[#9d8d8a] uppercase tracking-wider ml-auto">{done.length} logros</span>
            </div>
            <div>
              {done.map((m, i) => <MilestoneItem key={m.id} m={m} last={i === done.length - 1} />)}
            </div>
          </section>

          {/* Pendientes */}
          <section>
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#504441]">
              <Circle size={18} className="text-[#504441]" />
              <h2 className="font-display text-[#9d8d8a] italic font-bold text-xl">Lo que viene</h2>
              <span className="text-[10px] text-[#9d8d8a] uppercase tracking-wider ml-auto">{pending.length} tareas</span>
            </div>
            <div>
              {pending.map((m, i) => <MilestoneItem key={m.id} m={m} last={i === pending.length - 1} />)}
            </div>
          </section>

        </div>

        {/* IdeaBox — 1/3 sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <IdeaBox />
          </div>
        </div>

      </div>
    </div>
  )
}
