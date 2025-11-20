import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await login(email, password, isAdmin)
      navigate(isAdmin ? '/admin' : '/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <h2 style={{ marginBottom: '2rem', color: '#667eea', fontSize: '2rem' }}>
          🍳 Welcome Back
        </h2>
        {error && <p className="text-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              Login as admin
            </label>
          </div>
          <button type="submit" disabled={loading} className="btn" style={{ width: '100%' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <p style={{ margin: '1rem 0', color: '#666' }}>Or continue with</p>
          <a href={`${apiBaseUrl}/api/auth/google`} className="btn btn-secondary" style={{ width: '100%', textDecoration: 'none' }}>
            🔗 Google
          </a>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/forgot-password" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem' }}>
            Forgot your password?
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#666' }}>
            Don't have an account? <Link to="/signup" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login