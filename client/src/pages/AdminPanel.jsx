import { useEffect, useState } from 'react'
import api from '../api'

const AdminPanel = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    recentSignups: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/users')
        const userData = response.data
        setUsers(userData)
        
        // Calculate statistics
        const totalUsers = userData.length
        const activeUsers = userData.filter(u => u.lastLogin).length
        const adminUsers = userData.filter(u => u.role === 'admin').length
        const recentSignups = userData.filter(u => {
          const signupDate = new Date(u.createdAt || u._id.toString().substring(0,8) + '000000000000')
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          return signupDate > weekAgo
        }).length

        setStats({ totalUsers, activeUsers, adminUsers, recentSignups })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching admin data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#dc3545'
      case 'user': return '#28a745'
      default: return '#6c757d'
    }
  }

  const getStatusColor = (lastLogin) => {
    if (!lastLogin) return '#6c757d'
    const loginDate = new Date(lastLogin)
    const daysSinceLogin = (Date.now() - loginDate.getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysSinceLogin <= 1) return '#28a745'
    if (daysSinceLogin <= 7) return '#ffc107'
    return '#dc3545'
  }

  const getStatusText = (lastLogin) => {
    if (!lastLogin) return 'Never logged in'
    const loginDate = new Date(lastLogin)
    const daysSinceLogin = Math.floor((Date.now() - loginDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceLogin === 0) return 'Active today'
    if (daysSinceLogin === 1) return 'Active yesterday'
    if (daysSinceLogin <= 7) return `Active ${daysSinceLogin} days ago`
    return `Inactive (${daysSinceLogin} days)`
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-state">
          <div className="loading-spinner-large"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      {/* Header Section */}
      <div className="admin-header">
        <div className="admin-title-section">
          <h1 className="admin-title">
            <span className="admin-icon">👑</span>
            Admin Dashboard
          </h1>
          <p className="admin-subtitle">Manage users and monitor platform activity</p>
        </div>
        <div className="admin-actions">
          <button className="btn-admin-action">
            <span className="btn-icon">📊</span>
            Export Data
          </button>
          <button className="btn-admin-action primary">
            <span className="btn-icon">➕</span>
            Add User
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalUsers}</h3>
            <p className="stat-label">Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <span className="stat-icon">✅</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.activeUsers}</h3>
            <p className="stat-label">Active Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <span className="stat-icon">🛡️</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.adminUsers}</h3>
            <p className="stat-label">Administrators</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper orange">
            <span className="stat-icon">🆕</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.recentSignups}</h3>
            <p className="stat-label">Recent Signups</p>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="users-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">👤</span>
            User Management
          </h2>
          <div className="section-actions">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search users..." 
                className="search-input"
              />
            </div>
            <select className="filter-select">
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="user">Users</option>
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div className="users-grid">
          {users.map(user => (
            <div key={user._id} className="user-card">
              <div className="user-header">
                <div className="user-avatar">
                  <span className="avatar-text">
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
                <div className="user-info">
                  <h3 className="user-name">{user.name || 'Unknown User'}</h3>
                  <p className="user-email">{user.email}</p>
                </div>
                <div className="user-role">
                  <span 
                    className="role-badge" 
                    style={{ backgroundColor: getRoleColor(user.role) }}
                  >
                    {user.role === 'admin' ? '👑' : '👤'} {user.role}
                  </span>
                </div>
              </div>

              <div className="user-details">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <div className="detail-content">
                    <span className="detail-label">Last Login</span>
                    <span className="detail-value">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">🔄</span>
                  <div className="detail-content">
                    <span className="detail-label">Status</span>
                    <span 
                      className="status-badge"
                      style={{ color: getStatusColor(user.lastLogin) }}
                    >
                      {getStatusText(user.lastLogin)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="user-actions">
                <button className="btn-user-action">
                  <span className="btn-icon">✏️</span>
                  Edit
                </button>
                <button className="btn-user-action">
                  <span className="btn-icon">📧</span>
                  Message
                </button>
                <button className="btn-user-action danger">
                  <span className="btn-icon">🗑️</span>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No users found</h3>
            <p>There are no users in the system yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
