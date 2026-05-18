import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Recipe, RecipeStatus } from '../types'

const nanoid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)

interface RecipeStore {
  recipes: Recipe[]
  add: (p: Omit<Recipe, 'id' | 'created_at'>) => void
  updateStatus: (id: string, status: RecipeStatus) => void
  update: (id: string, patch: Partial<Recipe>) => void
  remove: (id: string) => void
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set) => ({
      recipes: [
        {
          id: nanoid(),
          titulo: 'Croquetas de mechada',
          descripcion: 'Croqueta cremosa rellena de carne mechada chilena. Tapa incluida con cada jarra.',
          ingredientes: [
            { nombre: 'Carne mechada cocida', gramaje: 200, unidad: 'g' },
            { nombre: 'Mantequilla',          gramaje: 50,  unidad: 'g' },
            { nombre: 'Harina',               gramaje: 80,  unidad: 'g' },
            { nombre: 'Leche entera',         gramaje: 300, unidad: 'ml' },
            { nombre: 'Huevo',                gramaje: 2,   unidad: 'unid' },
            { nombre: 'Pan rallado',          gramaje: 100, unidad: 'g' },
            { nombre: 'Sal y pimienta',       gramaje: 0,   unidad: 'al gusto' },
          ],
          porciones: 4,
          unidad_porcion: 'unidades (4 croquetas por tapa)',
          categoria: 'tapa',
          status: 'aprobada',
          notas: 'Freír a 180°C por 3 minutos. Servir inmediatamente. Rendimiento: 16 croquetas por receta base.',
          created_at: new Date().toISOString(),
        },
      ],

      add: (p) => set(s => ({
        recipes: [{ ...p, id: nanoid(), created_at: new Date().toISOString() }, ...s.recipes]
      })),

      updateStatus: (id, status) => set(s => ({
        recipes: s.recipes.map(r => r.id === id ? { ...r, status } : r)
      })),

      update: (id, patch) => set(s => ({
        recipes: s.recipes.map(r => r.id === id ? { ...r, ...patch } : r)
      })),

      remove: (id) => set(s => ({ recipes: s.recipes.filter(r => r.id !== id) })),
    }),
    { name: 'socio-recipes', version: 2 }
  )
)
