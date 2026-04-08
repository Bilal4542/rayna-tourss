const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cityRoutes = require("./routes/cityRoutes");
const cityPointRoutes = require("./routes/cityPointRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
// Multer error handler removed (no longer needed)

dotenv.config();

const app = express();
const allowedOrigins = (
  process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/city-points", cityPointRoutes);
app.use("/api/uploads", uploadRoutes);
// multerErrorHandler middleware removed (no longer needed)

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing. Add it in your .env file.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.status(200).json({ message: "Rayna Tours API is running" });
});

app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message || "Request failed." });
  }
  return next();
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});
