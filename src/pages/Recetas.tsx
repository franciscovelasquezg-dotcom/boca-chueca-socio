import { useState, type FormEvent } from 'react'
import { Plus, ChevronDown, CheckCircle2, FlaskConical, Lightbulb, XCircle } from 'lucide-react'
import { useRecipeStore } from '../store/recipeStore'
import type { RecipeStatus, Recipe } from '../types'

const statusConfig: Record<RecipeStatus, { label: string; color: string; bg: string; icon: typeof Lightbulb }> = {
  idea:        { label: 'Idea',          color: 'text-[#9d8d8a]',  bg: 'bg-[#1c1b1b] border-[#504441]',  icon: Lightbulb    },
  en_prueba:   { label: 'En Pruebas',    color: 'text-[#eac349]',  bg: 'bg-[#3c2f00] border-[#eac349]',  icon: FlaskConical },
  aprobada:    { label: 'Aprobada ✓',   color: 'text-[#4ade80]',  bg: 'bg-[#14321a] border-[#4ade80]',  icon: CheckCircle2 },
  descartada:  { label: 'Descartada',    color: 'text-[#504441]',  bg: 'bg-[#1c1b1b] border-[#504441]',  icon: XCircle      },
}

const categoriasLabel = { tapa:'Tapa', tabla:'Tabla', plato:'Plato', legendario:'Legendario', bebida:'Bebida', postre:'Postre' }

