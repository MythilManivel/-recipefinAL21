import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api";
import { 
  buildMediaUrl, 
  getRecipeImagePath, 
  getRecipeVideoPath,
  hasRecipeImage,
  hasRecipeVideo
} from '../utils/media.js';

const RecipeList = ({ recipes, refresh, onEdit }) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  
  const handleDelete = async (id) => {
    if (!confirm("Delete this recipe?")) return;
    await api.delete(`/recipes/${id}`);
    refresh();
  };

  // Filter recipes based on search and filters
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const recipeHasVideo = hasRecipeVideo(recipe);
    const recipeHasImage = hasRecipeImage(recipe);
    
    if (filterType === 'all') return matchesSearch
    if (filterType === 'video') return matchesSearch && recipeHasVideo
    if (filterType === 'image') return matchesSearch && recipeHasImage
    return matchesSearch
  })

  return (
    <div className="fade-in">
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2rem',
        background: 'white',
        padding: '1.5rem',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h3 style={{ 
            color: '#667eea', 
            margin: '0 0 0.5rem 0', 
            fontSize: '1.8rem',
            fontWeight: '700'
          }}>
            📚 Your Recipes
          </h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '2px solid #e2e8f0',
              fontSize: '0.95rem',
              minWidth: '250px',
              transition: 'all 0.3s ease'
            }}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '2px solid #e2e8f0',
              fontSize: '0.95rem',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Recipes</option>
            <option value="video">With Video 🎥</option>
            <option value="image">With Image 📸</option>
          </select>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="recipe-grid">
        {filteredRecipes.map((r) => {
          const rawImage = getRecipeImagePath(r);
          const rawVideo = getRecipeVideoPath(r);
          const imageSrc = buildMediaUrl(rawImage);

          return (
          <div key={r._id} className="modern-recipe-card">
            {/* Recipe Image/Video Banner */}
            <div 
              className="recipe-card-banner"
              onClick={() => navigate(`/recipe/${r._id}`)}
              style={{
                position: 'relative',
                width: '100%',
                height: '200px',
                borderRadius: '12px 12px 0 0',
                overflow: 'hidden',
                cursor: 'pointer',
                background: rawImage ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {rawImage ? (
                <img 
                  src={imageSrc}
                  alt={r.title} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                />
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  fontSize: '4rem'
                }}>🍳</div>
              )}
              
              {/* Media Badges */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                display: 'flex',
                gap: '0.5rem'
              }}>
                {rawVideo && (
                  <span style={{
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>🎥 Video</span>
                )}
              </div>
            </div>

            {/* Recipe Content */}
            <div style={{ padding: '1.5rem' }}>
              <h4 
                onClick={() => navigate(`/recipe/${r._id}`)}
                style={{ 
                  cursor: 'pointer', 
                  color: '#0f172a',
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  margin: '0 0 0.75rem 0',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.color = '#667eea'}
                onMouseOut={(e) => e.target.style.color = '#0f172a'}
              >
                {r.title}
              </h4>
              
              <p style={{ 
                color: '#64748b', 
                marginBottom: '1rem',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {r.description || 'No description available'}
              </p>

              {/* Ingredients Preview */}
              <div style={{
                background: '#f8fafc',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: '#475569',
                  margin: 0
                }}>
                  <strong style={{ color: '#667eea' }}>🥘 Ingredients:</strong> {r.ingredients.slice(0, 3).join(", ")}
                  {r.ingredients.length > 3 && ` +${r.ingredients.length - 3} more`}
                </p>
              </div>

              {/* Author Info */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid #bae6fd'
              }}>
                <p style={{ 
                  fontSize: '0.85rem',
                  color: '#0369a1',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  👨‍🍳 Created by: <strong>{r.author?.email || 'Unknown'}</strong>
                </p>
              </div>

              {/* Ratings */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                padding: '0.5rem',
                background: '#fef3c7',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '1.2rem' }}>⭐</span>
                <span style={{ 
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#92400e'
                }}>
                  {r.averageRating || 0}
                </span>
                <span style={{ 
                  fontSize: '0.85rem',
                  color: '#78350f'
                }}>
                  ({r.totalRatings || 0} {r.totalRatings === 1 ? 'rating' : 'ratings'})
                </span>
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <span style={{ 
                  fontSize: '0.85rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  📝 {r.steps?.length || 0} steps
                </span>
                <span style={{ 
                  fontSize: '0.85rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  🥗 {r.ingredients?.length || 0} items
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={() => navigate(`/recipe/${r._id}`)} 
                  className="btn"
                  style={{ 
                    fontSize: '0.85rem', 
                    padding: '0.6rem 0.5rem',
                    whiteSpace: 'nowrap',
                    flex: '1 1 120px'
                  }}
                >
                  👁️ View
                </button>
                <button 
                  onClick={() => onEdit(r)} 
                  className="btn btn-secondary"
                  style={{ 
                    fontSize: '0.85rem', 
                    padding: '0.6rem 0.5rem',
                    flex: '1 1 120px'
                  }}
                >
                  ✏️ Update
                </button>
                <button 
                  onClick={() => handleDelete(r._id)} 
                  className="btn btn-danger"
                  style={{ 
                    fontSize: '0.85rem', 
                    padding: '0.6rem 0.5rem',
                    flex: '1 1 120px'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>
      
      {/* Empty State */}
      {filteredRecipes.length === 0 && (
        <div className="empty-state-modern">
          <div style={{ fontSize: '5rem', marginBottom: '1rem', opacity: 0.6 }}>
            {searchTerm ? '🔍' : '🍽️'}
          </div>
          <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.5rem' }}>
            {searchTerm ? 'No recipes found' : 'No recipes yet!'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            {searchTerm ? 'Try a different search term' : 'Start by adding your first delicious recipe above.'}
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="btn"
              style={{ marginTop: '1rem' }}
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeList;
