import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MarketCard } from '../types'

const nanoid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
const hoy    = new Date().toISOString()

interface MarketStore {
  cards: MarketCard[]
  add:    (p: Omit<MarketCard, 'id' | 'created_at'>) => void
  remove: (id: string) => void
  update: (id: string, patch: Partial<MarketCard>) => void
}

const CARDS: Omit<MarketCard, 'id' | 'created_at'>[] = [

  // ══════════════════════════════════════════════════════════
  // COMPETIDORES DIRECTOS — Santiago
  // ══════════════════════════════════════════════════════════
  {
    tipo: 'competidor',
    titulo: 'La Tasca Mediterránea — Providencia',
    descripcion: 'Uno de los más establecidos. Local de 80 personas, carta española clásica sin adaptación local. Precio promedio tapa: $3.500–$5.000. Jarra de cerveza ~$5.000 sin tapas incluidas. Debilidad clara: ambiente frío y formal, sin identidad de barrio. No ofrecen el concepto de "tapa incluida". Clientela: ejecutivos almuerzo y cenas de negocio. Oportunidad: nosotros somos más auténticos, más baratos y más divertidos.',
    tags: ['providencia', 'competidor-directo', 'precio-alto', 'sin-concepto-chileno'],
    url: '',
  },
  {
    tipo: 'competidor',
    titulo: 'Liguria — Pedro de Valdivia / Lastarria',
    descripcion: 'No es una tapería pero es el referente de bar de barrio en Santiago. Precios populares, ambiente ruidoso y auténtico, carta larga. Tienen fieles. Lo que hacen bien: precio, volumen, atmósfera. Lo que no tienen: concepto curado, tapas españolas, identidad de marca. Referencia clave para el ambiente que queremos lograr — pero con más identidad gastronómica.',
    tags: ['lastarria', 'referente-ambiente', 'popular', 'precio-bajo'],
    url: '',
  },
  {
    tipo: 'competidor',
    titulo: 'Bar El Toro — Barrio Italia',
    descripcion: 'Competidor en nuestra zona objetivo. Bar de vinos con piqueos, no tapería española. Precios: copa de vino $3.000–$4.500, tabla de quesos $8.000–$12.000. Tienen terraza pequeña muy demandada. Reservan con 1 semana de anticipación los fines de semana. Capacidad: ~50 personas. Oportunidad: no tienen cerveza artesanal ni el concepto de tapa gratuita.',
    tags: ['barrio-italia', 'competidor-directo', 'vinos', 'terraza'],
    url: '',
  },
  {
    tipo: 'competidor',
    titulo: 'Txoko Bar — Bellavista',
    descripcion: 'Referente de pintxos y tapas vascas en Santiago. Buena ejecución, precios altos ($4.000–$7.000 por tapa individual). Lleno todos los fines de semana. No tienen concepto de jarra con tapa incluida. Debilidad: muy lejos de Barrio Italia, no tienen identidad chilena. Fortaleza: han educado al mercado santiaguino en el concepto de tapa. Eso nos favorece.',
    tags: ['bellavista', 'tapas-vascas', 'precio-alto', 'mercado-educado'],
    url: '',
  },
  {
    tipo: 'competidor',
    titulo: 'Bocanáriz — Lastarria',
    descripcion: 'Bar de vinos con tapas de autor. Precio promedio tapa: $5.500–$8.000. Muy premium. Su fortaleza es la carta de vinos (200+ etiquetas). No son competencia directa por precio, pero nos sirven de referencia de presentación. Lo que hacen bien: fotografía de platos, experiencia de usuario, diseño del espacio. Oportunidad: existir en Barrio Italia a precios más accesibles con igual calidad.',
    tags: ['lastarria', 'premium', 'vinos', 'autor'],
    url: '',
  },
  {
    tipo: 'competidor',
    titulo: 'Casa Española — Santiago Centro',
    descripcion: 'Institución histórica. Más restaurante que tapería. Clientela mayor, turistas y eventos corporativos. No es competencia directa pero es la marca de referencia de "lo español" en Chile. Precio plato: $8.000–$15.000. Lo usan para eventos y almuerzos de trabajo, no para salir de noche. Oportunidad: el segmento joven y moderno no tiene dónde ir por tapas de calidad a precio justo.',
    tags: ['centro', 'tradicional', 'turismo', 'eventos'],
    url: '',
  },

  // ══════════════════════════════════════════════════════════
  // ANÁLISIS DE MERCADO
  // ══════════════════════════════════════════════════════════
  {
    tipo: 'analisis',
    titulo: 'Benchmark de precios — jarras de cerveza en Santiago 2026',
    descripcion: 'Relevamiento propio (mayo 2026):\n• Jarra 500ml promedio bar normal: $2.800–$3.500\n• Jarra 500ml bar premium / artesanal: $4.000–$5.500\n• Jarra 1L promedio: $5.500–$7.000\n• Nuestra propuesta: $3.500 (500ml) / $6.500 (1L) con tapas incluidas\n\nConclusion: estamos en rango medio-bajo del mercado pero entregamos más valor por precio. El diferencial "tapas gratis" justifica el precio sin que se sienta caro.',
    tags: ['precios', 'benchmark', 'cerveza', '2026'],
    url: '',
  },
  {
    tipo: 'analisis',
    titulo: 'Perfil del cliente objetivo — Barrio Italia 2026',
    descripcion: 'Basado en observación de campo en Barrio Italia (mayo 2026):\n• Edad: 28–45 años predominante\n• Profesionales, creativos, independientes\n• Salen en grupos de 3–6 personas\n• Ticket promedio por persona en bar: $8.000–$15.000\n• Buscan: autenticidad, no glamour. Ambiente vivo, no silencio de restaurante\n• Irritante #1: pagar caro por algo que parece industrial\n• Valoran mucho: recomendaciones del local, "lo que recomienda la casa"',
    tags: ['cliente', 'perfil', 'barrio-italia', 'segmento'],
    url: '',
  },
  {
    tipo: 'analisis',
    titulo: 'Horarios peak en Barrio Italia — oportunidad detectada',
    descripcion: 'Observación directa (viernes y sábado, 19:00–23:00):\n• 18:30–20:00: after office — el segmento más desatendido. La gente quiere sentarse ANTES de cenar.\n• 20:00–22:30: peak cenas\n• 22:30+: el bar se convierte en cantina, piden más bebida que comida\n\nOportunidad clave: el horario 18:00–20:00 es perfecto para el modelo tapas+jarra. La gente quiere picar algo rico mientras toma. Nadie lo hace bien en el barrio a ese precio.',
    tags: ['horarios', 'peak', 'after-office', 'oportunidad'],
    url: '',
  },
  {
    tipo: 'analisis',
    titulo: 'Análisis de costos — modelo tapas incluidas con jarra',
    descripcion: 'Estimación propia para validar viabilidad del modelo:\n\nCosto producción tapa promedio: $400–$700 (croqueta, pan con tomate, patatas)\nPrecio jarra 500ml (costo líquido): ~$900–$1.200\nPrecio jarra 1L (costo líquido): ~$1.600–$2.000\n\nJarra 500ml @ $3.500: margen bruto ~$1.800–$2.200 (incluye 2 tapas @$600)\nJarra 1L @ $6.500: margen bruto ~$3.300–$3.900 (incluye 3 tapas @$600)\n\nMétrica clave: el costo de la tapa "gratis" es una inversión en retención. La gente toma más cuando come. Rotación de mesa: 2–3 jarras por visita.',
    tags: ['costos', 'margen', 'viabilidad', 'modelo-negocio'],
    url: '',
  },
  {
    tipo: 'analisis',
    titulo: 'Barrio Italia — análisis de flujo y locales disponibles',
    descripcion: 'El barrio tiene alta demanda gastronómica los jueves, viernes y sábado. Ejes principales: Av. Italia, Condell, Girardi. Flujo peatonal alto en horario 19:00–22:00.\n\nLocales disponibles (mayo 2026): 3–4 locales con potencial identificados. Arriendos estimados: $800.000–$1.800.000/mes según metraje y ubicación.\n\nRequisitos mínimos para tapería: cocina habilitada con extractor, mínimo 40 m2 de salón, acceso a terraza o patio (muy valorado). Evitar: esquinas con alto tráfico vehicular (ruido incompatible con la experiencia).',
    tags: ['barrio-italia', 'local', 'arriendo', 'flujo'],
    url: '',
  },
  {
    tipo: 'analisis',
    titulo: 'Inversión inicial estimada — tapería 40–60 personas',
    descripcion: 'Estimación preliminar para discusión entre socios:\n\n• Garantía + primer arriendo: $3.000.000–$5.400.000\n• Remodelación básica (sin obras mayores): $4.000.000–$8.000.000\n• Equipamiento cocina (segunda mano): $2.000.000–$4.000.000\n• Mobiliario y decoración: $2.000.000–$5.000.000\n• Capital de trabajo 3 meses: $3.000.000–$5.000.000\n• Licencias, patente, gastos legales: $1.000.000–$2.000.000\n\nTotal estimado: $15.000.000–$29.400.000\n\nPunto de equilibrio estimado: 60–80 cubiertos/día promedio.',
    tags: ['inversión', 'financiero', 'capital', 'estimación'],
    url: '',
  },

  // ══════════════════════════════════════════════════════════
  // TENDENCIAS
  // ══════════════════════════════════════════════════════════
  {
    tipo: 'tendencia',
    titulo: 'Tendencia global: "small plates sharing" reemplaza el menú formal',
    descripcion: 'El modelo de platos pequeños para compartir ha desplazado al menú de entrada+fondo en el segmento casual premium en todo el mundo. En Santiago ya se ve en Bocanáriz, Osaka, y nuevos aperturas. El consumidor moderno prefiere probar 4–6 cosas pequeñas que comer 1 plato grande. Esto nos favorece directamente: el modelo tapas no es una novedad, es hacia donde va la gastronomía casual.',
    tags: ['global', 'tendencia', 'small-plates', 'consumidor'],
    url: '',
  },
  {
    tipo: 'tendencia',
    titulo: 'Tendencia Chile: fusión con ingredientes locales como diferenciador',
    descripcion: 'Los restaurantes exitosos de los últimos 3 años en Chile tienen en común: uso de ingredientes locales con técnicas foráneas. Ejemplos: Boragó (nórdico-chileno), Osaka (japonés-peruano), 99 Restaurante. El concepto de "tapa española con alma chilena" (merkén, pulpo con pebre, croqueta de mechada) está perfectamente alineado con esta tendencia. Es diferenciador Y auténtico.',
    tags: ['fusión', 'local', 'tendencia-chile', 'ingredientes'],
    url: '',
  },
  {
    tipo: 'tendencia',
    titulo: 'Vermú y aperitivos — el mercado más en crecimiento en Chile 2024–2026',
    descripcion: 'El consumo de vermú en Chile creció ~35% entre 2022–2024 (datos Asociación de Exportadores de Bebidas España). Marcas como Lustau, Yzaguirre y Reus están activamente expandiendo en el mercado chileno. El "momento vermú" (aperitivo de mediodía o pre-cena) es una práctica nueva en Chile que está prendiendo en segmento urbano 25–40 años. Oportunidad: ser los referentes del vermú en Barrio Italia antes que llegue la competencia.',
    tags: ['vermú', 'aperitivo', 'crecimiento', 'oportunidad'],
    url: '',
  },
  {
    tipo: 'tendencia',
    titulo: 'Cerveza artesanal en bares — el cliente chileno ya educado',
    descripcion: 'Chile tiene más de 200 cervecerías artesanales activas (2024). El consumidor urbano chileno ya distingue entre lager industrial y artesanal. En bares de Barrio Italia, la cerveza artesanal representa 40–60% del consumo de cerveza según observación directa. Proveedores locales relevantes: Bundor, Austral Küche, Kross, Szot, CCU Artesanal. Estrategia: negociar con 2–3 cervecerías locales para jarra de barril exclusiva.',
    tags: ['cerveza-artesanal', 'barril', 'proveedores', 'tendencia'],
    url: '',
  },
  {
    tipo: 'tendencia',
    titulo: 'After office — el horario más desatendido en gastronomía chilena',
    descripcion: 'El bloque 18:00–20:00 entre semana está estructuralmente desatendido en Santiago. Los restaurantes aún no abren o están en setup; los bares son muy informales. El modelo tapería cubre perfectamente este horario: llegás, pedís una jarra, te traen las tapas, picás algo rico antes de cenar. En España este momento se llama "la caña de las 7" y es el más rentable del día por volumen y velocidad de servicio.',
    tags: ['after-office', 'horario', 'oportunidad', 'modelo'],
    url: '',
  },

  // ══════════════════════════════════════════════════════════
  // REFERENCIAS E INSPIRACIÓN
  // ══════════════════════════════════════════════════════════
  {
    tipo: 'inspiracion',
    titulo: 'Bar Calders — Barcelona (referente mundial)',
    descripcion: 'El bar de tapas más influyente de Barcelona según guías especializadas. Concepto: vermú de mediodía, tapas de mercado, ambiente de barrio del Poble Sec. Lo que hacen perfecto:\n• Carta corta (8–10 tapas) que rota según temporada\n• Sin reservas al mediodía — la gente espera de pie y eso crea ambiente\n• Precio tapa: €2.50–€5.00 (muy accesible)\n• Vermú Yzaguirre como bebida de autor\n• Identidad visual fuerte: carteles manuscritos\n\nLección: la simplicidad y la autenticidad son el lujo.',
    tags: ['barcelona', 'referente', 'modelo', 'vermú', 'carta-corta'],
    url: 'https://barcalders.com',
  },
  {
    tipo: 'inspiracion',
    titulo: 'El Xampanyet — Barcelona (La Ribera)',
    descripcion: 'Taberna del año 1929, sigue igual. Cava de la casa, anchoas y tapas sencillas. Lo que nos inspira: tienen 2–3 tapas icónicas que llevan décadas en la carta y son su razón de existir. No necesitan innovar constantemente. La gente va por LO MISMO de siempre.\n\nLección para Boca Chueca: identificar 3–4 tapas que serán "las del Boca" y nunca sacarlas de la carta. Eso construye identidad y fidelización.',
    tags: ['barcelona', 'identidad', 'tapas-icónicas', 'tradición'],
    url: '',
  },
  {
    tipo: 'inspiracion',
    titulo: 'Bodegas El Capricho — León, España (referente de producto)',
    descripcion: 'Bar especializado en productos de calidad extrema. Su lección no es el modelo de negocio sino la filosofía: menos items, mejor ejecutados, origen trazable. Tienen solo 6 tapas pero cada una es perfecta.\n\nPara Boca Chueca: la croqueta de mechada tiene que ser la mejor croqueta de Santiago. No la más elegante, la más rica. Esa es la promesa que construye el boca a boca.',
    tags: ['producto', 'calidad', 'filosofía', 'especialización'],
    url: '',
  },
  {
    tipo: 'inspiracion',
    titulo: 'Mercado de San Miguel — Madrid (modelo de espacio)',
    descripcion: 'Mercado gastronómico que renovó el concepto de tapas en Madrid. Modelo: múltiples puestos especializados en un mismo espacio. No es nuestro modelo de negocio pero tiene algo valioso: la idea de que cada puesto tiene UNA especialidad y la hace perfecta.\n\nAplicación práctica: en la cocina del Boca, cada persona tiene su especialidad. El que fríe las croquetas, las fríe siempre él. Estandarización con alma artesanal.',
    tags: ['madrid', 'especialización', 'estandarización', 'modelo'],
    url: '',
  },
  {
    tipo: 'inspiracion',
    titulo: 'Barrafina — Londres (tapas fuera de España)',
    descripcion: 'El mejor ejemplo de tapería española exitosa fuera de España. Tienen lista de espera de horas. Sin reservas, barra larga, cocina abierta.\n\nLo que hacen bien que podemos replicar:\n• Sin reservas en barra (rotación rápida, ambiente dinámico)\n• Cocina 100% visible — genera confianza y atractivo\n• Carta en pizarrón que cambia según disponibilidad\n\nLección clave: la cocina visible es marketing gratuito. Ver cocinar genera hambre y confianza.',
    tags: ['londres', 'cocina-visible', 'sin-reservas', 'barra'],
    url: '',
  },
  {
    tipo: 'inspiracion',
    titulo: 'La Mar — Lima (fusión local exitosa, modelo Gastón Acurio)',
    descripcion: 'No es tapería pero es el caso de estudio más relevante de fusión de cocina española con ingredientes locales latinoamericanos ejecutada con éxito masivo. Gastón Acurio tomó la ceviche (producto local) y la elevó con técnica y presentación de alta cocina.\n\nParalelo directo: nosotros tomamos la tapa española (formato) y la rellenamos con ingredientes chilenos (mechada, merkén, papas chilotas, pebre). Es el mismo principio. La tapa es el vehículo, Chile es el contenido.',
    tags: ['lima', 'fusión', 'modelo', 'inspiración-estratégica'],
    url: '',
  },
]

export const useMarketStore = create<MarketStore>()(
  persist(
    (set) => ({
      cards: CARDS.map(c => ({ ...c, id: nanoid(), created_at: hoy })),

      add: (p) => set(s => ({
        cards: [{ ...p, id: nanoid(), created_at: new Date().toISOString() }, ...s.cards]
      })),

      remove: (id) => set(s => ({ cards: s.cards.filter(c => c.id !== id) })),

      update: (id, patch) => set(s => ({
        cards: s.cards.map(c => c.id === id ? { ...c, ...patch } : c)
      })),
    }),
    { name: 'socio-market', version: 2 }
  )
)