function AddModal({ onClose }: { onClose: () => void }) {
  const add = useRecipeStore(s => s.add)
  const [form, setForm] = useState({ titulo:'', descripcion:'', ingredientes:'', categoria:'tapa' as Recipe['categoria'], status:'idea' as RecipeStatus, notas:'' })
  const handle = (e: FormEvent) => {
    e.preventDefault()
    if (!form.titulo.trim()) return
    add({ ...form, ingredientes: form.ingredientes.split(',').map(i=>i.trim()).filter(Boolean), descripcion: form.descripcion||undefined, notas: form.notas||undefined })
    onClose()
  }
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-[#1c1b1b] border border-[#504441] w-full sm:max-w-lg max-h-[92vh] flex flex-col">
        <div className="px-4 py-3 border-b border-[#504441] flex items-center justify-between shrink-0">
          <h3 className="font-display text-[#ecbbb0] italic font-bold text-lg">Nueva receta</h3>
          <button onClick={onClose} className="text-[#504441] hover:text-[#9d8d8a] min-w-[44px] min-h-[44px] flex items-center justify-center text-xl">×</button>
        </div>
        <form onSubmit={handle} className="p-4 space-y-3 overflow-y-auto">
          {[
            { k:'titulo', l:'Nombre de la receta *', ph:'Tapa de gambas al ajillo con merkén...' },
            { k:'descripcion', l:'Descripción', ph:'Concepto e inspiración...' },
            { k:'ingredientes', l:'Ingredientes clave (separados por coma)', ph:'gambas, merkén, ajo, aceite de oliva...' },
            { k:'notas', l:'Notas', ph:'Temperatura, sustituciones, observaciones...' },
          ].map(f => (
            <div key={f.k}>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">{f.l}</label>
              <input value={(form as Record<string,string>)[f.k]} onChange={e => setForm(p=>({...p,[f.k]:e.target.value}))}
                placeholder={f.ph}
                className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2 text-sm outline-none transition-colors"/>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            {[
              { k:'categoria', l:'Categoría', opts: Object.entries(categoriasLabel) },
              { k:'status', l:'Estado', opts: Object.entries(statusConfig).map(([v,c])=>[v,c.label]) },
            ].map(f => (
              <div key={f.k}>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">{f.l}</label>
                <select value={(form as Record<string,string>)[f.k]} onChange={e => setForm(p=>({...p,[f.k]:e.target.value}))}
                  className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2 text-sm outline-none">
                  {f.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2 pb-1">
            <button type="submit" className="flex-1 min-h-[48px] bg-[#eac349] text-[#131313] font-bold uppercase tracking-wider text-sm">Guardar</button>
            <button type="button" onClick={onClose} className="px-4 min-h-[48px] border border-[#504441] text-[#9d8d8a] text-sm font-bold uppercase">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function RecipeCard({ r }: { r: Recipe }) {
  const { updateStatus } = useRecipeStore()
  const [open, setOpen]  = useState(false)
  const cfg  = statusConfig[r.status]
  const Icon = cfg.icon
  const borderMap = { idea:'border-l-[#504441]', en_prueba:'border-l-[#eac349]', aprobada:'border-l-[#4ade80]', descartada:'border-l-[#8e241e]' }

  return (
    <div className={`bg-[#1c1b1b] border-l-4 border border-[#504441] hover:border-[#9d8d8a] transition-colors ${borderMap[r.status]} ${r.status==='descartada'?'opacity-50':''}`}>
      <div className="p-5">
        <div className="flex items-start gap-3 justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#504441] bg-[#131313] px-2 py-0.5">
                {categoriasLabel[r.categoria]}
              </span>
              <span className={`text-[10px] font-bold inline-flex items-center gap-1 px-2 py-0.5 border ${cfg.bg} ${cfg.color}`}>
                <Icon size={10} /> {cfg.label}
              </span>
            </div>
            <h4 className="font-display italic font-bold text-[#e5e2e1] leading-tight">{r.titulo}</h4>
            {r.descripcion && <p className="text-[#9d8d8a] text-sm mt-1">{r.descripcion}</p>}
          </div>
          <button onClick={() => setOpen(!open)} className="text-[#504441] hover:text-[#9d8d8a] shrink-0">
            <ChevronDown size={16} className={`transition-transform ${open?'rotate-180':''}`} />
          </button>
        </div>

        {/* Ingredientes */}
        {r.ingredientes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {r.ingredientes.map(i => (
              <span key={i} className="text-[11px] text-[#eac349] bg-[#3c2f00] px-2.5 py-1">{i}</span>
            ))}
          </div>
        )}

        {/* Expandido */}
        {open && (
          <div className="mt-4 pt-4 border-t border-[#504441]/50 space-y-3">
            {r.notas && <p className="text-[#9d8d8a] text-xs italic leading-relaxed">📝 {r.notas}</p>}
            <div className="flex gap-2 flex-wrap">
              {r.status === 'idea' && (
                <button onClick={() => updateStatus(r.id, 'en_prueba')}
                  className="text-[11px] font-bold uppercase tracking-wider text-[#eac349] hover:text-[#ecbbb0] transition-colors">
                  → Pasar a pruebas
                </button>
              )}
              {r.status === 'en_prueba' && (
                <>
                  <button onClick={() => updateStatus(r.id, 'aprobada')}
                    className="text-[11px] font-bold uppercase tracking-wider text-[#4ade80] hover:text-[#ecbbb0] transition-colors">
                    ✓ Aprobar para menú
                  </button>
                  <button onClick={() => updateStatus(r.id, 'descartada')}
                    className="text-[11px] font-bold uppercase tracking-wider text-[#504441] hover:text-[#ffb4ab] transition-colors">
                    Descartar
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function Recetas() {
  const recipes = useRecipeStore(s => s.recipes)
  const [modal, setModal]   = useState(false)
  const [filter, setFilter] = useState<RecipeStatus | 'all'>('all')
  const visible = filter === 'all' ? recipes : recipes.filter(r => r.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[#ecbbb0] font-black italic text-3xl sm:text-4xl">Lab de Recetas</h1>
        <p className="text-[#9d8d8a] text-sm mt-1">Del concepto a la carta — seguimos el ciclo de cada receta.</p>
      </div>

      {/* Stats visuales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(statusConfig) as [RecipeStatus, typeof statusConfig[RecipeStatus]][]).map(([k,c]) => {
          const count = recipes.filter(r => r.status === k).length
          const Icon  = c.icon
          return (
            <button key={k} onClick={() => setFilter(filter===k?'all':k)}
              className={`p-4 border text-left transition-all ${filter===k ? c.bg : 'bg-[#1c1b1b] border-[#504441] hover:border-[#9d8d8a]'}`}>
              <Icon size={18} className={`mb-2 ${c.color}`} />
              <p className={`font-bold text-2xl ${c.color}`}>{count}</p>
              <p className="text-[10px] text-[#9d8d8a] uppercase tracking-wider mt-0.5">{c.label}</p>
            </button>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#eac349] text-[#131313] font-bold uppercase tracking-wider text-sm hover:bg-[#cca830] transition-colors">
          <Plus size={15} /> Nueva receta
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visible.map(r => <RecipeCard key={r.id} r={r} />)}
        {visible.length === 0 && (
          <p className="col-span-full text-center text-[#504441] py-16 text-sm uppercase tracking-wider">Sin recetas en este estado.</p>
        )}
      </div>

      {modal && <AddModal onClose={() => setModal(false)} />}
    </div>
  )
}
