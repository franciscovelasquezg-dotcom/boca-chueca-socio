import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SpecFase {
  id: string
  numero: number
  nombre: string
  descripcion: string
  fechaEstimada: string
  estado: 'completada' | 'en_curso' | 'pendiente'
  entregables: string[]
}

export interface SpecSocio {
  nombre: string
  rol: string
  responsabilidades: string[]
  participacion: string
}

export interface SpecInversion {
  item: string
  minCLP: number
  maxCLP: number
  notas?: string
}

export interface ProjectSpec {
  // Concepto
  nombreComercial: string
  concepto: string
  propuestaDeValor: string
  publicoObjetivo: string
  ubicacion: string
  horario: string

  // Modelo de negocio
  modeloNegocio: string

  // Fases
  fases: SpecFase[]

  // Inversión
  inversiones: SpecInversion[]

  // Socios
  socios: SpecSocio[]

  // Links
  links: { label: string; url: string }[]

  // Metadata
  version: string
  ultimaActualizacion: string
}

const nanoid = () => Math.random().toString(36).slice(2, 9)

const SPEC_INICIAL: ProjectSpec = {
  nombreComercial: 'La Tapería del Boca Chueca',
  concepto: 'Bar de tapas de estilo español adaptado a Chile. El modelo core: cada jarra de cerveza incluye tapas de la casa sin costo adicional — exactamente como funciona en los bares de barrio en España. Ingredientes chilenos (mechada, merkén, papas chilotas, pebre) dentro del formato español (tapa, tabla, pinchos). Ambiente de barrio: auténtico, ruidoso, accesible, con identidad propia.',
  propuestaDeValor: 'Pide tu jarra — las tapas van incluidas. Precio de mercado, valor real. Sin protocolo, con toda la actitud de Barrio Italia.',
  publicoObjetivo: 'Profesionales y creativos de 28–45 años en Santiago. Buscan autenticidad, no glamour. Salen en grupos de 3–6. Ticket promedio por persona: $8.000–$15.000. Horario preferido: 18:30–22:30.',
  ubicacion: 'Barrio Italia, Santiago — eje Condell / Girardi / Av. Italia. Local objetivo: cocina habilitada, mínimo 40 m², acceso a terraza o patio.',
  horario: 'Martes a Domingo · 18:00–00:00',

  modeloNegocio: 'Venta de bebestibles como producto principal. Las tapas son el diferenciador y costo de retención (no el negocio central). La gente toma más cuando come: rotación estimada 2–3 jarras por visita. Margen bruto jarra 500ml: ~$1.800–$2.200 incluyendo 2 tapas. Margen bruto jarra 1L: ~$3.300–$3.900 incluyendo 3 tapas.',

  fases: [
    {
      id: nanoid(), numero: 1, nombre: 'Fundación Digital',
      descripcion: 'Construir la presencia digital del proyecto antes de abrir el local. Sitio web, carta digital, sistemas de gestión y portales internos.',
      fechaEstimada: 'Mayo 2026', estado: 'completada',
      entregables: [
        'Sitio web público con carta y reservas online',
        'Hub Admin interno (reservas, menú, agenda, recetas)',
        'Portal del Socio con bitácora y spec del proyecto',
        'Investigación de mercado documentada',
        '20 fotografías de platos generadas con IA',
      ],
    },
    {
      id: nanoid(), numero: 2, nombre: 'Constitución Legal',
      descripcion: 'Formalizar la sociedad, obtener permisos y definir la estructura legal del negocio antes de firmar cualquier arriendo.',
      fechaEstimada: 'Junio 2026', estado: 'en_curso',
      entregables: [
        'Definición de porcentajes y roles entre socios',
        'Constitución de sociedad en notaría',
        'Inscripción SII y obtención de RUT',
        'Inicio trámites patente comercial',
      ],
    },
    {
      id: nanoid(), numero: 3, nombre: 'Local y Habilitación',
      descripcion: 'Encontrar el local, negociar el arriendo y habilitar el espacio para apertura.',
      fechaEstimada: 'Julio–Agosto 2026', estado: 'pendiente',
      entregables: [
        'Firma contrato de arriendo en Barrio Italia',
        'Diseño y remodelación del espacio',
        'Equipamiento de cocina (segunda mano)',
        'Mobiliario y decoración final',
        'Permiso de funcionamiento municipal',
      ],
    },
    {
      id: nanoid(), numero: 4, nombre: 'Pre-Apertura',
      descripcion: 'Preparar todo para el día de apertura: equipo, proveedores, carta física, redes sociales y evento de lanzamiento.',
      fechaEstimada: 'Septiembre 2026', estado: 'pendiente',
      entregables: [
        'Contratación de equipo base (cocina + sala)',
        'Acuerdo con proveedor de cerveza artesanal de barril',
        'Carta física impresa y menú digital QR',
        'Lanzamiento Instagram @labocachueca',
        'Evento privado de degustación con invitados',
      ],
    },
    {
      id: nanoid(), numero: 5, nombre: 'Apertura Oficial',
      descripcion: 'Inauguración pública de La Tapería del Boca Chueca.',
      fechaEstimada: 'Octubre 2026', estado: 'pendiente',
      entregables: [
        'Apertura al público',
        'Dominio bocachueca.cl activo',
        'Sistema de reservas online operativo',
        'Métricas semana 1: ocupación, ticket promedio, rotación',
      ],
    },
  ],

  inversiones: [
    { item: 'Garantía + primer arriendo',          minCLP: 3000000,  maxCLP: 5400000,  notas: 'Varía según local y negociación' },
    { item: 'Remodelación básica (sin obras mayores)', minCLP: 4000000, maxCLP: 8000000, notas: 'Sin demoliciones ni obras estructurales' },
    { item: 'Equipamiento cocina (segunda mano)',   minCLP: 2000000,  maxCLP: 4000000  },
    { item: 'Mobiliario y decoración',              minCLP: 2000000,  maxCLP: 5000000  },
    { item: 'Capital de trabajo (3 meses)',         minCLP: 3000000,  maxCLP: 5000000,  notas: 'Sueldos, insumos, servicios' },
    { item: 'Licencias, patente y gastos legales',  minCLP: 1000000,  maxCLP: 2000000  },
  ],

  socios: [
    {
      nombre: 'Francisco Velásquez',
      rol: 'CEO & CTO',
      responsabilidades: [
        'Dirección estratégica del proyecto',
        'Desarrollo y mantenimiento de todos los sistemas digitales',
        'Gestión de proveedores tecnológicos',
        'Carta y concepto gastronómico',
      ],
      participacion: 'Por definir',
    },
    {
      nombre: 'Socio',
      rol: 'COO & Socio Fundador',
      responsabilidades: [
        'Operaciones del local',
        'Gestión del equipo de trabajo',
        'Relación con proveedores de insumos',
        'Control de costos y caja',
      ],
      participacion: 'Por definir',
    },
  ],

  links: [
    { label: '🌐 Sitio Web Público',    url: 'https://taperia-boca-chueca.vercel.app'  },
    { label: '🔧 Hub Admin (Francisco)', url: 'https://boca-chueca-admin.vercel.app'   },
    { label: '🤝 Portal del Socio',     url: 'https://boca-chueca-socio.vercel.app'   },
    { label: '📦 GitHub Sitio Web',     url: 'https://github.com/franciscovelasquezg-dotcom/taperia-boca-chueca' },
  ],

  version: '1.0',
  ultimaActualizacion: new Date().toISOString(),
}

interface SpecStore {
  spec: ProjectSpec
  updateField: <K extends keyof ProjectSpec>(key: K, value: ProjectSpec[K]) => void
  updateFaseEstado: (id: string, estado: SpecFase['estado']) => void
}

export const useSpecStore = create<SpecStore>()(
  persist(
    (set) => ({
      spec: SPEC_INICIAL,

      updateField: (key, value) =>
        set(s => ({
          spec: { ...s.spec, [key]: value, ultimaActualizacion: new Date().toISOString() }
        })),

      updateFaseEstado: (id, estado) =>
        set(s => ({
          spec: {
            ...s.spec,
            fases: s.spec.fases.map(f => f.id === id ? { ...f, estado } : f),
            ultimaActualizacion: new Date().toISOString(),
          }
        })),
    }),
    { name: 'boca-spec', version: 1 }
  )
)
