import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import RecipeDetail from './components/RecipeDetail'

function App() {
  const { user, logout } = useAuth()

  return (
    <div>
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            🍳 Recipe Share
          </Link>
        </div>
        <div className="nav-links">
          {user ? (
            <>
              <span className="welcome-text">Welcome, {user.name}!</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link">
                  👑 Admin Panel
                </Link>
              )}
              <Link to="/dashboard" className="nav-link">
                📚 My Recipes
              </Link>
              <button onClick={logout} className="btn btn-secondary nav-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
          <div className="home-page">
            {/* Hero Section */}
            <div className="hero-section">
              <div className="hero-background">
                <div className="floating-elements">
                  <div className="floating-icon" style={{ top: '10%', left: '10%', animationDelay: '0s' }}>🍕</div>
                  <div className="floating-icon" style={{ top: '20%', right: '15%', animationDelay: '1s' }}>🍰</div>
                  <div className="floating-icon" style={{ bottom: '30%', left: '8%', animationDelay: '2s' }}>🥗</div>
                  <div className="floating-icon" style={{ bottom: '15%', right: '12%', animationDelay: '1.5s' }}>🍜</div>
                  <div className="floating-icon" style={{ top: '40%', left: '5%', animationDelay: '0.5s' }}>🧁</div>
                  <div className="floating-icon" style={{ top: '60%', right: '8%', animationDelay: '2.5s' }}>🍔</div>
                </div>
              </div>
              
              <div className="hero-content">
                <div className="hero-badge">
                  <span className="badge-icon">✨</span>
                  Welcome to Recipe Share
                </div>
                
                <h1 className="hero-title">
                  <span className="title-main">Cook, Share & </span>
                  <span className="title-accent">Inspire</span>
                  <div className="title-emoji">🍳</div>
                </h1>
                
                <p className="hero-description">
                  Join thousands of food lovers sharing their favorite recipes. 
                  Upload stunning photos, create video tutorials, and discover 
                  amazing dishes from around the world.
                </p>
                
                <div className="hero-stats">
                  <div className="stat-item">
                    <div className="stat-number">10K+</div>
                    <div className="stat-label">Recipes</div>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <div className="stat-number">5K+</div>
                    <div className="stat-label">Chefs</div>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <div className="stat-number">50K+</div>
                    <div className="stat-label">Photos</div>
                  </div>
                </div>
                
                {!user ? (
                  <div className="hero-actions">
                    <Link to="/signup" className="btn-hero primary">
                      <span>Start Cooking</span>
                      <span className="btn-icon">🚀</span>
                    </Link>
                    <Link to="/login" className="btn-hero secondary">
                      <span>Sign In</span>
                      <span className="btn-icon">👋</span>
                    </Link>
                  </div>
                ) : (
                  <div className="hero-actions">
                    <Link to="/dashboard" className="btn-hero primary">
                      <span>My Recipe Collection</span>
                      <span className="btn-icon">📚</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Features Section */}
            <div className="features-section">
              <div className="container">
                <div className="section-header">
                  <h2 className="section-title">Why Choose Recipe Share?</h2>
                  <p className="section-subtitle">Everything you need to share your culinary passion</p>
                </div>
                
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <div className="feature-icon">📸</div>
                      <div className="feature-glow"></div>
                    </div>
                    <h3 className="feature-title">Beautiful Photos</h3>
                    <p className="feature-description">
                      Showcase your culinary masterpieces with high-quality photos that make every dish irresistible.
                    </p>
                    <div className="feature-tags">
                      <span className="tag">HD Quality</span>
                      <span className="tag">Easy Upload</span>
                    </div>
                  </div>
                  
                  <div className="feature-card featured">
                    <div className="feature-badge">Most Popular</div>
                    <div className="feature-icon-wrapper">
                      <div className="feature-icon">🎥</div>
                      <div className="feature-glow"></div>
                    </div>
                    <h3 className="feature-title">Video Tutorials</h3>
                    <p className="feature-description">
                      Create step-by-step cooking videos that help others master your recipes with confidence.
                    </p>
                    <div className="feature-tags">
                      <span className="tag">Step-by-Step</span>
                      <span className="tag">HD Video</span>
                    </div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-badge">New</div>
                    <div className="feature-icon-wrapper">
                      <div className="feature-icon">📚</div>
                      <div className="feature-glow"></div>
                    </div>
                    <h3 className="feature-title">Recipe Collections</h3>
                    <p className="feature-description">
                      Explore curated recipe collections for every occasion — from quick weeknight dinners to festive feasts.
                    </p>
                    <div className="feature-tags">
                      <span className="tag">Curated</span>
                      <span className="tag">Themed</span>
                    </div>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <div className="feature-icon">👥</div>
                      <div className="feature-glow"></div>
                    </div>
                    <h3 className="feature-title">Amazing Community</h3>
                    <p className="feature-description">
                      Connect with passionate food lovers, share tips, and discover incredible recipes from around the globe.
                    </p>
                    <div className="feature-tags">
                      <span className="tag">Global</span>
                      <span className="tag">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="cta-section">
              <div className="container">
                <div className="cta-content">
                  <div className="cta-icon">🌟</div>
                  <h2 className="cta-title">Ready to Start Your Culinary Journey?</h2>
                  <p className="cta-description">
                    Join our community today and start sharing your amazing recipes with the world!
                  </p>
                  {!user && (
                    <Link to="/signup" className="cta-button">
                      <span>Join Recipe Share</span>
                      <span className="cta-arrow">→</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
      </Routes>
    </div>
  )
}

export default App
