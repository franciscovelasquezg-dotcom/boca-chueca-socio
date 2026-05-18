// ─── Auth ──────────────────────────────────────────────────────────────────
export interface PartnerSession {
  authenticated: boolean
  nombre: string   // 'Jaime' u otro socio
}

// ─── Progreso del proyecto ─────────────────────────────────────────────────
export type MilestoneStatus = 'done' | 'in_progress' | 'pending'

export interface Milestone {
  id: string
  titulo: string
  descripcion?: string
  status: MilestoneStatus
  fecha?: string       // ISO date — cuándo se completó o estimado
  categoria: 'web' | 'admin' | 'negocio' | 'legal' | 'marketing'
}

// ─── Aporte del socio → Agenda interna ────────────────────────────────────
export type IdeaSource = 'francisco' | 'cliente' | 'observacion' | 'staff'

export interface PartnerIdea {
  id: string
  contenido: string
  tipo: 'aporte_socio'
  fecha: string
  estado: 'pendiente' | 'en_revision' | 'implementada' | 'descartada'
  autor: string
  source: IdeaSource
}

// ─── Tarjeta de mercado ────────────────────────────────────────────────────
export type MarketType = 'competidor' | 'inspiracion' | 'tendencia' | 'analisis'

export interface MarketCard {
  id: string
  titulo: string
  descripcion: string
  url?: string
  imagen_url?: string
  tipo: MarketType
  tags: string[]
  created_at: string
}

// ─── Receta / Lab ──────────────────────────────────────────────────────────
export type RecipeStatus = 'idea' | 'en_prueba' | 'aprobada' | 'descartada'

export interface Ingrediente {
  nombre: string
  gramaje: number      // 0 = sin gramaje exacto
  unidad: string       // 'g' | 'ml' | 'unid' | 'al gusto' | 'tsp' | etc
}

export interface Recipe {
  id: string
  titulo: string
  descripcion?: string
  ingredientes: Ingrediente[]
  porciones: number
  unidad_porcion: string   // 'personas' | 'unidades' | 'porciones'
  categoria: 'tapa' | 'tabla' | 'plato' | 'legendario' | 'bebida' | 'postre'
  status: RecipeStatus
  notas?: string
  created_at: string
}

// ─── Shared store key (mismo que boca-chueca-admin) ───────────────────────
// Las ideas del socio se escriben en 'boca-ideas' para que el hub admin las lea
export const SHARED_IDEAS_KEY = 'boca-ideas'
export const SHARED_TASKS_KEY = 'boca-tasks'
