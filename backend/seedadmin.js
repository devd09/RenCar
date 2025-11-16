// seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config/db");

async function run() {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || "admin@rencar.local";
  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }
  const hashed = await bcrypt.hash(process.env.ADMIN_PASS || "Admin@123", 10);
  const admin = new User({
    username: "admin",
    full_name: "Site Admin",
    email,
    password: hashed,
    role: "admin"
  });
  await admin.save();
  console.log("Admin created:", email);
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
