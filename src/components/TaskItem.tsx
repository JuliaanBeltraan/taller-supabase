import { useState } from 'react'
import type { Tarea } from '../types/database'

interface Props {
  tarea: Tarea
  onActualizar: (id: string, completada: boolean) => Promise<void>
  onEliminar: (id: string) => Promise<void>
}

export function TaskItem({ tarea, onActualizar, onEliminar }: Props) {

  const [eliminando, setEliminando] = useState(false)

  const handleEliminar = async () => {
    if (!confirm('¿Eliminar esta tarea?')) return
    setEliminando(true)
    await onEliminar(tarea.id)
  }

  const handleEditar = async () => {

    const nuevoTitulo = prompt("Nuevo título", tarea.titulo)
    if (!nuevoTitulo) return

    const nuevaDescripcion = prompt("Nueva descripción", tarea.descripcion || "")

    await fetch(`/api/tareas/${tarea.id}`, {
      method: "PUT",
      body: JSON.stringify({
        titulo: nuevoTitulo,
        descripcion: nuevaDescripcion
      })
    })

    window.location.reload()
  }

  return (

    <div style={{
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      padding: '1rem',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      marginBottom: '0.5rem',
      opacity: eliminando ? 0.5 : 1
    }}>

      <input
        type='checkbox'
        checked={tarea.completada ?? false}
        onChange={() =>
          onActualizar(tarea.id, !(tarea.completada ?? false))
        }
      />

      <div style={{ flex: 1 }}>

        <strong style={{
          textDecoration: tarea.completada ? 'line-through' : 'none',
          color: tarea.completada ? '#94a3b8' : '#1a1a1a'
        }}>
          {tarea.titulo}
        </strong>

        {tarea.descripcion && (
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            {tarea.descripcion}
          </p>
        )}

      </div>

      <button onClick={handleEditar}>
      
      
      
      Editar
      </button>

      <button
        onClick={handleEliminar}
        disabled={eliminando}
        style={{
          color: 'red',
          cursor: 'pointer',
          background: 'none',
          border: 'none'
        }}
      >
        🗑 Eliminar
      </button>

    </div>
  )
}