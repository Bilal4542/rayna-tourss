const express = require("express");
const {
  createCityPoint,
  getCityPoints,
  getCityPointById,
  updateCityPoint,
  deleteCityPoint,
} = require("../controllers/cityPointController");

const router = express.Router();

router.get("/", getCityPoints);
router.get("/:id", getCityPointById);
router.post("/", createCityPoint);
router.patch("/:id", updateCityPoint);
router.delete("/:id", deleteCityPoint);

module.exports = router;
