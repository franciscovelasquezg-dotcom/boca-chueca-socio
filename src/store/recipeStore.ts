import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Recipe, RecipeStatus } from '../types'

const nanoid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)

interface RecipeStore {
  recipes: Recipe[]
  add: (p: Omit<Recipe, 'id' | 'created_at'>) => void
  updateStatus: (id: string, status: RecipeStatus) => void
  remove: (id: string) => void
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set) => ({
      recipes: [
        {
          id: nanoid(), titulo: 'Cazuela de mariscos al vermú', status: 'aprobada',
          descripcion: 'Mariscos chilenos en caldo de vermú blanco. Va al menú legendario.',
          ingredientes: ['choritos', 'almejas', 'camarones', 'vermú blanco', 'ajo', 'perejil'],
          categoria: 'plato', notas: 'Aprobada en degustación. Lista para carta.',
          created_at: new Date().toISOString(),
        },
        {
          id: nanoid(), titulo: 'Pulpo en escabeche frío', status: 'en_prueba',
          descripcion: 'Versión fría del pulpo para temporada de verano.',
          ingredientes: ['pulpo', 'vinagre de vino', 'ají de color', 'laurel', 'cebolla morada'],
          categoria: 'tapa', created_at: new Date().toISOString(),
        },
        {
          id: nanoid(), titulo: 'Tapa de huevo con morcilla y trufa', status: 'idea',
          descripcion: 'Plato de autor para el menú legendario. Combinación española-chilena.',
          ingredientes: ['huevo de campo', 'morcilla ibérica', 'aceite de trufa', 'pan brioche'],
          categoria: 'legendario', notas: 'Idea de Francisco. Pendiente de prueba.',
          created_at: new Date().toISOString(),
        },
        {
          id: nanoid(), titulo: 'Vermú de cosecha propia', status: 'idea',
          descripcion: 'Macerado local con hierbas chilenas y vino del Valle Central.',
          ingredientes: ['vino blanco chileno', 'boldo', 'matico', 'naranja', 'azúcar'],
          categoria: 'bebida', created_at: new Date().toISOString(),
        },
      ],
      add: (p) => set(s => ({ recipes: [{ ...p, id: nanoid(), created_at: new Date().toISOString() }, ...s.recipes] })),
      updateStatus: (id, status) => set(s => ({ recipes: s.recipes.map(r => r.id === id ? { ...r, status } : r) })),
      remove: (id) => set(s => ({ recipes: s.recipes.filter(r => r.id !== id) })),
    }),
    { name: 'socio-recipes' }
  )
)
