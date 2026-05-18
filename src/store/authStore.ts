import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const PARTNER_KEY = import.meta.env.VITE_PARTNER_KEY ?? 'socio2026'

interface AuthStore {
  authenticated: boolean
  nombre: string
  login: (key: string, nombre?: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      authenticated: false,
      nombre: 'Socio',

      login: (key, nombre = 'Socio') => {
        if (key === PARTNER_KEY) {
          set({ authenticated: true, nombre })
          return true
        }
        return false
      },

      logout: () => set({ authenticated: false }),
    }),
    { name: 'socio-auth' }
  )
)
