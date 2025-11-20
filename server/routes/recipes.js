import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import path from "path";
import fs from "fs";
import Recipe from "../models/Recipe.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// ---------------- CONFIG ---------------- //

const CLOUDINARY_CONFIGURED =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

if (CLOUDINARY_CONFIGURED) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer disk storage for local files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = file.fieldname === 'video' ? 'videos' : 'images';
    const fullPath = path.join(uploadsDir, subDir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  }
});

// ---------------- ROUTES ---------------- //

// Add new recipe
router.post("/", auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    let imageUrl = "";
    let videoUrl = "";

    if (CLOUDINARY_CONFIGURED && req.files) {
      // Handle Cloudinary uploads
      if (req.files.image) {
        const imageUploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            { folder: "recipes/images" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          fs.createReadStream(req.files.image[0].path).pipe(stream);
        });
        imageUrl = imageUploadResult.secure_url;
        // Clean up local file
        fs.unlinkSync(req.files.image[0].path);
      }

      if (req.files.video) {
        const videoUploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            { 
              folder: "recipes/videos",
              resource_type: "video",
              chunk_size: 6000000
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          fs.createReadStream(req.files.video[0].path).pipe(stream);
        });
        videoUrl = videoUploadResult.secure_url;
        // Clean up local file
        fs.unlinkSync(req.files.video[0].path);
      }
    } else {
      // Handle local file storage
      if (req.files && req.files.image) {
        imageUrl = `/uploads/images/${req.files.image[0].filename}`;
      }
      if (req.files && req.files.video) {
        videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
      }
    }

    const recipe = await Recipe.create({
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients
        ? req.body.ingredients.split(",").map((i) => i.trim())
        : [],
      steps: req.body.steps
        ? req.body.steps.split("\n").map((s) => s.trim())
        : [],
      imageUrl,
      videoUrl,
      author: req.user.id,
    });

    const populatedRecipe = await Recipe.findById(recipe._id).populate('author', 'name email');
    res.status(201).json(populatedRecipe);
  } catch (err) {
    console.error("Error adding recipe:", err);
    res.status(500).json({ message: "Error adding recipe", error: err.message });
  }
});

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('author', 'name email').sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ message: "Error fetching recipes", error: err.message });
  }
});

// Get single recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'name email');
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    console.error("Error fetching recipe:", err);
    res.status(500).json({ message: "Error fetching recipe", error: err.message });
  }
});

// Update recipe (only by author)
router.put("/:id", auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const existingRecipe = await Recipe.findById(req.params.id);
    if (!existingRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    let imageUrl;
    let videoUrl;

    if (CLOUDINARY_CONFIGURED && req.files) {
      // Handle image upload
      if (req.files.image) {
        const imageUploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            { folder: "recipes/images" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          stream.end(req.files.image[0].buffer);
        });
        imageUrl = imageUploadResult.secure_url;
      }

      // Handle video upload
      if (req.files.video) {
        const videoUploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            { 
              folder: "recipes/videos",
              resource_type: "video",
              chunk_size: 6000000
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          stream.end(req.files.video[0].buffer);
        });
        videoUrl = videoUploadResult.secure_url;
      }
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        ingredients: req.body.ingredients
          ? req.body.ingredients.split(",").map((i) => i.trim())
          : [],
        steps: req.body.steps
          ? req.body.steps.split("\n").map((s) => s.trim())
          : [],
        ...(imageUrl && { imageUrl }),
        ...(videoUrl && { videoUrl }),
      },
      { new: true }
    ).populate('author', 'name email');

    if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found" });

    res.json(updatedRecipe);
  } catch (err) {
    console.error("Error updating recipe:", err);
    res.status(500).json({ message: "Error updating recipe", error: err.message });
  }
});

// Delete recipe (only by author)
router.delete("/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("Error deleting recipe:", err);
    res.status(500).json({ message: "Error deleting recipe", error: err.message });
  }
});

// Add or update rating
router.post("/:id/rate", auth, async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if user already rated
    const existingRatingIndex = recipe.ratings.findIndex(
      r => r.user && r.user.toString() === req.user.id
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      recipe.ratings[existingRatingIndex].rating = rating;
      recipe.ratings[existingRatingIndex].createdAt = new Date();
    } else {
      // Add new rating
      recipe.ratings.push({
        user: req.user.id,
        rating
      });
    }

    // Calculate average rating
    const totalRatings = recipe.ratings.length;
    const sumRatings = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);
    recipe.averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 0;
    recipe.totalRatings = totalRatings;

    await recipe.save();
    
    const populatedRecipe = await Recipe.findById(recipe._id).populate('author', 'name email');
    res.json(populatedRecipe);
  } catch (err) {
    console.error("Error rating recipe:", err);
    res.status(500).json({ message: "Error rating recipe", error: err.message });
  }
});

export default router;
