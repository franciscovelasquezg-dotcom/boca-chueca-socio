import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Milestone } from '../types'

const nanoid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)

interface ProgressStore {
  milestones: Milestone[]
}

// Hitos reales del proyecto al 17-05-2026
const INITIAL: Milestone[] = [
  // ── COMPLETADOS ────────────────────────────────────────────────────
  {
    id: nanoid(), status: 'done', categoria: 'web', fecha: '2026-05-16',
    titulo: 'Sitio web publicado en internet',
    descripcion: 'La Tapería del Boca Chueca está online en taperia-boca-chueca.vercel.app con toda la carta, fotos y formulario de reservas.',
  },
  {
    id: nanoid(), status: 'done', categoria: 'web', fecha: '2026-05-16',
    titulo: 'Carta digital completa con fotos reales',
    descripcion: 'Jarras con tapas gratis, tablas para picar, platos y menú legendario con 20+ fotografías generadas con inteligencia artificial.',
  },
  {
    id: nanoid(), status: 'done', categoria: 'web', fecha: '2026-05-16',
    titulo: 'Formulario de reservas + WhatsApp',
    descripcion: 'Los clientes pueden reservar su mesa desde el sitio web o contactar directamente por WhatsApp.',
  },
  {
    id: nanoid(), status: 'done', categoria: 'admin', fecha: '2026-05-17',
    titulo: 'Panel de control interno operativo',
    descripcion: 'Sistema de gestión de reservas, editor de menú, agenda de tareas, inbox de ideas y laboratorio de recetas.',
  },
  {
    id: nanoid(), status: 'done', categoria: 'admin', fecha: '2026-05-17',
    titulo: 'Agenda de trabajo con tablero Kanban',
    descripcion: 'Tablero visual de tareas en 3 columnas: Pendiente, En Progreso, Completado.',
  },
  {
    id: nanoid(), status: 'done', categoria: 'negocio', fecha: '2026-05-15',
    titulo: 'Concepto de negocio definido',
    descripcion: 'Tapería estilo español con alma chilena. La jarra incluye tapas gratis. Precios de mercado definidos.',
  },
  {
    id: nanoid(), status: 'done', categoria: 'negocio', fecha: '2026-05-15',
    titulo: 'Nombre y marca establecida',
    descripcion: '"La Tapería del Boca Chueca" — nombre, concepto y paleta visual confirmados.',
  },

  // ── EN PROGRESO ────────────────────────────────────────────────────
  {
    id: nanoid(), status: 'in_progress', categoria: 'negocio',
    titulo: 'Búsqueda de local en Barrio Italia',
    descripcion: 'Evaluando opciones en el sector. Prioridad: cocina habilitada, acceso a terraza o patio.',
  },
  {
    id: nanoid(), status: 'in_progress', categoria: 'admin',
    titulo: 'Portal del Socio — este panel',
    descripcion: 'Tu ventana al proyecto. Vista de avance, buzón de ideas y laboratorio de recetas.',
  },
  {
    id: nanoid(), status: 'in_progress', categoria: 'marketing',
    titulo: 'Instagram @labocachueca',
    descripcion: 'Preparando contenido y estrategia de redes sociales para el pre-lanzamiento.',
  },

  // ── PENDIENTES ─────────────────────────────────────────────────────
  {
    id: nanoid(), status: 'pending', categoria: 'negocio',
    titulo: 'Definir estructura societaria',
    descripcion: 'Porcentajes, roles y responsabilidades entre socios.',
  },
  {
    id: nanoid(), status: 'pending', categoria: 'legal',
    titulo: 'Constitución de sociedad',
    descripcion: 'Notaría, SII, patente comercial y permiso de funcionamiento.',
  },
  {
    id: nanoid(), status: 'pending', categoria: 'negocio',
    titulo: 'Primer proveedor de cerveza artesanal',
    descripcion: 'Contactar cervecerías locales para acuerdo de abastecimiento.',
  },
  {
    id: nanoid(), status: 'pending', categoria: 'marketing',
    titulo: 'Lanzamiento en redes sociales',
    descripcion: 'Anuncio oficial del proyecto al mercado.',
  },
  {
    id: nanoid(), status: 'pending', categoria: 'web',
    titulo: 'Dominio propio (bocachueca.cl)',
    descripcion: 'Registro del dominio y conexión con el sitio web publicado.',
  },
]

export const useProgressStore = create<ProgressStore>()(
  persist(
    () => ({ milestones: INITIAL }),
    { name: 'socio-progress' }
  )
)
