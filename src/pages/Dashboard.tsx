import { CheckCircle2, Clock, Circle, Globe, Server, Briefcase, Scale, Megaphone } from 'lucide-react'
import { useProgressStore } from '../store/progressStore'
import { useAuthStore }     from '../store/authStore'
import { IdeaBox }          from '../components/ui/IdeaBox'
import type { Milestone }   from '../types'

const catIcon = { web: Globe, admin: Server, negocio: Briefcase, legal: Scale, marketing: Megaphone }
const catColor = {
  web: 'text-[#93c5fd]', admin: 'text-[#c4b5fd]',
  negocio: 'text-[#eac349]', legal: 'text-[#86efac]', marketing: 'text-[#fdba74]',
}

function MilestoneItem({ m, last }: { m: Milestone; last: boolean }) {
  const Icon   = catIcon[m.categoria]
  const isDone = m.status === 'done'
  const isWIP  = m.status === 'in_progress'

  return (
    <div className="flex gap-3 group">
      <div className="flex flex-col items-center shrink-0">
        <div className={`
          w-8 h-8 border-2 flex items-center justify-center shrink-0 transition-all
          ${isDone ? 'bg-[#14321a] border-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.15)]' :
            isWIP  ? 'bg-[#3c2f00] border-[#eac349] shadow-[0_0_10px_rgba(234,195,73,0.15)]' :
                     'bg-[#1c1b1b] border-[#504441]'}
        `}>
          {isDone ? <CheckCircle2 size={14} className="text-[#4ade80]" /> :
           isWIP  ? <Clock size={14} className="text-[#eac349] animate-pulse" /> :
                    <Circle size={14} className="text-[#504441]" />}
        </div>
        {!last && <div className={`w-px flex-1 mt-1 min-h-[20px] ${isDone ? 'bg-[#4ade80]/30' : 'bg-[#504441]/40'}`} />}
      </div>

      <div className="pb-5 flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <h3 className={`font-display italic font-bold text-sm sm:text-base leading-snug flex-1 min-w-0 ${
            isDone ? 'text-[#e5e2e1]' : isWIP ? 'text-[#eac349]' : 'text-[#9d8d8a]'
          }`}>
            {m.titulo}
          </h3>
          <div className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider shrink-0 ${catColor[m.categoria]}`}>
            <Icon size={9} /><span>{m.categoria}</span>
          </div>
        </div>
        {m.descripcion && (
          <p className="text-[#9d8d8a] text-xs sm:text-sm mt-1 leading-relaxed">{m.descripcion}</p>
        )}
        {m.fecha && isDone && (
          <p className="text-[#504441] text-[10px] mt-1.5 uppercase tracking-wider">
            Completado {new Date(m.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}
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
    <div className="space-y-8">

      {/* Bienvenida */}
      <div>
        <p className="text-[#9d8d8a] text-xs uppercase tracking-[0.12em] mb-2">
          {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="font-display text-[#ecbbb0] font-black italic text-3xl sm:text-4xl leading-tight">
          Hola, {nombre}. 👋
        </h1>
        <p className="text-[#d5c3bf] text-base sm:text-lg mt-2">
          Aquí está el estado real del proyecto.
        </p>
      </div>

      {/* Barra de progreso */}
      <div className="bg-[#1c1b1b] border border-[#504441] p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9d8d8a]">Progreso global del proyecto</p>
            <p className="font-display text-[#eac349] font-black italic text-4xl mt-1">{pct}%</p>
          </div>
          <div className="flex gap-4 sm:flex-col sm:gap-1 sm:text-right text-sm text-[#9d8d8a]">
            <p><span className="text-[#4ade80] font-bold">{done.length}</span> completados</p>
            <p><span className="text-[#eac349] font-bold">{active.length}</span> en progreso</p>
            <p><span className="text-[#504441] font-bold">{pending.length}</span> pendientes</p>
          </div>
        </div>
        <div className="h-3 bg-[#131313] border border-[#504441]">
          <div className="h-full bg-gradient-to-r from-[#eac349] to-[#4ade80] transition-all duration-1000"
            style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* IdeaBox — visible primero en móvil */}
      <div className="lg:hidden">
        <IdeaBox />
      </div>

      {/* Grid Timeline + IdeaBox desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-8">

          {active.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#504441]">
                <div className="w-2 h-2 bg-[#eac349] animate-pulse shrink-0" />
                <h2 className="font-display text-[#eac349] italic font-bold text-lg sm:text-xl">En qué estamos trabajando</h2>
                <span className="text-[10px] text-[#9d8d8a] uppercase tracking-wider ml-auto shrink-0">{active.length}</span>
              </div>
              {active.map((m, i) => <MilestoneItem key={m.id} m={m} last={i === active.length - 1} />)}
            </section>
          )}

          <section>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#504441]">
              <CheckCircle2 size={16} className="text-[#4ade80] shrink-0" />
              <h2 className="font-display text-[#e5e2e1] italic font-bold text-lg sm:text-xl">Lo que ya está listo</h2>
              <span className="text-[10px] text-[#9d8d8a] uppercase tracking-wider ml-auto shrink-0">{done.length}</span>
            </div>
            {done.map((m, i) => <MilestoneItem key={m.id} m={m} last={i === done.length - 1} />)}
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#504441]">
              <Circle size={16} className="text-[#504441] shrink-0" />
              <h2 className="font-display text-[#9d8d8a] italic font-bold text-lg sm:text-xl">Lo que viene</h2>
              <span className="text-[10px] text-[#9d8d8a] uppercase tracking-wider ml-auto shrink-0">{pending.length}</span>
            </div>
            {pending.map((m, i) => <MilestoneItem key={m.id} m={m} last={i === pending.length - 1} />)}
          </section>

        </div>

        {/* IdeaBox sticky — solo desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20">
            <IdeaBox />
          </div>
        </div>

      </div>
    </div>
  )
}
