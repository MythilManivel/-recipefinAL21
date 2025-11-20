import { useState, useEffect } from "react";
import api from "../api";

const RecipeForm = ({ onRecipeAdded, initialData, onUpdateComplete }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoName, setVideoName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipeId, setRecipeId] = useState(null); // track editing

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setIngredients(initialData.ingredients.join(", "));
      setSteps(initialData.steps.join("\n"));
      setRecipeId(initialData._id);
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("ingredients", ingredients);
      formData.append("steps", steps);
      if (image) formData.append("image", image);
      if (video) formData.append("video", video);

      if (recipeId) {
        // Editing existing recipe
        const res = await api.put(`/recipes/${recipeId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onUpdateComplete(res.data);
      } else {
        // Adding new recipe
        const res = await api.post("/recipes", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onRecipeAdded(res.data);
      }

      // Reset form
      setTitle("");
      setDescription("");
      setIngredients("");
      setSteps("");
      setImage(null);
      setVideo(null);
      setImagePreview(null);
      setVideoName("");
      setRecipeId(null);
      const fileInputs = e.target.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => input.value = null);
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Failed to save recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in">
      <h3 style={{ color: '#667eea', marginBottom: '2rem', fontSize: '1.8rem' }}>
        {recipeId ? "✏️ Edit Recipe" : "➕ Add New Recipe"}
      </h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Recipe Title</label>
          <input
            type="text"
            placeholder="Enter recipe title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Describe your recipe..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Ingredients</label>
        <input
          type="text"
          placeholder="Salt, Pepper, Chicken, Rice (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Cooking Steps</label>
        <textarea
          placeholder="1. Heat oil in pan&#10;2. Add ingredients&#10;3. Cook for 10 minutes"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          rows="4"
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>📸 Recipe Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div style={{
              marginTop: '1rem',
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              maxWidth: '300px'
            }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label>🎥 Recipe Video (optional)</label>
          <input 
            type="file" 
            accept="video/*" 
            onChange={handleVideoChange}
          />
          {videoName && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: '#475569', fontSize: '0.9rem' }}>
                🎥 {videoName}
              </span>
              <button
                type="button"
                onClick={() => {
                  setVideo(null);
                  setVideoName("");
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn" 
        style={{ 
          width: '100%', 
          marginTop: '1rem',
          padding: '1rem',
          fontSize: '1.1rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        {isSubmitting ? (
          <>
            <div className="loading-spinner"></div>
            {recipeId ? "Updating..." : "Adding..."}
          </>
        ) : (
          <>
            {recipeId ? "✅ Update Recipe" : "➕ Add Recipe"}
          </>
        )}
      </button>
    </form>
  );
};

export default RecipeForm;
