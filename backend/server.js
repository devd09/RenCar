const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const carRoutes = require("./routes/carRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const hostRoutes = require("./routes/hostRoutes");

app.use("/api/host", hostRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// Basic test route
app.get("/", (req, res) => {
  res.send("RenCar backend connected to local MongoDB!");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
