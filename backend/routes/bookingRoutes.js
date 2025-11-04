const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const protect = require("../middleware/authMiddleware");

// Book a car (customer only)
router.post("/:carId", protect(["user"]), async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    if (!car.available)
      return res.status(400).json({ message: "Car already booked" });

    car.available = false;
    car.booked_by = req.user.id;

    await car.save();
    res.json({ message: "Car booked successfully", car });
  } catch (error) {
    console.error("Error booking car:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Cancel booking (customer only)
router.post("/cancel/:carId", protect(["user"]), async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    if (car.booked_by?.toString() !== req.user.id)
      return res.status(403).json({ message: "You can only cancel your own bookings" });

    car.available = true;
    car.booked_by = null;
    await car.save();

    res.json({ message: "Booking cancelled successfully", car });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all bookings for a host
router.get("/host", protect(["host"]), async (req, res) => {
  try {
    // Find all cars owned by this host
    const cars = await Car.find({ host_id: req.user.id })
      .populate("booked_by", "username email role");

    res.json(cars);
  } catch (error) {
    console.error("Error fetching host bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
