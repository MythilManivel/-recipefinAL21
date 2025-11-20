import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import { 
  buildMediaUrl, 
  getRecipeImagePath, 
  getRecipeVideoPath 
} from '../utils/media.js'

const RecipeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userRating, setUserRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)

  useEffect(() => {
    fetchRecipe()
  }, [id])

  const fetchRecipe = async () => {
    try {
      const response = await api.get(`/recipes/${id}`)
      setRecipe(response.data)
      
      // Check if user already rated
      if (user && response.data.ratings) {
        const existingRating = response.data.ratings.find(r => r.user === user.id)
        if (existingRating) {
          setUserRating(existingRating.rating)
        }
      }
    } catch (err) {
      setError('Failed to load recipe')
      console.error('Error fetching recipe:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRating = async (rating) => {
    if (!user) {
      alert('Please login to rate recipes')
      return
    }
    
    try {
      const response = await api.post(`/recipes/${id}/rate`, { rating })
      setRecipe(response.data)
      setUserRating(rating)
    } catch (err) {
      console.error('Error rating recipe:', err)
      alert('Failed to submit rating')
    }
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner-large"></div>
        <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>Loading recipe...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container">
        <div className="error-message" style={{ margin: '2rem auto', maxWidth: '500px' }}>
          <span className="message-icon">⚠️</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="container">
        <div className="empty-state-modern">
          <div style={{ fontSize: '5rem' }}>🍽️</div>
          <h3>Recipe not found</h3>
          <p>The recipe you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/dashboard')} className="btn" style={{ marginTop: '1rem' }}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const rawImage = getRecipeImagePath(recipe);
  const rawVideo = getRecipeVideoPath(recipe);
  const imageSrc = buildMediaUrl(rawImage);
  const videoSrc = buildMediaUrl(rawVideo);

  return (
    <div className="container fade-in">
      {/* Action Bar */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-secondary"
        >
          ← Back
        </button>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={handleShare}
            className="btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            🔗 Share
          </button>
          <button 
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            🖨️ Print
          </button>
        </div>
      </div>
      
      <div className="card">
        <h1 style={{ color: '#667eea', marginBottom: '1rem', fontSize: '2.5rem' }}>
          🍳 {recipe.title}
        </h1>

        {/* Author Info */}
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          border: '1px solid #bae6fd'
        }}>
          <p style={{ 
            fontSize: '1rem',
            color: '#0369a1',
            margin: 0,
            fontWeight: '600'
          }}>
            👨‍🍳 Created by: <strong>{recipe.author?.email || 'Unknown'}</strong>
          </p>
        </div>

        {/* Rating Section */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '1px solid #fbbf24'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: '#92400e', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
              ⭐ Rating: {recipe.averageRating || 0} / 5
            </h3>
            <p style={{ color: '#78350f', margin: 0, fontSize: '0.9rem' }}>
              {recipe.totalRatings || 0} {recipe.totalRatings === 1 ? 'rating' : 'ratings'}
            </p>
          </div>
          
          {user && (
            <div>
              <p style={{ color: '#92400e', marginBottom: '0.5rem', fontWeight: '600' }}>
                {userRating ? 'Your rating:' : 'Rate this recipe:'}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '2rem',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      transform: hoveredStar >= star || userRating >= star ? 'scale(1.2)' : 'scale(1)'
                    }}
                  >
                    {hoveredStar >= star || userRating >= star ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {recipe.description && (
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem', fontStyle: 'italic' }}>
            {recipe.description}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {rawImage && (
            <div>
              <h3 style={{ color: '#3b82f6', marginBottom: '1rem' }}>📸 Recipe Image</h3>
              <img 
                src={imageSrc}
                alt={recipe.title}
                style={{ 
                  width: '100%', 
                  maxWidth: '400px', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  objectFit: 'cover',
                  height: '300px'
                }}
                onError={(e) => {
                  console.error('Image failed to load:', recipe.imageUrl);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {rawVideo && (
            <div>
              <h3 style={{ color: '#3b82f6', marginBottom: '1rem' }}>🎥 Recipe Video</h3>
              <video 
                width="100%" 
                style={{ 
                  maxWidth: '400px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  height: '300px'
                }}
                controls 
              >
                <source src={videoSrc} type="video/mp4" />
                <source src={videoSrc} type="video/webm" />
                <source src={videoSrc} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          <div className="card" style={{ background: 'rgba(102, 126, 234, 0.05)' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              🥘 Ingredients
            </h3>
            <ul style={{ lineHeight: '2', paddingLeft: '1.5rem' }}>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ background: 'rgba(118, 75, 162, 0.05)' }}>
            <h3 style={{ color: '#764ba2', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              👩‍🍳 Instructions
            </h3>
            <ol style={{ lineHeight: '2', paddingLeft: '1.5rem' }}>
              {recipe.steps.map((step, index) => (
                <li key={index} style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.createdAt && (
          <div style={{ 
            marginTop: '3rem', 
            padding: '1rem', 
            background: 'rgba(0, 0, 0, 0.05)', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
              📅 Created on {new Date(recipe.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeDetail
