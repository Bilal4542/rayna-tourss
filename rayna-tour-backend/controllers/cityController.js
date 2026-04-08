const mongoose = require("mongoose");
const City = require("../models/City");

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

exports.createCity = async (req, res) => {
  try {
    const { name, slug, banners } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ message: "name and slug are required." });
    }

    const city = await City.create(normalizePayload({ name, slug, banners }));
    return res.status(201).json({
      message: "City created successfully.",
      data: city,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "City name or slug already exists." });
    }
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0]?.message;
      return res.status(400).json({ message: firstError || "Validation failed." });
    }
    return res.status(500).json({ message: "Failed to create city." });
  }
};

exports.getCities = async (req, res) => {
  try {
    const data = await City.find().sort({ name: 1 });
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch cities." });
  }
};

exports.getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid city id." });
    }

    const data = await City.findById(id);
    if (!data) {
      return res.status(404).json({ message: "City not found." });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch city." });
  }
};

exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid city id." });
    }

    const updated = await City.findByIdAndUpdate(id, normalizePayload(req.body), {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "City not found." });
    }

    return res.status(200).json({
      message: "City updated successfully.",
      data: updated,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "City name or slug already exists." });
    }
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0]?.message;
      return res.status(400).json({ message: firstError || "Validation failed." });
    }
    return res.status(500).json({ message: "Failed to update city." });
  }
};

exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid city id." });
    }

    const deleted = await City.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "City not found." });
    }

    return res.status(200).json({ message: "City deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete city." });
  }
};
