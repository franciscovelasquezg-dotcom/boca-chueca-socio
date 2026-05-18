import { useState, type FormEvent } from 'react'
import { Plus, ChevronDown, CheckCircle2, FlaskConical, Lightbulb, XCircle, Trash2, Users } from 'lucide-react'
import { useRecipeStore } from '../store/recipeStore'
import type { RecipeStatus, Recipe, Ingrediente } from '../types'

const statusConfig: Record<RecipeStatus, { label: string; color: string; bg: string; icon: typeof Lightbulb }> = {
  idea:       { label: 'Idea',          color: 'text-[#9d8d8a]', bg: 'bg-[#1c1b1b] border-[#504441]', icon: Lightbulb    },
  en_prueba:  { label: 'En Pruebas',    color: 'text-[#eac349]', bg: 'bg-[#3c2f00] border-[#eac349]', icon: FlaskConical },
  aprobada:   { label: 'Aprobada ✓',   color: 'text-[#4ade80]', bg: 'bg-[#14321a] border-[#4ade80]', icon: CheckCircle2 },
  descartada: { label: 'Descartada',    color: 'text-[#504441]', bg: 'bg-[#1c1b1b] border-[#504441]', icon: XCircle      },
}
const categoriasLabel = { tapa:'Tapa', tabla:'Tabla', plato:'Plato', legendario:'Legendario', bebida:'Bebida', postre:'Postre' }
const UNIDADES = ['g', 'kg', 'ml', 'L', 'unid', 'tsp', 'tbsp', 'taza', 'al gusto']

