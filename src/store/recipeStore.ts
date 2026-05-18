import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Recipe, RecipeStatus, Ingrediente, RecipeLog } from '../types'

const nanoid  = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
const ahora   = () => new Date().toISOString()
const log     = (accion: string, detalle?: string): RecipeLog => ({ fecha: ahora(), accion, detalle })

interface RecipeStore {
  recipes: Recipe[]
  add:          (p: Omit<Recipe, 'id' | 'created_at' | 'updated_at' | 'historial'>) => void
  updateStatus: (id: string, status: RecipeStatus) => void
  updateField:  (id: string, field: keyof Pick<Recipe, 'titulo' | 'descripcion' | 'notas' | 'porciones' | 'unidad_porcion' | 'categoria'>, value: string | number) => void
  addIngrediente:    (id: string, ing: Ingrediente) => void
  removeIngrediente: (id: string, nombre: string) => void
  updateIngrediente: (id: string, index: number, ing: Ingrediente, prev: Ingrediente) => void
  remove: (id: string) => void
}

const HOY = ahora()

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set) => ({
      recipes: [
        {
          id: nanoid(),
          titulo: 'Croquetas de mechada',
          descripcion: 'Croqueta cremosa rellena de carne mechada chilena. Tapa incluida con cada jarra.',
          ingredientes: [
            { nombre: 'Carne mechada cocida', gramaje: 200, unidad: 'g'     },
            { nombre: 'Mantequilla',          gramaje: 50,  unidad: 'g'     },
            { nombre: 'Harina',               gramaje: 80,  unidad: 'g'     },
            { nombre: 'Leche entera',         gramaje: 300, unidad: 'ml'    },
            { nombre: 'Huevo',                gramaje: 2,   unidad: 'unid'  },
            { nombre: 'Pan rallado',          gramaje: 100, unidad: 'g'     },
            { nombre: 'Sal y pimienta',       gramaje: 0,   unidad: 'al gusto' },
          ],
          porciones: 4,
          unidad_porcion: 'tapas (4 croquetas c/u)',
          categoria: 'tapa',
          status: 'aprobada',
          notas: 'Freír a 180°C por 3 minutos. Servir inmediatamente. Rendimiento: 16 croquetas por receta base.',
          created_at: HOY,
          updated_at: HOY,
          historial: [
            { fecha: HOY, accion: 'Receta creada', detalle: 'Receta base ingresada al sistema.' },
            { fecha: HOY, accion: 'Estado actualizado', detalle: 'Cambiado a Aprobada — lista para la carta.' },
          ],
        },
      ],

      add: (p) => {
        const now = ahora()
        set(s => ({
          recipes: [{
            ...p,
            id:         nanoid(),
            created_at: now,
            updated_at: now,
            historial:  [log('Receta creada', `"${p.titulo}" ingresada al sistema.`)],
          }, ...s.recipes],
        }))
      },

      updateStatus: (id, status) => {
        const labels: Record<RecipeStatus, string> = {
          idea: '💡 Idea', en_prueba: '🧪 En Prueba', en_proceso: '🔄 En Proceso',
          ajustando: '✏️ Ajustando', aprobada: '✅ Aprobada', descartada: '❌ Descartada',
        }
        set(s => ({
          recipes: s.recipes.map(r => r.id !== id ? r : {
            ...r, status,
            updated_at: ahora(),
            historial: [log('Estado actualizado', `Cambiado a: ${labels[status]}`), ...r.historial],
          }),
        }))
      },

      updateField: (id, field, value) => {
        const labels: Partial<Record<keyof Recipe, string>> = {
          titulo: 'Nombre', descripcion: 'Descripción', notas: 'Notas',
          porciones: 'Porciones', unidad_porcion: 'Unidad de porción', categoria: 'Categoría',
        }
        set(s => ({
          recipes: s.recipes.map(r => r.id !== id ? r : {
            ...r, [field]: value,
            updated_at: ahora(),
            historial: [log(`${labels[field] ?? field} modificado`, `Nuevo valor: "${value}"`), ...r.historial],
          }),
        }))
      },

      addIngrediente: (id, ing) => {
        set(s => ({
          recipes: s.recipes.map(r => r.id !== id ? r : {
            ...r,
            ingredientes: [...r.ingredientes, ing],
            updated_at: ahora(),
            historial: [
              log('Ingrediente agregado', `"${ing.nombre}" — ${ing.gramaje > 0 ? `${ing.gramaje} ${ing.unidad}` : ing.unidad}`),
              ...r.historial,
            ],
          }),
        }))
      },

      removeIngrediente: (id, nombre) => {
        set(s => ({
          recipes: s.recipes.map(r => r.id !== id ? r : {
            ...r,
            ingredientes: r.ingredientes.filter(i => i.nombre !== nombre),
            updated_at: ahora(),
            historial: [log('Ingrediente eliminado', `"${nombre}" quitado de la receta.`), ...r.historial],
          }),
        }))
      },

      updateIngrediente: (id, index, ing, prev) => {
        const cambios: string[] = []
        if (prev.nombre  !== ing.nombre)  cambios.push(`nombre: "${prev.nombre}" → "${ing.nombre}"`)
        if (prev.gramaje !== ing.gramaje) cambios.push(`gramaje: ${prev.gramaje} → ${ing.gramaje}`)
        if (prev.unidad  !== ing.unidad)  cambios.push(`unidad: ${prev.unidad} → ${ing.unidad}`)

        set(s => ({
          recipes: s.recipes.map(r => r.id !== id ? r : {
            ...r,
            ingredientes: r.ingredientes.map((i, idx) => idx === index ? ing : i),
            updated_at: ahora(),
            historial: cambios.length
              ? [log('Ingrediente modificado', `"${prev.nombre}": ${cambios.join(', ')}`), ...r.historial]
              : r.historial,
          }),
        }))
      },

      remove: (id) => set(s => ({ recipes: s.recipes.filter(r => r.id !== id) })),
    }),
    { name: 'socio-recipes', version: 3 }
  )
)
