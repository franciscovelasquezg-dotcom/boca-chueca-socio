import { ExternalLink, CheckCircle2, Clock, Circle, ChevronDown, ChevronUp, FlaskConical } from 'lucide-react'
import { useState } from 'react'
import { useSpecStore, type SpecFase } from '../store/specStore'
import { useRecipeStore }              from '../store/recipeStore'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const CLP = (n: number) => `$${n.toLocaleString('es-CL')}`

const FASE_CFG = {
  completada: { label: 'Completada', dot: 'bg-surface-container-low border-tertiary-container', icon: CheckCircle2, textColor: 'text-tertiary' },
  en_curso:   { label: 'En curso',   dot: 'bg-surface-container-low border-primary-container pulse-gold', icon: Clock, textColor: 'text-primary' },
  pendiente:  { label: 'Pendiente',  dot: 'bg-surface-container-low border-outline-variant',   icon: Circle, textColor: 'text-outline' },
}

const CATS_LABEL: Record<string, string> = {
  tapa: 'Tapas', tabla: 'Tablas para picar', plato: 'Platos',
  legendario: 'Menú Legendario', bebida: 'Bebidas', postre: 'Postres',
}

// ─── Sección colapsable ───────────────────────────────────────────────────────
function Section({ title, subtitle, children, defaultOpen = true }: {
  title: string; subtitle?: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-2 border-outline-variant bg-surface-container-low shadow-block">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-surface-container transition-colors"
      >
        <div className="text-left">
          <h2 className="font-display italic font-bold text-on-surface text-lg sm:text-xl">{title}</h2>
          {subtitle && <p className="text-on-surface-variant text-xs uppercase tracking-wider mt-0.5">{subtitle}</p>}
        </div>
        {open
          ? <ChevronUp size={16} className="text-outline shrink-0 ml-2" />
          : <ChevronDown size={16} className="text-outline shrink-0 ml-2" />
        }
      </button>
      {open && <div className="px-4 sm:px-6 pb-6 border-t border-outline-variant">{children}</div>}
    </div>
  )
}

