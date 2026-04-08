const mongoose = require("mongoose");

const cityPointSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    banners: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cityPointSchema.index({ name: 1 }, { unique: true });
cityPointSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model("CityPoint", cityPointSchema);
