import { useState, type FormEvent } from 'react'
import { Plus, ExternalLink, Trash2, TrendingUp, Users, BarChart2, BookOpen } from 'lucide-react'
import { useMarketStore } from '../store/marketStore'
import type { MarketType } from '../types'

const typeConfig: Record<MarketType, { label: string; color: string; icon: typeof BarChart2 }> = {
  competidor:  { label: 'Competidor',  color: 'bg-[#2b110b] text-[#ecbbb0] border-[#8e241e]',  icon: Users      },
  inspiracion: { label: 'Inspiración', color: 'bg-[#3c2f00] text-[#eac349] border-[#eac349]',  icon: TrendingUp },
  tendencia:   { label: 'Tendencia',   color: 'bg-[#1a0d2b] text-[#c4b5fd] border-[#7c3aed]',  icon: BarChart2  },
  analisis:    { label: 'Análisis',    color: 'bg-[#0d1a2b] text-[#93c5fd] border-[#1d4ed8]',  icon: BookOpen   },
}

function AddModal({ onClose }: { onClose: () => void }) {
  const add = useMarketStore(s => s.add)
  const [form, setForm] = useState({ titulo: '', descripcion: '', url: '', tipo: 'inspiracion' as MarketType, tags: '' })
  const handle = (e: FormEvent) => {
    e.preventDefault()
    if (!form.titulo.trim()) return
    add({ titulo: form.titulo, descripcion: form.descripcion, url: form.url || undefined, tipo: form.tipo, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) })
    onClose()
  }
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1c1b1b] border border-[#504441] w-full max-w-md shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="px-5 py-4 border-b border-[#504441] flex items-center justify-between">
          <h3 className="font-display text-[#ecbbb0] italic font-bold text-lg">Nueva tarjeta</h3>
          <button onClick={onClose} className="text-[#504441] hover:text-[#9d8d8a] text-xl">×</button>
        </div>
        <form onSubmit={handle} className="p-5 space-y-3">
          <div className="flex gap-2 flex-wrap">
            {(Object.entries(typeConfig) as [MarketType, typeof typeConfig[MarketType]][]).map(([k,c]) => (
              <button key={k} type="button" onClick={() => setForm(f=>({...f,tipo:k}))}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all ${form.tipo===k ? c.color : 'border-[#504441] text-[#504441]'}`}>
                {c.label}
              </button>
            ))}
          </div>
          {[
            { key:'titulo', label:'Título *', placeholder:'Nombre del lugar, tendencia...' },
            { key:'descripcion', label:'Descripción', placeholder:'Qué aprendemos de esto...' },
            { key:'url', label:'URL (opcional)', placeholder:'https://...' },
            { key:'tags', label:'Tags (coma)', placeholder:'barrio italia, cerveza...' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9d8d8a] mb-1">{f.label}</label>
              <input value={(form as Record<string,string>)[f.key]} onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))}
                placeholder={f.placeholder}
                className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] px-3 py-2 text-sm outline-none transition-colors"/>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-2.5 bg-[#eac349] text-[#131313] font-bold uppercase tracking-wider text-sm">Guardar</button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-[#504441] text-[#9d8d8a] text-sm font-bold uppercase">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function Mercado() {
  const { cards, remove } = useMarketStore()
  const [modal, setModal]   = useState(false)
  const [filter, setFilter] = useState<MarketType | 'all'>('all')
  const visible = filter === 'all' ? cards : cards.filter(c => c.tipo === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[#ecbbb0] font-black italic text-3xl sm:text-4xl">Investigación de Mercado</h1>
        <p className="text-[#9d8d8a] text-sm mt-1">Competidores, referentes e inspiración gastronómica.</p>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border transition-all ${filter==='all' ? 'bg-[#3c2f00] border-[#eac349] text-[#eac349]' : 'border-[#504441] text-[#504441]'}`}>
            Todas ({cards.length})
          </button>
          {(Object.entries(typeConfig) as [MarketType, typeof typeConfig[MarketType]][]).map(([k,c]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border transition-all ${filter===k ? c.color : 'border-[#504441] text-[#504441]'}`}>
              {c.label}
            </button>
          ))}
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#eac349] text-[#131313] font-bold uppercase tracking-wider text-xs hover:bg-[#cca830] transition-colors">
          <Plus size={14} /> Agregar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {visible.map(card => {
          const cfg = typeConfig[card.tipo]; const Icon = cfg.icon
          return (
            <div key={card.id} className="bg-[#1c1b1b] border border-[#504441] p-5 hover:border-[#9d8d8a] transition-all group flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <span className={`text-[10px] font-bold px-2 py-1 border inline-flex items-center gap-1 ${cfg.color}`}>
                  <Icon size={10} /> {cfg.label}
                </span>
                <button onClick={() => remove(card.id)} className="opacity-0 group-hover:opacity-100 text-[#504441] hover:text-[#ffb4ab] transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
              <div>
                <h4 className="font-display italic font-bold text-[#e5e2e1] leading-tight">{card.titulo}</h4>
                {card.descripcion && <p className="text-[#9d8d8a] text-sm mt-2 leading-relaxed">{card.descripcion}</p>}
              </div>
              {card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {card.tags.map(t => <span key={t} className="text-[9px] text-[#504441] bg-[#131313] px-2 py-0.5">{t}</span>)}
                </div>
              )}
              {card.url && (
                <a href={card.url} target="_blank" className="flex items-center gap-1.5 text-[11px] text-[#eac349] hover:text-[#ecbbb0] transition-colors font-bold mt-auto">
                  <ExternalLink size={11} /> Ver referencia
                </a>
              )}
            </div>
          )
        })}
        {visible.length === 0 && (
          <p className="col-span-full text-center text-[#504441] py-16 text-sm uppercase tracking-wider">Sin tarjetas aún.</p>
        )}
      </div>

      {modal && <AddModal onClose={() => setModal(false)} />}
    </div>
  )
}
