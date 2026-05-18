import { ExternalLink, CheckCircle2, Clock, Circle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useSpecStore, type SpecFase } from '../store/specStore'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const CLP = (n: number) => `$${n.toLocaleString('es-CL')}`

const FASE_CFG = {
  completada: { label: 'Completada', color: 'text-tertiary border-tertiary-container bg-surface-container-low', icon: CheckCircle2, dot: 'bg-surface-container-low border-tertiary-container' },
  en_curso:   { label: 'En curso',   color: 'text-primary border-primary-container bg-surface-container-low',   icon: Clock,        dot: 'bg-surface-container-low border-primary-container pulse-gold' },
  pendiente:  { label: 'Pendiente',  color: 'text-outline border-outline-variant bg-surface-container-low',     icon: Circle,       dot: 'bg-surface-container-low border-outline-variant' },
}


// ─── Sección colapsable ───────────────────────────────────────────────────────
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-2 border-outline-variant bg-surface-container-low shadow-block">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-container transition-colors"
      >
        <div className="text-left">
          <h2 className="font-display italic font-bold text-on-surface text-xl">{title}</h2>
          {subtitle && <p className="text-on-surface-variant text-xs uppercase tracking-wider mt-0.5">{subtitle}</p>}
        </div>
        {open ? <ChevronUp size={18} className="text-outline shrink-0" /> : <ChevronDown size={18} className="text-outline shrink-0" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-outline-variant">{children}</div>}
    </div>
  )
}

