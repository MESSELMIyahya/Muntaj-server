const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [2, "Category name must be at least 2 characters."],
      maxlength: [32, "Category name cannot exceed 32 characters."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(`Category`, categorySchema);