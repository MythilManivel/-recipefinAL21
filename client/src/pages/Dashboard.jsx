import { useEffect, useState } from "react";
import api from "../api";
import RecipeForm from "../components/RecipeForm";
import RecipeList from "../components/RecipeList";
import { hasRecipeImage, hasRecipeVideo } from "../utils/media.js";

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [editRecipe, setEditRecipe] = useState(null); // track recipe being edited

  const fetchRecipes = async () => {
    try {
      const res = await api.get("/recipes");
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleRecipeAdded = (newRecipe) => {
    setRecipes((prev) => [...prev, newRecipe]);
  };

  const handleUpdateComplete = (updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
    );
    setEditRecipe(null); // clear edit mode
  };

  // Calculate statistics
  const totalRecipes = recipes.length;
  const withVideo = recipes.filter(hasRecipeVideo).length;
  const withImage = recipes.filter(hasRecipeImage).length;
  const totalIngredients = recipes.reduce((sum, r) => sum + (r.ingredients?.length || 0), 0);

  return (
    <div className="container fade-in">
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '3rem 2rem',
        borderRadius: '20px',
        color: 'white',
        marginBottom: '2rem',
        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
      }}>
        <h1 style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '2.5rem',
          fontWeight: '800'
        }}>
          🍳 Recipe Dashboard
        </h1>
        <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>
          Create, manage, and share your delicious recipes
        </p>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#667eea', marginBottom: '0.25rem' }}>
            {totalRecipes}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
            Total Recipes
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(239, 68, 68, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎥</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ef4444', marginBottom: '0.25rem' }}>
            {withVideo}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
            With Videos
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981', marginBottom: '0.25rem' }}>
            {withImage}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
            With Images
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(245, 158, 11, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🥗</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b', marginBottom: '0.25rem' }}>
            {totalIngredients}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
            Total Ingredients
          </div>
        </div>
      </div>
      
      {/* Recipe Form */}
      <div className="card" style={{
        background: 'white',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #f1f5f9'
      }}>
        <RecipeForm
          onRecipeAdded={handleRecipeAdded}
          initialData={editRecipe}
          onUpdateComplete={handleUpdateComplete}
        />
      </div>
      
      {/* Recipe List */}
      <RecipeList
        recipes={recipes}
        refresh={fetchRecipes}
        onEdit={(recipe) => setEditRecipe(recipe)}
      />
    </div>
  );
};

export default Dashboard;