// ─── Fase del proyecto ────────────────────────────────────────────────────────
function FaseCard({ fase, last }: { fase: SpecFase; last: boolean }) {
  const [open, setOpen] = useState(fase.estado === 'en_curso')
  const cfg  = FASE_CFG[fase.estado]
  const Icon = cfg.icon

  return (
    <div className="flex gap-4">
      {/* Dot + línea */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-8 h-8 border-2 flex items-center justify-center z-10 ${cfg.dot} ${fase.estado === 'en_curso' ? 'pulse-gold' : ''}`}>
          <Icon size={14} className={fase.estado === 'completada' ? 'text-tertiary' : fase.estado === 'en_curso' ? 'text-primary' : 'text-outline'} />
        </div>
        {!last && <div className="w-[2px] flex-1 mt-1 min-h-[40px] bg-outline-variant" />}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0 pb-8">
        <button onClick={() => setOpen(!open)} className="w-full text-left">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.color.split(' ')[0]}`}>
                Fase {fase.numero} · {cfg.label}
                {fase.fechaEstimada ? ` · ${fase.fechaEstimada}` : ''}
              </span>
              <h3 className={`font-display italic font-bold text-lg leading-snug mt-0.5 ${fase.estado === 'pendiente' ? 'text-outline' : 'text-on-surface'}`}>
                {fase.nombre}
              </h3>
            </div>
            {open ? <ChevronUp size={14} className="text-outline mt-1 shrink-0" /> : <ChevronDown size={14} className="text-outline mt-1 shrink-0" />}
          </div>
        </button>

        {open && (
          <div className="mt-3 space-y-3">
            <p className="text-on-surface-variant text-sm leading-relaxed">{fase.descripcion}</p>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Entregables</p>
              <ul className="space-y-1.5">
                {fase.entregables.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className={`mt-1 w-1.5 h-1.5 rounded-none shrink-0 ${fase.estado === 'completada' ? 'bg-tertiary' : fase.estado === 'en_curso' ? 'bg-primary-container' : 'bg-outline-variant'}`} />
                    <span className={fase.estado === 'completada' ? 'text-on-surface-variant line-through' : 'text-on-surface'}>
                      {e}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Vista principal ──────────────────────────────────────────────────────────
export function Spec() {
  const { spec } = useSpecStore()

  const totalMin = spec.inversiones.reduce((a, i) => a + i.minCLP, 0)
  const totalMax = spec.inversiones.reduce((a, i) => a + i.maxCLP, 0)

  const fasesCompletadas = spec.fases.filter(f => f.estado === 'completada').length
  const pctFases = Math.round((fasesCompletadas / spec.fases.length) * 100)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="border-2 border-on-surface bg-surface-container-low p-6 shadow-block-lg">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-bold text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">
              Documento vivo · v{spec.version} · Actualizado {new Date(spec.ultimaActualizacion).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1 className="font-display italic font-bold text-primary-container text-3xl sm:text-4xl leading-tight">
              {spec.nombreComercial}
            </h1>
            <p className="text-on-surface-variant mt-2 text-sm max-w-xl leading-relaxed">{spec.propuestaDeValor}</p>
          </div>
          <div className="text-center shrink-0">
            <p className="font-display italic font-bold text-primary-container text-4xl">{pctFases}%</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">fases completadas</p>
          </div>
        </div>

        {/* Barra de progreso de fases */}
        <div className="mt-4 w-full h-3 border-2 border-on-surface bg-surface-container-highest">
          <div className="h-full progress-gradient transition-all duration-1000" style={{ width: `${pctFases}%` }} />
        </div>
      </div>

      {/* Concepto */}
      <Section title="El Concepto" subtitle="Qué es y cómo funciona">
        <div className="pt-4 space-y-4">
          <p className="text-on-surface leading-relaxed">{spec.concepto}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Ubicación objetivo', valor: spec.ubicacion },
              { label: 'Horario',            valor: spec.horario   },
              { label: 'Público objetivo',   valor: spec.publicoObjetivo.split('.')[0] + '.' },
            ].map(d => (
              <div key={d.label} className="bg-surface-container border border-outline-variant p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">{d.label}</p>
                <p className="text-on-surface text-sm leading-relaxed">{d.valor}</p>
              </div>
            ))}
          </div>
          <div className="bg-surface-container border border-outline-variant p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Modelo de negocio</p>
            <p className="text-on-surface-variant text-sm leading-relaxed">{spec.modeloNegocio}</p>
          </div>
        </div>
      </Section>

      {/* Carta y precios */}
      <Section title="Carta y Precios" subtitle="Estructura de precios de mercado">
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { titulo: '🍺 Jarras (incluyen tapas)', items: spec.preciosJarras, color: 'border-primary-container' },
            { titulo: '🪵 Tablas para picar',       items: spec.preciosTablas, color: 'border-outline-variant'  },
            { titulo: '🍽️ Platos',                  items: spec.preciosPlatos, color: 'border-outline-variant'  },
          ].map(g => (
            <div key={g.titulo} className={`border-2 ${g.color} bg-surface-container p-4`}>
              <p className="font-bold text-[11px] uppercase tracking-widest text-on-surface-variant mb-3">{g.titulo}</p>
              <ul className="space-y-2">
                {g.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-xs text-on-surface leading-relaxed">
                    <span className="text-primary-container shrink-0">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Fases del proyecto */}
      <Section title="Hoja de Ruta" subtitle="Las 5 fases del proyecto">
        <div className="pt-6 relative before:content-[''] before:absolute before:left-4 before:top-6 before:bottom-6 before:w-[2px] before:bg-outline-variant">
          {spec.fases.map((fase, i) => (
            <FaseCard key={fase.id} fase={fase} last={i === spec.fases.length - 1} />
          ))}
        </div>
      </Section>

      {/* Inversión */}
      <Section title="Inversión Estimada" subtitle="Estimación preliminar para discusión">
        <div className="pt-4 space-y-3">
          <div className="border-2 border-outline-variant overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] bg-surface-container px-4 py-2 border-b border-outline-variant">
              <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Ítem</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-outline text-right pr-4">Mín.</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-outline text-right">Máx.</span>
            </div>
            {spec.inversiones.map((inv, i) => (
              <div key={i} className={`grid grid-cols-[1fr_auto_auto] px-4 py-3 border-b border-outline-variant/50 last:border-0 ${i % 2 === 0 ? '' : 'bg-surface-container/50'}`}>
                <div>
                  <p className="text-on-surface text-sm">{inv.item}</p>
                  {inv.notas && <p className="text-outline text-[11px] mt-0.5">{inv.notas}</p>}
                </div>
                <span className="text-on-surface-variant text-sm text-right pr-4 self-center">{CLP(inv.minCLP)}</span>
                <span className="text-on-surface text-sm font-bold text-right self-center">{CLP(inv.maxCLP)}</span>
              </div>
            ))}
            <div className="grid grid-cols-[1fr_auto_auto] px-4 py-3 bg-surface-container border-t-2 border-on-surface">
              <span className="font-bold uppercase tracking-wider text-sm text-on-surface">Total estimado</span>
              <span className="text-on-surface-variant font-bold pr-4 text-right self-center">{CLP(totalMin)}</span>
              <span className="text-primary-container font-bold text-xl text-right self-center">{CLP(totalMax)}</span>
            </div>
          </div>
          <p className="text-outline text-xs uppercase tracking-wider text-center">
            Estimación preliminar · Sujeto a negociación y cotizaciones reales
          </p>
        </div>
      </Section>

      {/* Socios */}
      <Section title="Los Socios" subtitle="Roles y responsabilidades">
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {spec.socios.map((s, i) => (
            <div key={i} className="border-2 border-outline-variant bg-surface-container p-5 shadow-block-sm">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-display italic font-bold text-on-surface text-lg">{s.nombre}</p>
                  <p className="text-primary-container text-[11px] font-bold uppercase tracking-wider">{s.rol}</p>
                </div>
                <div className="bg-surface-container-highest border border-outline-variant px-2 py-1 text-center">
                  <p className="text-[9px] text-outline uppercase tracking-wider">Participación</p>
                  <p className="text-on-surface font-bold text-sm">{s.participacion}</p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {s.responsabilidades.map((r, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <span className="text-primary-container shrink-0 mt-1">·</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Links */}
      <Section title="Links del Proyecto" subtitle="Acceso a todos los sistemas">
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {spec.links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-4 border-2 border-outline-variant bg-surface-container hover:border-primary-container hover:bg-surface-container-high transition-all group shadow-block-sm hover-lift">
              <span className="font-bold text-sm text-on-surface group-hover:text-primary-container transition-colors">{link.label}</span>
              <ExternalLink size={14} className="text-outline group-hover:text-primary-container transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </Section>

    </div>
  )
}