// ─── Modal nueva receta ──────────────────────────────────────────────────────
function AddModal({ onClose }: { onClose: () => void }) {
  const add = useRecipeStore(s => s.add)
  const [form, setForm] = useState({
    titulo: '', descripcion: '', categoria: 'tapa' as Recipe['categoria'],
    status: 'idea' as RecipeStatus, porciones: 4, unidad_porcion: 'personas', notas: '',
  })
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([
    { nombre: '', gramaje: 0, unidad: 'g' }
  ])

  const addIngrediente = () => setIngredientes(prev => [...prev, { nombre: '', gramaje: 0, unidad: 'g' }])
  const removeIngrediente = (i: number) => setIngredientes(prev => prev.filter((_, idx) => idx !== i))
  const updateIngrediente = (i: number, field: keyof Ingrediente, value: string | number) =>
    setIngredientes(prev => prev.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing))

  const handle = (e: FormEvent) => {
    e.preventDefault()
    if (!form.titulo.trim()) return
    add({
      ...form,
      ingredientes: ingredientes.filter(i => i.nombre.trim()),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-[#1c1b1b] border border-[#504441] w-full sm:max-w-lg max-h-[92vh] flex flex-col">

        <div className="px-4 py-3 border-b border-[#504441] flex items-center justify-between shrink-0">
          <h3 className="font-display text-[#ecbbb0] italic font-bold text-lg">Nueva receta</h3>
          <button onClick={onClose} className="text-[#504441] hover:text-[#9d8d8a] min-w-[44px] min-h-[44px] flex items-center justify-center text-xl">×</button>
        </div>

        <form onSubmit={handle} className="p-4 space-y-4 overflow-y-auto flex-1">

          {/* Datos básicos */}
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Nombre de la receta *</label>
              <input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} autoFocus
                placeholder="Croquetas de mechada, Pulpo a la brasa..."
                className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2.5 text-sm outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Descripción</label>
              <textarea rows={2} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                placeholder="Concepto, origen de la idea..."
                className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2 text-sm outline-none resize-none transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Categoría</label>
                <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value as Recipe['categoria'] }))}
                  className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2.5 text-sm outline-none">
                  {Object.entries(categoriasLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Estado</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as RecipeStatus }))}
                  className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2.5 text-sm outline-none">
                  {Object.entries(statusConfig).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                </select>
              </div>
            </div>

            {/* Porciones */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Rinde para</label>
                <input type="number" min={1} value={form.porciones} onChange={e => setForm(f => ({ ...f, porciones: +e.target.value }))}
                  className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Unidad de porción</label>
                <input value={form.unidad_porcion} onChange={e => setForm(f => ({ ...f, unidad_porcion: e.target.value }))}
                  placeholder="personas, unidades..."
                  className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2.5 text-sm outline-none" />
              </div>
            </div>
          </div>

          {/* Ingredientes con gramaje */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a]">Ingredientes y gramaje</label>
              <button type="button" onClick={addIngrediente}
                className="text-[10px] font-bold text-[#eac349] hover:text-[#ecbbb0] uppercase tracking-wider transition-colors flex items-center gap-1">
                <Plus size={10} /> Agregar
              </button>
            </div>
            <div className="space-y-2">
              {ingredientes.map((ing, i) => (
                <div key={i} className="grid grid-cols-[1fr_70px_70px_32px] gap-1.5 items-center">
                  <input
                    value={ing.nombre}
                    onChange={e => updateIngrediente(i, 'nombre', e.target.value)}
                    placeholder="Ingrediente"
                    className="bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-2 py-2 text-xs outline-none transition-colors"
                  />
                  <input
                    type="number" min={0} value={ing.gramaje || ''}
                    onChange={e => updateIngrediente(i, 'gramaje', +e.target.value)}
                    placeholder="Cant."
                    className="bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-2 py-2 text-xs outline-none text-center transition-colors"
                  />
                  <select
                    value={ing.unidad}
                    onChange={e => updateIngrediente(i, 'unidad', e.target.value)}
                    className="bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-1 py-2 text-xs outline-none"
                  >
                    {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <button type="button" onClick={() => removeIngrediente(i)}
                    className="text-[#504441] hover:text-[#ffb4ab] flex items-center justify-center h-full transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Notas de preparación</label>
            <textarea rows={2} value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
              placeholder="Temperatura, tiempo de cocción, sustituciones posibles..."
              className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2 text-sm outline-none resize-none transition-colors" />
          </div>

          <div className="flex gap-3 pb-1">
            <button type="submit" className="flex-1 min-h-[48px] bg-[#eac349] text-[#131313] font-bold uppercase tracking-wider text-sm">
              Guardar receta
            </button>
            <button type="button" onClick={onClose} className="px-4 min-h-[48px] border border-[#504441] text-[#9d8d8a] text-sm font-bold uppercase">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Card de receta ───────────────────────────────────────────────────────────
function RecipeCard({ r }: { r: Recipe }) {
  const { updateStatus, remove } = useRecipeStore()
  const [open, setOpen] = useState(false)
  const cfg  = statusConfig[r.status]
  const Icon = cfg.icon

  const borderMap = {
    idea: 'border-l-[#504441]', en_prueba: 'border-l-[#eac349]',
    aprobada: 'border-l-[#4ade80]', descartada: 'border-l-[#8e241e]',
  }

  return (
    <div className={`bg-[#1c1b1b] border-l-4 border border-[#504441] hover:border-[#9d8d8a] transition-colors group ${borderMap[r.status]} ${r.status === 'descartada' ? 'opacity-50' : ''}`}>
      <div className="p-4">

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#504441] bg-[#131313] px-2 py-0.5">
                {categoriasLabel[r.categoria]}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 border inline-flex items-center gap-1 ${cfg.bg} ${cfg.color}`}>
                <Icon size={9} /> {cfg.label}
              </span>
            </div>
            <h4 className="font-display italic font-bold text-[#e5e2e1] leading-snug">{r.titulo}</h4>
            {r.descripcion && <p className="text-[#9d8d8a] text-xs mt-1">{r.descripcion}</p>}
          </div>
          <button onClick={() => setOpen(!open)} className="text-[#504441] hover:text-[#9d8d8a] shrink-0 p-1 transition-colors">
            <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Porciones */}
        <div className="flex items-center gap-1.5 mt-2">
          <Users size={11} className="text-[#504441]" />
          <span className="text-[11px] text-[#9d8d8a]">Rinde para <strong className="text-[#eac349]">{r.porciones}</strong> {r.unidad_porcion}</span>
        </div>

        {/* Ingredientes — siempre visibles como tabla */}
        {r.ingredientes.length > 0 && (
          <div className="mt-3 border border-[#504441]/50 overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] bg-[#131313] px-3 py-1.5 border-b border-[#504441]/50">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#504441]">Ingrediente</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#504441] text-right pr-3">Cant.</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#504441]">Unidad</span>
            </div>
            {r.ingredientes.map((ing, i) => (
              <div key={i} className={`grid grid-cols-[1fr_auto_auto] px-3 py-1.5 ${i % 2 === 0 ? 'bg-[#1c1b1b]' : 'bg-[#131313]'}`}>
                <span className="text-[#d5c3bf] text-xs">{ing.nombre}</span>
                <span className="text-[#eac349] text-xs font-bold text-right pr-3">
                  {ing.gramaje > 0 ? ing.gramaje : '—'}
                </span>
                <span className="text-[#9d8d8a] text-xs">{ing.unidad}</span>
              </div>
            ))}
          </div>
        )}

        {/* Expandido: notas + acciones */}
        {open && (
          <div className="mt-3 pt-3 border-t border-[#504441]/50 space-y-3">
            {r.notas && (
              <p className="text-[#9d8d8a] text-xs italic leading-relaxed bg-[#131313] p-3 border border-[#504441]/30">
                📝 {r.notas}
              </p>
            )}
            <div className="flex items-center gap-3 flex-wrap">
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
              <button onClick={() => remove(r.id)}
                className="ml-auto opacity-0 group-hover:opacity-100 text-[#504441] hover:text-[#ffb4ab] transition-all">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Vista principal ──────────────────────────────────────────────────────────
export function Recetas() {
  const recipes = useRecipeStore(s => s.recipes)
  const [modal, setModal]   = useState(false)
  const [filter, setFilter] = useState<RecipeStatus | 'all'>('all')
  const visible = filter === 'all' ? recipes : recipes.filter(r => r.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[#ecbbb0] font-black italic text-3xl sm:text-4xl">Lab de Recetas</h1>
        <p className="text-[#9d8d8a] text-sm mt-1">Registro de recetas con ingredientes, gramaje y porciones.</p>
      </div>

      {/* Stats por estado */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.entries(statusConfig) as [RecipeStatus, typeof statusConfig[RecipeStatus]][]).map(([k, c]) => {
          const count = recipes.filter(r => r.status === k).length
          const Icon  = c.icon
          return (
            <button key={k} onClick={() => setFilter(filter === k ? 'all' : k)}
              className={`p-3 border text-left transition-all min-h-[64px] ${filter === k ? c.bg : 'bg-[#1c1b1b] border-[#504441] hover:border-[#9d8d8a]'}`}>
              <Icon size={16} className={`mb-1 ${c.color}`} />
              <p className={`font-bold text-xl ${c.color}`}>{count}</p>
              <p className="text-[9px] text-[#9d8d8a] uppercase tracking-wider">{c.label}</p>
            </button>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-5 min-h-[48px] bg-[#eac349] text-[#131313] font-bold uppercase tracking-wider text-sm hover:bg-[#cca830] transition-colors">
          <Plus size={15} /> Nueva receta
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visible.map(r => <RecipeCard key={r.id} r={r} />)}
        {visible.length === 0 && (
          <p className="col-span-full text-center text-[#504441] py-16 text-sm uppercase tracking-wider">
            Sin recetas en este estado.
          </p>
        )}
      </div>

      {modal && <AddModal onClose={() => setModal(false)} />}
    </div>
  )
}
