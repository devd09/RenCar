// routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Car = require("../models/Car");
const Booking = require("../models/Booking");
const ContactMessage = require("../models/ContactMessage");

const protect = require("../middleware/authMiddleware");

// Ensure only admin can access
const adminOnly = protect(["admin"]);

/* -----------------------------------------
      1. ADMIN DASHBOARD STATS
----------------------------------------- */
router.get("/stats", adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalHosts = await User.countDocuments({ role: "host" });
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalMessages = await ContactMessage.countDocuments();

    res.json({
      totalUsers,
      totalHosts,
      totalCars,
      totalBookings,
      totalMessages,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -----------------------------------------
      2. USERS + HOSTS
----------------------------------------- */
router.get("/users", adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ created_at: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/hosts", adminOnly, async (req, res) => {
  try {
    const hosts = await User.find({ role: "host" })
      .select("-password")
      .sort({ created_at: -1 });
    res.json(hosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user/host
router.delete("/user/:id", adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -----------------------------------------
      3. CARS
----------------------------------------- */
router.get("/cars", adminOnly, async (req, res) => {
  try {
    const cars = await Car.find()
      .populate("host_id", "username email")
      .sort({ created_at: -1 });

    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/car/:id", adminOnly, async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Car deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -----------------------------------------
      4. BOOKINGS
----------------------------------------- */
router.get("/bookings", adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("car_id", "brand model image_path price_per_day")
      .populate("user_id", "username email")
      .populate("host_id", "username email")
      .sort({ created_at: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/booking/cancel/:id", adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    booking.status = "cancelled";
    await booking.save();

    // Make car available again
    const car = await Car.findById(booking.car_id);
    if (car) {
      car.available = true;
      await car.save();
    }

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -----------------------------------------
      5. CONTACT MESSAGES
----------------------------------------- */
router.get("/messages", adminOnly, async (req, res) => {
  try {
    const msgs = await ContactMessage.find().sort({ submitted_at: -1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/message/:id", adminOnly, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
