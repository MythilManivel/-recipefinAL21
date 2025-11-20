const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const buildMediaUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
};

export const getRecipeImagePath = (recipe) =>
  recipe?.imageUrl || recipe?.image || recipe?.imagePath || '';

export const getRecipeVideoPath = (recipe) =>
  recipe?.videoUrl || recipe?.video || recipe?.videoPath || '';

export const hasRecipeImage = (recipe) => Boolean(getRecipeImagePath(recipe));
export const hasRecipeVideo = (recipe) => Boolean(getRecipeVideoPath(recipe));

