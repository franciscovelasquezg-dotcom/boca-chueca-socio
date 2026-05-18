import { useState, type FormEvent } from 'react'
import {
  Plus, ExternalLink, Trash2, TrendingUp, Users,
  BarChart2, BookOpen, Pencil, Check, X, Search,
} from 'lucide-react'
import { useMarketStore } from '../store/marketStore'
import type { MarketType, MarketCard } from '../types'

// ─── Config ──────────────────────────────────────────────────────────────────
const TYPE_CFG: Record<MarketType, { label: string; emoji: string; color: string; border: string; icon: typeof BarChart2 }> = {
  competidor:  { label: 'Competidor',  emoji: '🏪', color: 'bg-[#2b110b] text-[#ecbbb0]', border: 'border-[#8e241e]',  icon: Users      },
  inspiracion: { label: 'Inspiración', emoji: '⭐', color: 'bg-[#3c2f00] text-[#eac349]', border: 'border-[#eac349]',  icon: TrendingUp },
  tendencia:   { label: 'Tendencia',   emoji: '📈', color: 'bg-[#0d1a2b] text-[#93c5fd]', border: 'border-[#1d4ed8]',  icon: BarChart2  },
  analisis:    { label: 'Análisis',    emoji: '🔍', color: 'bg-[#1a0d2b] text-[#c4b5fd]', border: 'border-[#7c3aed]',  icon: BookOpen   },
}

