import { useState, type FormEvent } from 'react'
import {
  Plus, ChevronDown, ChevronUp, CheckCircle2, FlaskConical,
  Lightbulb, XCircle, Trash2, Users, Pencil, Check, X,
  History, Save,
} from 'lucide-react'
import { useRecipeStore } from '../store/recipeStore'
import type { RecipeStatus, Recipe, Ingrediente } from '../types'

// ─── Config ──────────────────────────────────────────────────────────────────
const STATUS: Record<RecipeStatus, { label: string; emoji: string; color: string; bg: string; icon: typeof Lightbulb }> = {
  idea:        { label: 'Idea',        emoji: '💡', color: 'text-[#9d8d8a]',  bg: 'bg-[#1c1b1b] border-[#504441]',  icon: Lightbulb    },
  en_prueba:   { label: 'En Prueba',   emoji: '🧪', color: 'text-[#eac349]',  bg: 'bg-[#3c2f00] border-[#eac349]',  icon: FlaskConical },
  en_proceso:  { label: 'En Proceso',  emoji: '🔄', color: 'text-[#fdba74]',  bg: 'bg-[#2b1a0d] border-[#c2410c]',  icon: FlaskConical },
  ajustando:   { label: 'Ajustando',   emoji: '✏️', color: 'text-[#c4b5fd]',  bg: 'bg-[#1a0d2b] border-[#7c3aed]',  icon: Pencil       },
  aprobada:    { label: 'Aprobada ✓',  emoji: '✅', color: 'text-[#4ade80]',  bg: 'bg-[#14321a] border-[#4ade80]',  icon: CheckCircle2 },
  descartada:  { label: 'Descartada',  emoji: '❌', color: 'text-[#504441]',  bg: 'bg-[#1c1b1b] border-[#504441]',  icon: XCircle      },
}
const CATS = { tapa:'Tapa', tabla:'Tabla', plato:'Plato', legendario:'Legendario', bebida:'Bebida', postre:'Postre' }
const UNIDADES = ['g','kg','ml','L','unid','tsp','tbsp','taza','al gusto']
const BORDER: Record<RecipeStatus, string> = {
  idea:       'border-l-[#504441]',
  en_prueba:  'border-l-[#eac349]',
  en_proceso: 'border-l-[#c2410c]',
  ajustando:  'border-l-[#7c3aed]',
  aprobada:   'border-l-[#4ade80]',
  descartada: 'border-l-[#8e241e]',
}

