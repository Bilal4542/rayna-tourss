const mongoose = require("mongoose");
const Category = require("../models/Category");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizePayload = (payload) => {
  const normalized = { ...payload };
  if (normalized.name) normalized.name = String(normalized.name).trim();
  if (normalized.slug) normalized.slug = String(normalized.slug).trim().toLowerCase();
  if (Array.isArray(normalized.banners)) {
    normalized.banners = normalized.banners
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }
  return normalized;
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, banners } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ message: "name and slug are required." });
    }

    const category = await Category.create(normalizePayload({ name, slug, banners }));
    return res.status(201).json({
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Category name or slug already exists." });
    }
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0]?.message;
      return res.status(400).json({ message: firstError || "Validation failed." });
    }
    return res.status(500).json({ message: "Failed to create category." });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const data = await Category.find().sort({ name: 1 });
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch categories." });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid category id." });
    }

    const data = await Category.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Category not found." });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch category." });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid category id." });
    }

    const updated = await Category.findByIdAndUpdate(id, normalizePayload(req.body), {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({
      message: "Category updated successfully.",
      data: updated,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Category name or slug already exists." });
    }
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0]?.message;
      return res.status(400).json({ message: firstError || "Validation failed." });
    }
    return res.status(500).json({ message: "Failed to update category." });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid category id." });
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete category." });
  }
};
