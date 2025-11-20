import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe().finally(() => setLoading(false))
  }, [])

  const login = async (email, password, isAdmin = false) => {
    const endpoint = isAdmin ? '/auth/admin/login' : '/auth/login'
    await api.post(endpoint, { email, password })
    await getMe()
  }

  const register = async (name, email, password) => {
    await api.post('/auth/register', { name, email, password })
    await getMe()
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
  }

  const getMe = async () => {
    try {
      const res = await api.get('/auth/me')
      setUser(res.data.user)
    } catch {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
