import { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { TaskForm } from '../components/TaskForm'
import { TaskItem } from '../components/TaskItem'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { taskService } from '../services/taskservice'


export function Home() {

  const { tareas, loading, error, crearTarea, actualizarTarea, eliminarTarea } = useTasks()
  const { signOut } = useAuthContext()

  const [busqueda, setBusqueda] = useState('')
  const [tareasFiltradas, setTareasFiltradas] = useState<any[]>([])

  const buscarTareas = async (texto: string) => {

    setBusqueda(texto)

    if (!texto) {
      setTareasFiltradas([])
      return
    }

    const { data } = await taskService.search(texto)

    if (data) {
      setTareasFiltradas(data)
    }

  }

  if (loading) return <div>Cargando tareas...</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>

  const lista = busqueda ? tareasFiltradas : tareas

  return (
    <div>

      {/* Navbar */}
      <nav style={{
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
        padding:'1rem 2rem',
        background:'white',
        boxShadow:'0 2px 8px rgba(0,0,0,0.06)'
      }}>

        <span style={{ fontWeight:700, fontSize:'1.1rem' }}>
          📋 Mis Tareas
        </span>

        <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>

          <Link
            to='/dashboard'
            style={{
              color:'#6366f1',
              fontWeight:600,
              textDecoration:'none'
            }}
          >
            📊 Dashboard
          </Link>

          <button
            onClick={signOut}
            style={{
              background:'none',
              border:'1px solid #e2e8f0',
              borderRadius:'8px',
              padding:'0.4rem 0.9rem',
              cursor:'pointer',
              color:'#64748b'
            }}
          >
            Cerrar sesión
          </button>

        </div>

      </nav>

      {/* Contenido */}
      <div style={{ maxWidth:'800px', margin:'2rem auto', padding:'0 1rem' }}>

        <h1>📋 Mis Tareas</h1>

        {/* BUSCADOR */}
        <input
          type="text"
          placeholder="🔎 Buscar tarea..."
          value={busqueda}
          onChange={(e) => buscarTareas(e.target.value)}
          style={{
            width:'100%',
            padding:'0.6rem',
            marginBottom:'1rem',
            border:'1px solid #e2e8f0',
            borderRadius:'6px'
          }}
        />

        <TaskForm
          onCrear={async (titulo, descripcion) => {
            await crearTarea({ titulo, descripcion })
          }}
        />

        {lista.length === 0
          ? <p style={{ color:'#94a3b8' }}>No tienes tareas aún. ¡Crea una!</p>
          : lista.map(t => (
              <TaskItem
                key={t.id}
                tarea={t}
                onActualizar={async (id, completada) => {
                  await actualizarTarea(id, { completada })
                }}
                onEliminar={eliminarTarea}
              />
            ))
        }

        <p style={{ color:'#94a3b8', fontSize:'0.9rem' }}>
          {tareas.filter(t => t.completada).length} / {tareas.length} completadas
        </p>

      </div>

    </div>
  )
}