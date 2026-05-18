import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MarketCard, MarketType } from '../types'

const nanoid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)

interface MarketStore {
  cards: MarketCard[]
  add: (p: Omit<MarketCard, 'id' | 'created_at'>) => void
  remove: (id: string) => void
}

export const useMarketStore = create<MarketStore>()(
  persist(
    (set) => ({
      cards: [
        {
          id: nanoid(), tipo: 'inspiracion' as MarketType,
          titulo: 'Bar Calders — Barcelona',
          descripcion: 'El referente mundial del bar de tapas con personalidad. Vermú de mediodía, tapas de mercado y ambiente de barrio genuino.',
          url: 'https://www.barcalders.com',
          tags: ['barcelona', 'vermú', 'referente'],
          created_at: new Date().toISOString(),
        },
        {
          id: nanoid(), tipo: 'tendencia' as MarketType,
          titulo: 'Tendencia: menú corto y rotación semanal',
          descripcion: 'Los mejores bares de tapas en Chile tienen 8-12 items máximo y los rotan según temporada. Menor desperdicio, mayor calidad.',
          tags: ['menú', 'tendencia', 'sostenibilidad'],
          created_at: new Date().toISOString(),
        },
        {
          id: nanoid(), tipo: 'competidor' as MarketType,
          titulo: 'La Tasca — Barrio Italia',
          descripcion: 'Principal competidor directo. Precio alto, sin concepto chileno propio. Oportunidad: nosotros somos más auténticos y accesibles.',
          tags: ['competidor', 'barrio-italia'],
          created_at: new Date().toISOString(),
        },
      ],
      add: (p) => set(s => ({ cards: [{ ...p, id: nanoid(), created_at: new Date().toISOString() }, ...s.cards] })),
      remove: (id) => set(s => ({ cards: s.cards.filter(c => c.id !== id) })),
    }),
    { name: 'socio-market' }
  )
)