// ─── Inline editable field ────────────────────────────────────────────────────
function EditField({ value, onSave, multiline = false, label }: {
  value: string; onSave: (v: string) => void; multiline?: boolean; label?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(value)
  const commit = () => { if (draft.trim() !== value) onSave(draft.trim()); setEditing(false) }
  const cancel = () => { setDraft(value); setEditing(false) }

  if (!editing) return (
    <button onClick={() => { setDraft(value); setEditing(true) }}
      className="group/ef text-left w-full" title={`Editar ${label ?? ''}`}>
      <span className="border-b border-dashed border-transparent group-hover/ef:border-[#eac349] transition-colors">
        {value || <span className="text-[#504441] italic">Sin {label ?? 'valor'}</span>}
      </span>
      <Pencil size={10} className="inline ml-1.5 text-[#504441] opacity-0 group-hover/ef:opacity-100 transition-opacity" />
    </button>
  )

  return (
    <div className="flex flex-col gap-1.5">
      {multiline
        ? <textarea rows={3} value={draft} onChange={e => setDraft(e.target.value)} autoFocus
            className="w-full bg-[#131313] border border-[#eac349] text-[#e5e2e1] px-2 py-1.5 text-sm outline-none resize-none" />
        : <input value={draft} onChange={e => setDraft(e.target.value)} autoFocus
            className="w-full bg-[#131313] border border-[#eac349] text-[#e5e2e1] px-2 py-1.5 text-sm outline-none" />
      }
      <div className="flex gap-2">
        <button onClick={commit} className="flex items-center gap-1 text-[10px] font-bold text-[#4ade80] hover:text-[#e5e2e1] uppercase tracking-wider transition-colors">
          <Check size={11} /> Guardar
        </button>
        <button onClick={cancel} className="flex items-center gap-1 text-[10px] font-bold text-[#504441] hover:text-[#9d8d8a] uppercase tracking-wider transition-colors">
          <X size={11} /> Cancelar
        </button>
      </div>
    </div>
  )
}

// ─── Modal nueva receta ───────────────────────────────────────────────────────
function NewModal({ onClose }: { onClose: () => void }) {
  const add = useRecipeStore(s => s.add)
  const [form, setForm] = useState({
    titulo:'', descripcion:'', categoria:'tapa' as Recipe['categoria'],
    status:'idea' as RecipeStatus, porciones:4, unidad_porcion:'personas', notas:'',
  })
  const [ings, setIngs] = useState<Ingrediente[]>([{ nombre:'', gramaje:0, unidad:'g' }])

  const addIng    = () => setIngs(p => [...p, { nombre:'', gramaje:0, unidad:'g' }])
  const removeIng = (i: number) => setIngs(p => p.filter((_, idx) => idx !== i))
  const updateIng = (i: number, f: keyof Ingrediente, v: string | number) =>
    setIngs(p => p.map((x, idx) => idx === i ? { ...x, [f]: v } : x))

  const handle = (e: FormEvent) => {
    e.preventDefault()
    if (!form.titulo.trim()) return
    add({ ...form, ingredientes: ings.filter(i => i.nombre.trim()) })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-[#1c1b1b] border border-[#504441] w-full sm:max-w-lg max-h-[92vh] flex flex-col">
        <div className="px-4 py-3 border-b border-[#504441] flex items-center justify-between shrink-0">
          <h3 className="font-display text-[#ecbbb0] italic font-bold text-lg">Nueva receta</h3>
          <button onClick={onClose} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#504441] hover:text-[#9d8d8a] text-xl">×</button>
        </div>
        <form onSubmit={handle} className="p-4 space-y-3 overflow-y-auto flex-1">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Nombre *</label>
            <input value={form.titulo} onChange={e => setForm(f=>({...f,titulo:e.target.value}))} autoFocus
              placeholder="Nombre de la receta..."
              className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2.5 text-sm outline-none"/>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Descripción</label>
            <textarea rows={2} value={form.descripcion} onChange={e => setForm(f=>({...f,descripcion:e.target.value}))}
              placeholder="Concepto e inspiración..."
              className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2 text-sm outline-none resize-none"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Categoría</label>
              <select value={form.categoria} onChange={e => setForm(f=>({...f,categoria:e.target.value as Recipe['categoria']}))}
                className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2.5 text-sm outline-none">
                {Object.entries(CATS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Estado inicial</label>
              <select value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value as RecipeStatus}))}
                className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2.5 text-sm outline-none">
                {Object.entries(STATUS).map(([v,c]) => <option key={v} value={v}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Rinde para</label>
              <input type="number" min={1} value={form.porciones} onChange={e => setForm(f=>({...f,porciones:+e.target.value}))}
                className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2.5 text-sm outline-none"/>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Unidad porción</label>
              <input value={form.unidad_porcion} onChange={e => setForm(f=>({...f,unidad_porcion:e.target.value}))}
                placeholder="personas, tapas..."
                className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2.5 text-sm outline-none"/>
            </div>
          </div>

          {/* Ingredientes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a]">Ingredientes y gramaje</label>
              <button type="button" onClick={addIng} className="text-[10px] font-bold text-[#eac349] flex items-center gap-1 uppercase tracking-wider">
                <Plus size={10}/> Agregar
              </button>
            </div>
            <div className="space-y-1.5">
              {ings.map((ing,i) => (
                <div key={i} className="grid grid-cols-[1fr_64px_72px_28px] gap-1.5 items-center">
                  <input value={ing.nombre} onChange={e => updateIng(i,'nombre',e.target.value)} placeholder="Ingrediente"
                    className="bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-2 py-2 text-xs outline-none"/>
                  <input type="number" min={0} value={ing.gramaje||''} onChange={e => updateIng(i,'gramaje',+e.target.value)} placeholder="Cant."
                    className="bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-2 py-2 text-xs outline-none text-center"/>
                  <select value={ing.unidad} onChange={e => updateIng(i,'unidad',e.target.value)}
                    className="bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-1 py-2 text-xs outline-none">
                    {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <button type="button" onClick={() => removeIng(i)} className="text-[#504441] hover:text-[#ffb4ab] flex items-center justify-center transition-colors">
                    <Trash2 size={12}/>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Notas de preparación</label>
            <textarea rows={2} value={form.notas} onChange={e => setForm(f=>({...f,notas:e.target.value}))}
              placeholder="Temperatura, tiempo, sustituciones..."
              className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2 text-sm outline-none resize-none"/>
          </div>
          <div className="flex gap-3 pb-1">
            <button type="submit" className="flex-1 min-h-[48px] bg-[#eac349] text-[#131313] font-bold uppercase tracking-wider text-sm">Guardar</button>
            <button type="button" onClick={onClose} className="px-4 min-h-[48px] border border-[#504441] text-[#9d8d8a] text-sm font-bold uppercase">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Card de receta con edición inline ───────────────────────────────────────
function RecipeCard({ r }: { r: Recipe }) {
  const { updateStatus, updateField, addIngrediente, removeIngrediente, updateIngrediente, remove } = useRecipeStore()
  const [tab, setTab] = useState<'receta' | 'historial'>('receta')
  const [open, setOpen] = useState(false)
  const [newIng, setNewIng] = useState<Ingrediente | null>(null)
  const cfg  = STATUS[r.status]
  const Icon = cfg.icon

  return (
    <div className={`bg-[#1c1b1b] border-l-4 border border-[#504441] transition-colors group ${BORDER[r.status]} ${r.status==='descartada'?'opacity-60':''}`}>
      <div className="p-4">

        {/* Header con título editable */}
        <div className="flex items-start gap-2 justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#504441] bg-[#131313] px-2 py-0.5">
                {CATS[r.categoria]}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 border inline-flex items-center gap-1 ${cfg.bg} ${cfg.color}`}>
                <Icon size={9}/> {cfg.label}
              </span>
            </div>
            <div className="font-display italic font-bold text-[#e5e2e1] text-base leading-snug">
              <EditField value={r.titulo} label="nombre" onSave={v => updateField(r.id,'titulo',v)} />
            </div>
          </div>
          <button onClick={() => setOpen(!open)} className="text-[#504441] hover:text-[#9d8d8a] shrink-0 p-1 min-w-[32px] min-h-[32px] flex items-center justify-center">
            {open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
        </div>

        {/* Descripción editable */}
        <div className="text-[#9d8d8a] text-xs mb-2">
          <EditField value={r.descripcion ?? ''} label="descripción" multiline onSave={v => updateField(r.id,'descripcion',v)} />
        </div>

        {/* Porciones editables */}
        <div className="flex items-center gap-2 text-xs text-[#9d8d8a] mb-3">
          <Users size={11} className="text-[#504441] shrink-0"/>
          <span>Rinde para</span>
          <span className="font-bold text-[#eac349] cursor-pointer border-b border-dashed border-transparent hover:border-[#eac349] transition-colors"
            onClick={() => {
              const v = prompt('¿Cuántas porciones?', String(r.porciones))
              if (v && !isNaN(+v)) updateField(r.id, 'porciones', +v)
            }}>
            {r.porciones}
          </span>
          <span className="cursor-pointer border-b border-dashed border-transparent hover:border-[#eac349] transition-colors"
            onClick={() => {
              const v = prompt('Unidad de porción:', r.unidad_porcion)
              if (v) updateField(r.id, 'unidad_porcion', v)
            }}>
            {r.unidad_porcion}
          </span>
        </div>

        {/* Tabla de ingredientes */}
        <div className="border border-[#504441]/50 overflow-hidden">
          <div className="grid grid-cols-[1fr_56px_64px_28px] bg-[#131313] px-3 py-1.5 border-b border-[#504441]/50">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#504441]">Ingrediente</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#504441] text-right pr-2">Cant.</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#504441]">Unidad</span>
            <span/>
          </div>
          {r.ingredientes.map((ing, i) => (
            <IngRow key={i} ing={ing} index={i} recipeId={r.id}
              onUpdate={(newIng) => updateIngrediente(r.id, i, newIng, ing)}
              onRemove={() => removeIngrediente(r.id, ing.nombre)}
              even={i % 2 === 0}
            />
          ))}
          {/* Fila para agregar ingrediente */}
          {newIng !== null ? (
            <div className="grid grid-cols-[1fr_56px_64px_28px] gap-1 px-2 py-1.5 bg-[#3c2f00]/20 border-t border-[#eac349]/30 items-center">
              <input value={newIng.nombre} onChange={e => setNewIng({...newIng,nombre:e.target.value})}
                placeholder="Ingrediente" autoFocus
                className="bg-[#131313] border border-[#eac349] text-[#e5e2e1] px-2 py-1 text-xs outline-none"/>
              <input type="number" min={0} value={newIng.gramaje||''} onChange={e => setNewIng({...newIng,gramaje:+e.target.value})}
                placeholder="0"
                className="bg-[#131313] border border-[#eac349] text-[#e5e2e1] px-1 py-1 text-xs outline-none text-center"/>
              <select value={newIng.unidad} onChange={e => setNewIng({...newIng,unidad:e.target.value})}
                className="bg-[#131313] border border-[#eac349] text-[#e5e2e1] px-1 py-1 text-xs outline-none">
                {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <div className="flex flex-col gap-0.5">
                <button onClick={() => { if(newIng.nombre.trim()) { addIngrediente(r.id,newIng); setNewIng(null) } }}
                  className="text-[#4ade80] hover:text-[#e5e2e1] transition-colors"><Save size={11}/></button>
                <button onClick={() => setNewIng(null)} className="text-[#504441] hover:text-[#9d8d8a] transition-colors"><X size={11}/></button>
              </div>
            </div>
          ) : (
            <button onClick={() => setNewIng({nombre:'',gramaje:0,unidad:'g'})}
              className="w-full flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-[#504441] hover:text-[#eac349] hover:bg-[#3c2f00]/20 transition-colors uppercase tracking-wider border-t border-[#504441]/30">
              <Plus size={10}/> Agregar ingrediente
            </button>
          )}
        </div>

        {/* Panel expandido */}
        {open && (
          <div className="mt-4 space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-[#504441]">
              {(['receta','historial'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${tab===t ? 'text-[#eac349] border-b-2 border-[#eac349]' : 'text-[#504441] hover:text-[#9d8d8a]'}`}>
                  {t === 'receta' ? <><Pencil size={11}/> Detalles</> : <><History size={11}/> Historial ({r.historial.length})</>}
                </button>
              ))}
            </div>

            {tab === 'receta' && (
              <div className="space-y-3">
                {/* Notas */}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#504441] mb-1">Notas de preparación</p>
                  <div className="text-[#9d8d8a] text-xs bg-[#131313] p-3 border border-[#504441]/30">
                    <EditField value={r.notas ?? ''} label="notas" multiline onSave={v => updateField(r.id,'notas',v)} />
                  </div>
                </div>

                {/* Metadatos */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-[#504441]">
                  <div className="bg-[#131313] px-3 py-2 border border-[#504441]/30">
                    <p className="text-[9px] uppercase tracking-wider mb-0.5">Creada</p>
                    <p className="text-[#9d8d8a]">{new Date(r.created_at).toLocaleDateString('es-CL',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
                  </div>
                  <div className="bg-[#131313] px-3 py-2 border border-[#504441]/30">
                    <p className="text-[9px] uppercase tracking-wider mb-0.5">Última modificación</p>
                    <p className="text-[#9d8d8a]">{new Date(r.updated_at).toLocaleDateString('es-CL',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
                  </div>
                </div>

                {/* Cambiar categoría */}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#504441] mb-1">Categoría</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {Object.entries(CATS).map(([v,l]) => (
                      <button key={v} onClick={() => updateField(r.id,'categoria',v)}
                        className={`px-2.5 py-1 text-[10px] font-bold border transition-all ${r.categoria===v ? 'bg-[#3c2f00] border-[#eac349] text-[#eac349]' : 'border-[#504441] text-[#504441] hover:border-[#9d8d8a]'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selector de fase — todas las opciones visibles */}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#504441] mb-2">Cambiar fase</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {(Object.entries(STATUS) as [RecipeStatus, typeof STATUS[RecipeStatus]][]).map(([k,c]) => (
                      <button key={k} onClick={() => updateStatus(r.id, k)}
                        className={`
                          flex items-center gap-1.5 px-2.5 py-2 border text-[10px] font-bold uppercase tracking-wider
                          transition-all text-left min-h-[36px]
                          ${r.status === k ? c.bg + ' ' + c.color : 'border-[#504441] text-[#504441] hover:border-[#9d8d8a] hover:text-[#9d8d8a]'}
                        `}>
                        <span>{c.emoji}</span>
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => remove(r.id)} className="flex items-center gap-1 text-[11px] font-bold text-[#504441] hover:text-[#ffb4ab] uppercase tracking-wider transition-colors">
                  <Trash2 size={11}/> Eliminar receta
                </button>
              </div>
            )}

            {tab === 'historial' && (
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {r.historial.map((entry, i) => (
                  <div key={i} className="flex gap-3 p-2.5 bg-[#131313] border border-[#504441]/30">
                    <div className="w-1.5 h-1.5 bg-[#eac349] shrink-0 mt-1.5"/>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2 flex-wrap">
                        <p className="text-[#e5e2e1] text-xs font-bold">{entry.accion}</p>
                        <p className="text-[#504441] text-[10px] shrink-0">
                          {new Date(entry.fecha).toLocaleDateString('es-CL',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
                        </p>
                      </div>
                      {entry.detalle && <p className="text-[#9d8d8a] text-xs mt-0.5 leading-relaxed">{entry.detalle}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Fila de ingrediente editable ─────────────────────────────────────────────
function IngRow({ ing, index: _index, recipeId: _recipeId, onUpdate, onRemove, even }: {
  ing: Ingrediente; index: number; recipeId: string
  onUpdate: (v: Ingrediente) => void; onRemove: () => void; even: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(ing)

  if (!editing) return (
    <div className={`grid grid-cols-[1fr_56px_64px_28px] px-3 py-1.5 group/row ${even?'bg-[#1c1b1b]':'bg-[#131313]'} hover:bg-[#2a2a2a] transition-colors`}>
      <span className="text-[#d5c3bf] text-xs">{ing.nombre}</span>
      <span className="text-[#eac349] text-xs font-bold text-right pr-2">{ing.gramaje>0?ing.gramaje:'—'}</span>
      <span className="text-[#9d8d8a] text-xs">{ing.unidad}</span>
      <div className="flex items-center gap-0.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
        <button onClick={() => { setDraft(ing); setEditing(true) }} className="text-[#504441] hover:text-[#eac349] transition-colors"><Pencil size={10}/></button>
        <button onClick={onRemove} className="text-[#504441] hover:text-[#ffb4ab] transition-colors"><X size={10}/></button>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-[1fr_56px_64px_28px] gap-1 px-2 py-1.5 bg-[#3c2f00]/30 border-l-2 border-[#eac349] items-center">
      <input value={draft.nombre} onChange={e => setDraft(d=>({...d,nombre:e.target.value}))} autoFocus
        className="bg-[#131313] border border-[#eac349] text-[#e5e2e1] px-2 py-1 text-xs outline-none"/>
      <input type="number" min={0} value={draft.gramaje||''} onChange={e => setDraft(d=>({...d,gramaje:+e.target.value}))}
        className="bg-[#131313] border border-[#eac349] text-[#e5e2e1] px-1 py-1 text-xs outline-none text-center"/>
      <select value={draft.unidad} onChange={e => setDraft(d=>({...d,unidad:e.target.value}))}
        className="bg-[#131313] border border-[#eac349] text-[#e5e2e1] px-1 py-1 text-xs outline-none">
        {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
      </select>
      <div className="flex flex-col gap-0.5">
        <button onClick={() => { onUpdate(draft); setEditing(false) }} className="text-[#4ade80] hover:text-[#e5e2e1] transition-colors"><Check size={11}/></button>
        <button onClick={() => { setDraft(ing); setEditing(false) }} className="text-[#504441] hover:text-[#9d8d8a] transition-colors"><X size={11}/></button>
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
        <p className="text-[#9d8d8a] text-sm mt-1">
          Registro completo con ingredientes, gramaje, porciones e historial de cambios.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.entries(STATUS) as [RecipeStatus, typeof STATUS[RecipeStatus]][]).map(([k,c]) => {
          const count = recipes.filter(r => r.status===k).length
          const Icon  = c.icon
          return (
            <button key={k} onClick={() => setFilter(filter===k?'all':k)}
              className={`p-3 border text-left transition-all min-h-[64px] ${filter===k ? c.bg : 'bg-[#1c1b1b] border-[#504441] hover:border-[#9d8d8a]'}`}>
              <Icon size={16} className={`mb-1 ${c.color}`}/>
              <p className={`font-bold text-xl ${c.color}`}>{count}</p>
              <p className="text-[9px] text-[#9d8d8a] uppercase tracking-wider">{c.label}</p>
            </button>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-5 min-h-[48px] bg-[#eac349] text-[#131313] font-bold uppercase tracking-wider text-sm hover:bg-[#cca830] transition-colors">
          <Plus size={15}/> Nueva receta
        </button>
      </div>

      <div className="space-y-3">
        {visible.map(r => <RecipeCard key={r.id} r={r} />)}
        {visible.length === 0 && (
          <p className="text-center text-[#504441] py-16 text-sm uppercase tracking-wider">Sin recetas.</p>
        )}
      </div>

      {modal && <NewModal onClose={() => setModal(false)} />}
    </div>
  )
}
