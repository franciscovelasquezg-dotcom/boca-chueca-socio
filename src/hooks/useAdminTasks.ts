import { useState, useEffect } from 'react'

// Mismo key que usa el taskStore del Hub Admin (Zustand persist)
const ADMIN_TASKS_KEY = 'boca-tasks'

export interface AdminTask {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'done'
  type: string
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  created_at: string
  updated_at: string
}

function readTasks(): AdminTask[] {
  try {
    const raw = localStorage.getItem(ADMIN_TASKS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return parsed?.state?.tasks ?? []
  } catch {
    return []
  }
}

export function useAdminTasks() {
  const [tasks, setTasks] = useState<AdminTask[]>(readTasks)

  useEffect(() => {
    // Actualizar si cambia el localStorage (mismo tab o desde admin en mismo origen)
    const handler = (e: StorageEvent) => {
      if (e.key === ADMIN_TASKS_KEY) setTasks(readTasks())
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const active  = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress')
  const pending = tasks.filter(t => t.status === 'pending')
  const inProgress = tasks.filter(t => t.status === 'in_progress')
  const done    = tasks.filter(t => t.status === 'done')

  return { tasks, active, pending, inProgress, done }
}