// ─── Fase ─────────────────────────────────────────────────────────────────────
function FaseCard({ fase, last }: { fase: SpecFase; last: boolean }) {
  const [open, setOpen] = useState(fase.estado === 'en_curso')
  const cfg  = FASE_CFG[fase.estado]
  const Icon = cfg.icon

  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-7 h-7 sm:w-8 sm:h-8 border-2 flex items-center justify-center z-10 ${cfg.dot} ${fase.estado === 'en_curso' ? 'pulse-gold' : ''}`}>
          <Icon size={13} className={cfg.textColor} />
        </div>
        {!last && <div className="w-[2px] flex-1 mt-1 min-h-[32px] bg-outline-variant" />}
      </div>

      <div className="flex-1 min-w-0 pb-6">
        <button onClick={() => setOpen(!open)} className="w-full text-left">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.textColor}`}>
                Fase {fase.numero} · {cfg.label}{fase.fechaEstimada ? ` · ${fase.fechaEstimada}` : ''}
              </span>
              <h3 className={`font-display italic font-bold text-base sm:text-lg leading-snug mt-0.5 ${fase.estado === 'pendiente' ? 'text-outline' : 'text-on-surface'}`}>
                {fase.nombre}
              </h3>
            </div>
            {open
              ? <ChevronUp size={13} className="text-outline mt-1 shrink-0" />
              : <ChevronDown size={13} className="text-outline mt-1 shrink-0" />
            }
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
                    <span className={`mt-1.5 w-1.5 h-1.5 shrink-0 ${fase.estado === 'completada' ? 'bg-tertiary' : fase.estado === 'en_curso' ? 'bg-primary-container' : 'bg-outline-variant'}`} />
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
  const { spec }  = useSpecStore()
  const recipes   = useRecipeStore(s => s.recipes)

  const totalMin = spec.inversiones.reduce((a, i) => a + i.minCLP, 0)
  const totalMax = spec.inversiones.reduce((a, i) => a + i.maxCLP, 0)
  const fasesCompletadas = spec.fases.filter(f => f.estado === 'completada').length
  const pctFases = Math.round((fasesCompletadas / spec.fases.length) * 100)

  // Recetas agrupadas por categoría — solo aprobadas y en prueba
  const recetasActivas = recipes.filter(r => r.status !== 'descartada')
  const porCategoria = recetasActivas.reduce<Record<string, typeof recipes>>((acc, r) => {
    if (!acc[r.categoria]) acc[r.categoria] = []
    acc[r.categoria].push(r)
    return acc
  }, {})

  const statusBadge: Record<string, string> = {
    aprobada:  'bg-[#14321a] text-[#4ade80] border-[#4ade80]',
    en_prueba: 'bg-[#3c2f00] text-[#eac349] border-[#eac349]',
    en_proceso:'bg-[#2b1a0d] text-[#fdba74] border-[#c2410c]',
    ajustando: 'bg-[#1a0d2b] text-[#c4b5fd] border-[#7c3aed]',
    idea:      'bg-[#1c1b1b] text-[#9d8d8a] border-[#504441]',
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="border-2 border-on-surface bg-surface-container-low p-4 sm:p-6 shadow-block-lg">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <p className="font-bold text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
              Documento vivo · v{spec.version} · {new Date(spec.ultimaActualizacion).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1 className="font-display italic font-bold text-primary-container text-2xl sm:text-3xl leading-tight">
              {spec.nombreComercial}
            </h1>
            <p className="text-on-surface-variant mt-2 text-sm max-w-xl leading-relaxed">{spec.propuestaDeValor}</p>
          </div>
          <div className="text-center shrink-0">
            <p className="font-display italic font-bold text-primary-container text-3xl sm:text-4xl">{pctFases}%</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">fases completadas</p>
          </div>
        </div>
        <div className="mt-4 w-full h-3 border-2 border-on-surface bg-surface-container-highest">
          <div className="h-full progress-gradient transition-all duration-1000" style={{ width: `${pctFases}%` }} />
        </div>
      </div>

      {/* Concepto */}
      <Section title="El Concepto" subtitle="Qué es y cómo funciona">
        <div className="pt-4 space-y-4">
          <p className="text-on-surface leading-relaxed text-sm sm:text-base">{spec.concepto}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Ubicación objetivo', valor: spec.ubicacion },
              { label: 'Horario',            valor: spec.horario   },
              { label: 'Público objetivo',   valor: spec.publicoObjetivo.split('.')[0] + '.' },
            ].map(d => (
              <div key={d.label} className="bg-surface-container border border-outline-variant p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">{d.label}</p>
                <p className="text-on-surface text-sm leading-relaxed">{d.valor}</p>
              </div>
            ))}
          </div>
          <div className="bg-surface-container border border-outline-variant p-3 sm:p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Modelo de negocio</p>
            <p className="text-on-surface-variant text-sm leading-relaxed">{spec.modeloNegocio}</p>
          </div>
        </div>
      </Section>

      {/* ── CARTA LIGADA A RECETAS REALES ── */}
      <Section title="La Carta" subtitle="Basada en las recetas del Lab — en construcción">
        <div className="pt-4 space-y-5">

          {Object.keys(porCategoria).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border border-outline-variant/30 gap-3 text-center px-4">
              <FlaskConical size={32} className="text-outline" />
              <p className="text-on-surface-variant text-sm">Aún no hay recetas en el Lab.</p>
              <p className="text-outline text-xs uppercase tracking-wider">
                Cuando Francisco apruebe recetas, aparecerán aquí automáticamente.
              </p>
            </div>
          ) : (
            Object.entries(porCategoria).map(([cat, items]) => (
              <div key={cat}>
                <p className="font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline-variant pb-2 mb-3">
                  {CATS_LABEL[cat] ?? cat} ({items.length})
                </p>
                <div className="space-y-2">
                  {items.map(r => (
                    <div key={r.id} className="flex items-start justify-between gap-3 p-3 bg-surface-container border border-outline-variant/50">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-on-surface text-sm font-medium">{r.titulo}</p>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${statusBadge[r.status] ?? statusBadge.idea}`}>
                            {r.status === 'aprobada' ? '✅ Aprobada' :
                             r.status === 'en_prueba' ? '🧪 En prueba' :
                             r.status === 'en_proceso' ? '🔄 En proceso' :
                             r.status === 'ajustando' ? '✏️ Ajustando' : '💡 Idea'}
                          </span>
                        </div>
                        {r.descripcion && (
                          <p className="text-on-surface-variant text-xs leading-relaxed">{r.descripcion}</p>
                        )}
                        {r.ingredientes.length > 0 && (
                          <p className="text-outline text-[10px] mt-1">
                            {r.ingredientes.slice(0, 3).map(i => i.nombre).join(' · ')}
                            {r.ingredientes.length > 3 ? ` +${r.ingredientes.length - 3}` : ''}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-outline uppercase tracking-wider">
                          Rinde {r.porciones} {r.unidad_porcion}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          <div className="bg-[#0d1a2b] border border-[#1d4ed8] p-3">
            <p className="text-[#93c5fd] text-xs leading-relaxed">
              <span className="font-bold">ℹ️ Nota:</span> Los precios de carta se definirán cuando las recetas sean aprobadas. Esta sección se actualiza automáticamente desde el Lab de Recetas.
            </p>
          </div>
        </div>
      </Section>

      {/* Fases */}
      <Section title="Hoja de Ruta" subtitle="Las 5 fases del proyecto">
        <div className="pt-5 relative before:content-[''] before:absolute before:left-3.5 sm:before:left-4 before:top-5 before:bottom-5 before:w-[2px] before:bg-outline-variant">
          {spec.fases.map((fase, i) => (
            <FaseCard key={fase.id} fase={fase} last={i === spec.fases.length - 1} />
          ))}
        </div>
      </Section>

      {/* Inversión */}
      <Section title="Inversión Estimada" subtitle="Estimación preliminar — para discusión">
        <div className="pt-4 space-y-3">

          {/* Tabla mobile-friendly */}
          <div className="border-2 border-outline-variant overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_auto_auto] bg-surface-container px-3 sm:px-4 py-2 border-b border-outline-variant">
              <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Ítem</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-outline text-right pr-3">Mín.</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-outline text-right">Máx.</span>
            </div>
            {/* Filas */}
            {spec.inversiones.map((inv, i) => (
              <div key={i} className={`grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_auto_auto] px-3 sm:px-4 py-3 border-b border-outline-variant/50 last:border-0 ${i % 2 === 0 ? '' : 'bg-surface-container/50'}`}>
                <div className="min-w-0 pr-2">
                  <p className="text-on-surface text-xs sm:text-sm leading-snug">{inv.item}</p>
                  {inv.notas && <p className="text-outline text-[10px] mt-0.5 hidden sm:block">{inv.notas}</p>}
                </div>
                <span className="text-on-surface-variant text-xs sm:text-sm text-right pr-3 self-center">{CLP(inv.minCLP)}</span>
                <span className="text-on-surface font-bold text-xs sm:text-sm text-right self-center">{CLP(inv.maxCLP)}</span>
              </div>
            ))}
            {/* Total */}
            <div className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_auto_auto] px-3 sm:px-4 py-3 bg-surface-container border-t-2 border-on-surface">
              <span className="font-bold uppercase tracking-wider text-xs sm:text-sm text-on-surface">Total estimado</span>
              <span className="text-on-surface-variant font-bold pr-3 text-right self-center text-xs sm:text-sm">{CLP(totalMin)}</span>
              <span className="text-primary-container font-bold text-base sm:text-xl text-right self-center">{CLP(totalMax)}</span>
            </div>
          </div>

          <p className="text-outline text-[10px] uppercase tracking-wider text-center">
            Estimación preliminar · Sujeto a cotizaciones reales
          </p>
        </div>
      </Section>

      {/* Socios */}
      <Section title="Los Socios" subtitle="Roles y responsabilidades">
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {spec.socios.map((s, i) => (
            <div key={i} className="border-2 border-outline-variant bg-surface-container p-4 shadow-block-sm">
              <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
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
                    <span className="text-primary-container shrink-0 mt-0.5">·</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Links */}
      <Section title="Links del Proyecto" subtitle="Acceso a todos los sistemas" defaultOpen={false}>
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {spec.links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-4 border-2 border-outline-variant bg-surface-container hover:border-primary-container hover:bg-surface-container-high transition-all group shadow-block-sm hover-lift min-h-[52px]">
              <span className="font-bold text-sm text-on-surface group-hover:text-primary-container transition-colors">{link.label}</span>
              <ExternalLink size={14} className="text-outline group-hover:text-primary-container transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </Section>

    </div>
  )
}
