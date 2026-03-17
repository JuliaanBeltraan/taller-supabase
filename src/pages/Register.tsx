
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function Register() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) setError(error.message)
    else setSuccess(true)

    setLoading(false)
  }

  if (success) return (
    <div style={styles.container}>
      <div style={styles.card}>
        <p style={{ color: '#10b981', textAlign: 'center' }}>
          ✅ Revisa tu correo para confirmar tu cuenta.
        </p>
      </div>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Crear cuenta</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <p style={styles.link}>
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#f8fafc'
  },
  card: {
    background: 'white', borderRadius: '12px',
    padding: '2rem', width: '100%', maxWidth: '380px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    display: 'flex', flexDirection: 'column', gap: '1rem'
  },
  title: { margin: 0, fontSize: '1.4rem', textAlign: 'center', color: '#1e293b' },
  input: {
    padding: '0.75rem 1rem', borderRadius: '8px',
    border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none'
  },
  button: {
    padding: '0.75rem', borderRadius: '8px', border: 'none',
    background: '#6366f1', color: 'white', fontSize: '1rem',
    cursor: 'pointer', fontWeight: 600
  },
  error: { color: '#ef4444', fontSize: '0.85rem', margin: 0, textAlign: 'center' },
  link:  { fontSize: '0.85rem', textAlign: 'center', color: '#64748b', margin: 0 }
}