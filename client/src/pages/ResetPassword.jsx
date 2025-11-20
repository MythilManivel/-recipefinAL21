import { useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

const ResetPassword = () => {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await api.post('/auth/reset-password', { token, password })
    setMessage(res.data.message)
  }

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Reset</button>
      </form>
      <p>{message}</p>
    </div>
  )
}

export default ResetPassword
