const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const protect = require("../middleware/authMiddleware");

// Host dashboard: Get all cars + booking info
router.get("/dashboard", protect(["host"]), async (req, res) => {
  try {
    const hostId = req.user.id;
    const cars = await Car.find({ host_id: hostId })
      .populate("booked_by", "username email");

    const totalCars = cars.length;
    const bookedCars = cars.filter(car => !car.available).length;
    const availableCars = totalCars - bookedCars;

    res.json({
      stats: {
        totalCars,
        bookedCars,
        availableCars
      },
      cars
    });
  } catch (error) {
    console.error("Error loading host dashboard:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
