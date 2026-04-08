const mongoose = require("mongoose");
const CityPoint = require("../models/CityPoint");

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

exports.createCityPoint = async (req, res) => {
  try {
    const { name, slug, banners } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ message: "name and slug are required." });
    }

    const cityPoint = await CityPoint.create(
      normalizePayload({ name, slug, banners })
    );
    return res.status(201).json({
      message: "City point created successfully.",
      data: cityPoint,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "City point name or slug already exists." });
    }
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0]?.message;
      return res.status(400).json({ message: firstError || "Validation failed." });
    }
    return res.status(500).json({ message: "Failed to create city point." });
  }
};

exports.getCityPoints = async (req, res) => {
  try {
    const data = await CityPoint.find().sort({ name: 1 });
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch city points." });
  }
};

exports.getCityPointById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid city point id." });
    }

    const data = await CityPoint.findById(id);
    if (!data) {
      return res.status(404).json({ message: "City point not found." });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch city point." });
  }
};

exports.updateCityPoint = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid city point id." });
    }

    const updated = await CityPoint.findByIdAndUpdate(id, normalizePayload(req.body), {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "City point not found." });
    }

    return res.status(200).json({
      message: "City point updated successfully.",
      data: updated,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "City point name or slug already exists." });
    }
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0]?.message;
      return res.status(400).json({ message: firstError || "Validation failed." });
    }
    return res.status(500).json({ message: "Failed to update city point." });
  }
};

exports.deleteCityPoint = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid city point id." });
    }

    const deleted = await CityPoint.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "City point not found." });
    }

    return res.status(200).json({ message: "City point deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete city point." });
  }
};
