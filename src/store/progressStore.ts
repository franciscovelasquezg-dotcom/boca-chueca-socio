import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Milestone } from '../types'

const nanoid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)

interface ProgressStore {
  milestones: Milestone[]
}

const INITIAL: Milestone[] = [
  // ── COMPLETADOS ─────────────────────────────────────────────
  {
    id: nanoid(), status: 'done', categoria: 'negocio', fecha: '2026-05-15',
    titulo: 'Concepto y nombre definido',
    descripcion: '"La Tapería del Boca Chueca" — tapas españolas con alma chilena. La jarra incluye tapas gratis.',
  },
  {
    id: nanoid(), status: 'done', categoria: 'web', fecha: '2026-05-16',
    titulo: 'Sitio web público lanzado',
    descripcion: 'Carta completa, 20 fotos generadas con IA, formulario de reservas y WhatsApp. Publicado en taperia-boca-chueca.vercel.app',
  },
  {
    id: nanoid(), status: 'done', categoria: 'web', fecha: '2026-05-16',
    titulo: 'Carta digital con imágenes reales de platos',
    descripcion: 'Jarras + tapas gratis, tablas para picar, platos y menú legendario. Fotos con vapor y jarra transpirando generadas con Leonardo.ai.',
  },
  {
    id: nanoid(), status: 'done', categoria: 'web', fecha: '2026-05-16',
    titulo: 'Menú Legendario — los platos estrella',
    descripcion: 'Sección exclusiva con La Tabla del Conquistador ($28.900), Pulpo entero ($19.900), El Boca Chueca firma ($11.900).',
  },
  {
    id: nanoid(), status: 'done', categoria: 'admin', fecha: '2026-05-17',
    titulo: 'Hub Admin interno operativo',
    descripcion: 'Panel de gestión con Kanban de tareas, inbox de ideas, editor de menú, lab de recetas e investigación de mercado.',
  },
  {
    id: nanoid(), status: 'done', categoria: 'admin', fecha: '2026-05-17',
    titulo: 'Portal del Socio lanzado',
    descripcion: 'Este portal — bitácora del proyecto, avances en tiempo real, buzón de aportes, mercado y lab de recetas. Publicado en boca-chueca-socio.vercel.app',
  },
  {
    id: nanoid(), status: 'done', categoria: 'negocio', fecha: '2026-05-17',
    titulo: 'Carta de precios definida',
    descripcion: 'Jarra 500ml $3.500 (2 tapas), Jarra 1L $6.500 (3 tapas), Copa $2.500 (1 tapa). Tablas $7.900–$28.900. Platos $5.500–$9.900.',
  },

  // ── EN PROGRESO ─────────────────────────────────────────────
  {
    id: nanoid(), status: 'in_progress', categoria: 'negocio',
    titulo: 'Búsqueda de local — Barrio Italia',
    descripcion: 'Evaluando locales con cocina habilitada. Prioritario: acceso a terraza o patio, aforo mínimo 30 personas.',
  },
  {
    id: nanoid(), status: 'in_progress', categoria: 'marketing',
    titulo: 'Instagram @labocachueca',
    descripcion: 'Preparando contenido y estrategia para el pre-lanzamiento. Fotos del concepto y platos listos.',
  },
  {
    id: nanoid(), status: 'in_progress', categoria: 'admin',
    titulo: 'Spec del proyecto y hoja de ruta',
    descripcion: 'Definiendo el documento maestro del proyecto: fases, inversión, roles y responsabilidades.',
  },

  // ── PENDIENTES ──────────────────────────────────────────────
  {
    id: nanoid(), status: 'pending', categoria: 'negocio',
    titulo: 'Estructura societaria',
    descripcion: 'Definir porcentajes de participación, roles de cada socio y estructura legal del negocio.',
  },
  {
    id: nanoid(), status: 'pending', categoria: 'legal',
    titulo: 'Constitución de sociedad',
    descripcion: 'Notaría, SII, patente comercial y permiso de funcionamiento municipal.',
  },
  {
    id: nanoid(), status: 'pending', categoria: 'negocio',
    titulo: 'Acuerdo con proveedor de cerveza artesanal',
    descripcion: 'Contactar cervecerías locales para acuerdo de abastecimiento y precio por jarra.',
  },
  {
    id: nanoid(), status: 'pending', categoria: 'web',
    titulo: 'Dominio personalizado bocachueca.cl',
    descripcion: 'Registro del dominio y conexión con Vercel.',
  },
  {
    id: nanoid(), status: 'pending', categoria: 'marketing',
    titulo: 'Lanzamiento público en redes sociales',
    descripcion: 'Anuncio oficial del proyecto con fecha de apertura estimada.',
  },
  {
    id: nanoid(), status: 'pending', categoria: 'negocio',
    titulo: 'Plan de inversión inicial',
    descripcion: 'Presupuesto detallado: arriendo, remodelación, equipamiento de cocina, insumos iniciales.',
  },
]

export const useProgressStore = create<ProgressStore>()(
  persist(
    () => ({ milestones: INITIAL }),
    {
      name: 'socio-progress',
      // Forzar actualización si ya hay datos guardados viejos
      version: 2,
    }
  )
)
