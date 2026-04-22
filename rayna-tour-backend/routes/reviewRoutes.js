const express = require("express");
const {
  createReview,
  getReviews,
} = require("../controllers/reviewController");

const router = express.Router();

// @route   POST /api/reviews/:productId
// @desc    Create a new review for a product
router.post("/:productId", createReview);

// @route   GET /api/reviews/:productId
// @desc    Get all reviews for a product
router.get("/:productId", getReviews);

module.exports = router;
