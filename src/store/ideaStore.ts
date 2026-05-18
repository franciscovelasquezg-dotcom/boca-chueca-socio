import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PartnerIdea } from '../types'
import { SHARED_IDEAS_KEY } from '../types'

const nanoid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)

interface IdeaStore {
  ideas: PartnerIdea[]
  submitIdea: (contenido: string, autor: string) => PartnerIdea
  getRecent: (n?: number) => PartnerIdea[]
}

// Escribe también en el store del admin hub para el puente bidireccional
function bridgeToAdminHub(idea: PartnerIdea) {
  try {
    const raw   = localStorage.getItem(SHARED_IDEAS_KEY)
    const state = raw ? JSON.parse(raw) : { state: { ideas: [] } }
    const adminIdea = {
      id:         idea.id,
      text:       `[Socio: ${idea.autor}] ${idea.contenido}`,
      source:     'francisco' as const,  // aparece en la bandeja del admin
      converted:  false,
      created_at: idea.fecha,
    }
    state.state.ideas = [adminIdea, ...(state.state.ideas ?? [])]
    localStorage.setItem(SHARED_IDEAS_KEY, JSON.stringify(state))
  } catch {
    // Si el admin hub no está en el mismo origen, silencioso
  }
}

export const useIdeaStore = create<IdeaStore>()(
  persist(
    (set, get) => ({
      ideas: [],

      submitIdea: (contenido, autor) => {
        const idea: PartnerIdea = {
          id:       nanoid(),
          contenido,
          tipo:     'aporte_socio',
          fecha:    new Date().toISOString(),
          estado:   'pendiente',
          autor,
        }
        set(s => ({ ideas: [idea, ...s.ideas] }))
        bridgeToAdminHub(idea)
        return idea
      },

      getRecent: (n = 5) => get().ideas.slice(0, n),
    }),
    { name: 'socio-ideas' }
  )
)
