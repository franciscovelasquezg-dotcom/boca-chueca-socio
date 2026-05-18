import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PartnerIdea, IdeaSource } from '../types'
import { SHARED_IDEAS_KEY } from '../types'

const nanoid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)

interface IdeaStore {
  ideas: PartnerIdea[]
  submitIdea: (contenido: string, autor: string, source?: IdeaSource) => PartnerIdea
  removeIdea: (id: string) => void
  getRecent: (n?: number) => PartnerIdea[]
}

function bridgeToAdminHub(idea: PartnerIdea) {
  try {
    const raw   = localStorage.getItem(SHARED_IDEAS_KEY)
    const state = raw ? JSON.parse(raw) : { state: { ideas: [] } }
    const adminIdea = {
      id:         idea.id,
      text:       `[${idea.source.toUpperCase()} · ${idea.autor}] ${idea.contenido}`,
      source:     idea.source,
      converted:  false,
      created_at: idea.fecha,
    }
    state.state.ideas = [adminIdea, ...(state.state.ideas ?? [])]
    localStorage.setItem(SHARED_IDEAS_KEY, JSON.stringify(state))
  } catch { /* origen diferente en producción */ }
}

export const useIdeaStore = create<IdeaStore>()(
  persist(
    (set, get) => ({
      ideas: [],

      submitIdea: (contenido, autor, source = 'francisco') => {
        const idea: PartnerIdea = {
          id:       nanoid(),
          contenido,
          tipo:     'aporte_socio',
          fecha:    new Date().toISOString(),
          estado:   'pendiente',
          autor,
          source,
        }
        set(s => ({ ideas: [idea, ...s.ideas] }))
        bridgeToAdminHub(idea)
        return idea
      },

      removeIdea: (id) => set(s => ({ ideas: s.ideas.filter(i => i.id !== id) })),

      getRecent: (n = 5) => get().ideas.slice(0, n),
    }),
    { name: 'socio-ideas' }
  )
)
