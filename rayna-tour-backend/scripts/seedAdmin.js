const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing in .env");
  process.exit(1);
}

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const email = "rayna@gmail.com";
    const plainPassword = "123456";
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    await User.collection.updateOne(
      { email },
      {
        $set: {
          name: "rayna",
          email,
          password: hashedPassword,
          role: "admin",
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    console.log("Admin user seeded: rayna@gmail.com / 123456");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin user:", error.message);
    process.exit(1);
  }
};

seedAdmin();
