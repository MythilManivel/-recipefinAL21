import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    ingredients: [{ type: String }],
    steps: [{ type: String }],
    imageUrl: { type: String },
    imagePublicId: { type: String },
    videoUrl: { type: String },
    videoPublicId: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ratings: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);