// ─── Modal agregar ────────────────────────────────────────────────────────────
function AddModal({ onClose }: { onClose: () => void }) {
  const add = useMarketStore(s => s.add)
  const [form, setForm] = useState({
    titulo: '', descripcion: '', url: '',
    tipo: 'competidor' as MarketType, tags: '',
  })
  const handle = (e: FormEvent) => {
    e.preventDefault()
    if (!form.titulo.trim()) return
    add({
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      url: form.url.trim() || undefined,
      tipo: form.tipo,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-[#1c1b1b] border border-[#504441] w-full sm:max-w-lg max-h-[90vh] flex flex-col">
        <div className="px-4 py-3 border-b border-[#504441] flex items-center justify-between shrink-0">
          <h3 className="font-display text-[#ecbbb0] italic font-bold text-lg">Nueva tarjeta</h3>
          <button onClick={onClose} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#504441] hover:text-[#9d8d8a] text-xl">×</button>
        </div>
        <form onSubmit={handle} className="p-4 space-y-3 overflow-y-auto flex-1">

          {/* Tipo */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-2">Tipo de tarjeta</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.entries(TYPE_CFG) as [MarketType, typeof TYPE_CFG[MarketType]][]).map(([k, c]) => (
                <button key={k} type="button" onClick={() => setForm(f => ({ ...f, tipo: k }))}
                  className={`flex items-center gap-2 px-3 py-2.5 border text-[11px] font-bold uppercase tracking-wider transition-all text-left
                    ${form.tipo === k ? `${c.color} ${c.border}` : 'border-[#504441] text-[#504441] hover:border-[#9d8d8a]'}`}>
                  <span>{c.emoji}</span> {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Título *</label>
            <input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} autoFocus
              placeholder="Nombre del competidor, tendencia o referente..."
              className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2.5 text-sm outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Descripción y análisis</label>
            <textarea rows={5} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
              placeholder="Fortalezas, debilidades, oportunidades, lecciones clave..."
              className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2.5 text-sm outline-none resize-none transition-colors" />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">URL (opcional)</label>
            <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} type="url"
              placeholder="https://..."
              className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2.5 text-sm outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">Tags (separados por coma)</label>
            <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="barrio-italia, precio, cerveza..."
              className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2.5 text-sm outline-none transition-colors" />
          </div>

          <div className="flex gap-3 pb-1">
            <button type="submit" className="flex-1 min-h-[48px] bg-[#eac349] text-[#131313] font-bold uppercase tracking-wider text-sm hover:bg-[#cca830] transition-colors">
              Guardar tarjeta
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

// ─── Card editable ────────────────────────────────────────────────────────────
function MarketCardItem({ card }: { card: MarketCard }) {
  const { remove, update } = useMarketStore()
  const [expanded, setExpanded]       = useState(false)
  const [editingDesc, setEditingDesc] = useState(false)
  const [draftDesc, setDraftDesc]     = useState(card.descripcion)
  const [editingTitle, setEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle]   = useState(card.titulo)

  const cfg = TYPE_CFG[card.tipo]

  const saveTitle = () => {
    if (draftTitle.trim() && draftTitle !== card.titulo) update(card.id, { titulo: draftTitle.trim() })
    setEditingTitle(false)
  }
  const saveDesc = () => {
    if (draftDesc !== card.descripcion) update(card.id, { descripcion: draftDesc })
    setEditingDesc(false)
  }

  return (
    <div className={`bg-[#1c1b1b] border border-[#504441] border-l-4 ${cfg.border} hover:border-[#9d8d8a] transition-colors group`}>
      <div className="p-4">

        {/* Header */}
        <div className="flex items-start gap-2 justify-between mb-2">
          <div className="flex-1 min-w-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 border inline-flex items-center gap-1 mb-2 ${cfg.color} ${cfg.border}`}>
              {cfg.emoji} {cfg.label}
            </span>

            {/* Título editable */}
            {editingTitle ? (
              <div className="flex flex-col gap-1.5">
                <input value={draftTitle} onChange={e => setDraftTitle(e.target.value)} autoFocus
                  className="w-full bg-[#131313] border border-[#eac349] text-[#e5e2e1] px-2 py-1.5 text-sm font-bold outline-none" />
                <div className="flex gap-2">
                  <button onClick={saveTitle} className="flex items-center gap-1 text-[10px] font-bold text-[#4ade80] uppercase tracking-wider"><Check size={11} /> Guardar</button>
                  <button onClick={() => { setDraftTitle(card.titulo); setEditingTitle(false) }} className="flex items-center gap-1 text-[10px] font-bold text-[#504441] uppercase tracking-wider"><X size={11} /> Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setEditingTitle(true)} className="group/t text-left w-full">
                <h4 className="font-display italic font-bold text-[#e5e2e1] leading-snug text-base">
                  {card.titulo}
                  <Pencil size={10} className="inline ml-1.5 text-[#504441] opacity-0 group-hover/t:opacity-100 transition-opacity" />
                </h4>
              </button>
            )}
          </div>

          {/* Acciones header */}
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setExpanded(!expanded)}
              className="text-[#504441] hover:text-[#eac349] p-1 transition-colors text-xs font-bold uppercase tracking-wider">
              {expanded ? '▲' : '▼'}
            </button>
            <button onClick={() => remove(card.id)} className="text-[#504441] hover:text-[#ffb4ab] p-1 transition-colors">
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Descripción — siempre visible, colapsada a 3 líneas */}
        {!editingDesc ? (
          <div>
            <p className={`text-[#9d8d8a] text-xs leading-relaxed whitespace-pre-line ${expanded ? '' : 'line-clamp-3'}`}>
              {card.descripcion}
            </p>
            <div className="flex items-center gap-3 mt-2">
              {card.descripcion && card.descripcion.length > 150 && (
                <button onClick={() => setExpanded(!expanded)}
                  className="text-[10px] text-[#504441] hover:text-[#eac349] uppercase tracking-wider transition-colors">
                  {expanded ? 'Ver menos ▲' : 'Ver completo ▼'}
                </button>
              )}
              <button onClick={() => { setDraftDesc(card.descripcion); setEditingDesc(true) }}
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] text-[#504441] hover:text-[#eac349] uppercase tracking-wider transition-all">
                <Pencil size={9} /> Editar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <textarea rows={6} value={draftDesc} onChange={e => setDraftDesc(e.target.value)} autoFocus
              className="w-full bg-[#131313] border border-[#eac349] text-[#e5e2e1] px-3 py-2 text-xs outline-none resize-none" />
            <div className="flex gap-2">
              <button onClick={saveDesc} className="flex items-center gap-1 text-[10px] font-bold text-[#4ade80] uppercase tracking-wider"><Check size={11} /> Guardar</button>
              <button onClick={() => { setDraftDesc(card.descripcion); setEditingDesc(false) }} className="flex items-center gap-1 text-[10px] font-bold text-[#504441] uppercase tracking-wider"><X size={11} /> Cancelar</button>
            </div>
          </div>
        )}

        {/* Tags */}
        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {card.tags.map(t => (
              <span key={t} className="text-[9px] text-[#504441] bg-[#131313] border border-[#504441]/40 px-2 py-0.5 uppercase tracking-wider">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* URL */}
        {card.url && (
          <a href={card.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] text-[#eac349] hover:text-[#ecbbb0] transition-colors font-bold mt-3">
            <ExternalLink size={11} /> Ver referencia
          </a>
        )}

        {/* Fecha */}
        <p className="text-[9px] text-[#504441] uppercase tracking-wider mt-2">
          Agregado {new Date(card.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  )
}

// ─── Vista principal ──────────────────────────────────────────────────────────
export function Mercado() {
  const cards  = useMarketStore(s => s.cards)
  const [modal, setModal]   = useState(false)
  const [filter, setFilter] = useState<MarketType | 'all'>('all')
  const [search, setSearch] = useState('')

  const visible = cards
    .filter(c => filter === 'all' || c.tipo === filter)
    .filter(c =>
      !search ||
      c.titulo.toLowerCase().includes(search.toLowerCase()) ||
      c.descripcion.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    )

  const counts = Object.keys(TYPE_CFG).reduce((acc, k) => {
    acc[k as MarketType] = cards.filter(c => c.tipo === k).length
    return acc
  }, {} as Record<MarketType, number>)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-[#ecbbb0] font-black italic text-3xl sm:text-4xl">
            Investigación de Mercado
          </h1>
          <p className="text-[#9d8d8a] text-sm mt-1">
            {cards.length} referencias · Competidores, tendencias, análisis e inspiración.
          </p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-5 min-h-[48px] bg-[#eac349] text-[#131313] font-bold uppercase tracking-wider text-sm hover:bg-[#cca830] transition-colors shrink-0">
          <Plus size={15} /> Agregar
        </button>
      </div>

      {/* Stats por tipo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.entries(TYPE_CFG) as [MarketType, typeof TYPE_CFG[MarketType]][]).map(([k, c]) => (
          <button key={k} onClick={() => setFilter(filter === k ? 'all' : k)}
            className={`p-3 border text-left transition-all min-h-[64px] ${filter === k ? `${c.color} ${c.border}` : 'bg-[#1c1b1b] border-[#504441] hover:border-[#9d8d8a]'}`}>
            <span className="text-xl">{c.emoji}</span>
            <p className="font-bold text-xl text-[#e5e2e1] mt-1">{counts[k]}</p>
            <p className="text-[9px] text-[#9d8d8a] uppercase tracking-wider">{c.label}</p>
          </button>
        ))}
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#504441]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar en toda la investigación..."
          className="w-full bg-[#1c1b1b] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] pl-9 pr-4 py-3 text-sm outline-none transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#504441] hover:text-[#9d8d8a]">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Resultados */}
      {visible.length === 0 ? (
        <p className="text-center text-[#504441] py-16 text-sm uppercase tracking-wider">
          {search ? `Sin resultados para "${search}"` : 'Sin tarjetas en esta categoría.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.map(card => <MarketCardItem key={card.id} card={card} />)}
        </div>
      )}

      {modal && <AddModal onClose={() => setModal(false)} />}
    </div>
  )
}
