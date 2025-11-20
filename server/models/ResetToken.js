// models/ResetToken.js
import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
});

export default mongoose.model("ResetToken", resetTokenSchema);
