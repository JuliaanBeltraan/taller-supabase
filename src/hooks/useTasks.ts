import { useState, useEffect, useCallback } from 'react' 
import { taskService } from '../services/taskservice'
import type { Tarea, TareaInsert, TareaUpdate } from '../types/database'

export function useTasks() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTareas = useCallback(async () => {
    setLoading(true); setError(null)
    const { data, error } = await taskService.getAll()
    if (error) setError(error.message)
    else setTareas(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchTareas() }, [fetchTareas])

 const crearTarea = async (nueva: TareaInsert) => {
  const { data, error } = await taskService.create(nueva)
  if (error) throw new Error(error.message)
  if (!data) throw new Error('No se pudo crear la tarea')
  setTareas(prev => [data, ...prev])
  return data
}

  const actualizarTarea = async (id: string, cambios: TareaUpdate) => {
    const { data, error } = await taskService.update(id, cambios)
    if (error) throw new Error(error.message)
    setTareas(prev => prev.map(t => t.id === id ? data : t))
    return data
  }

  const eliminarTarea = async (id: string) => {
    const { error } = await taskService.delete(id)
    if (error) throw new Error(error.message)
    setTareas(prev => prev.filter(t => t.id !== id))
  }

  return { tareas, loading, error, crearTarea, actualizarTarea, eliminarTarea,
    refetch: fetchTareas }
}