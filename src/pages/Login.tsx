// src/pages/Login.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

export function Login() {

  const { signIn } = useAuthContext()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMensaje('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  const handleRecuperarPassword = async () => {

    if (!email) {
      setError("Escribe tu correo primero")
      return
    }

    try {

      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) throw error

      setMensaje("Revisa tu correo para recuperar tu contraseña")

    } catch (err: any) {

      setError(err.message)

    }
  }

  return (

    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}>

      <h1>Iniciar Sesión</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

      </form>

      <button
        type="button"
        onClick={handleRecuperarPassword}
        style={{ marginTop: '10px' }}
      >
        Recuperar contraseña
      </button>

      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>

    </div>
  )
}