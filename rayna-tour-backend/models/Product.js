const mongoose = require("mongoose");

const textBlockSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  { _id: false }
);

const pricingSchema = new mongoose.Schema(
  {
    actualPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator(value) {
          if (value == null) return true;
          return value <= this.actualPrice;
        },
        message: "discountPrice cannot be greater than actualPrice.",
      },
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: "AED",
      minlength: 3,
      maxlength: 3,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    cityPoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CityPoint",
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [textBlockSchema],
      default: [],
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 220,
    },
    contentSections: {
      type: [textBlockSchema],
      default: [],
    },
    pricing: {
      type: pricingSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ category: 1, city: 1, cityPoint: 1 });
productSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
