const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Car = require("../models/Car");
const protect = require("../middleware/authMiddleware");

// Create booking (Customer)
router.post("/:carId", protect(["user"]), async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    const car = await Car.findById(req.params.carId);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (!car.available)
      return res.status(400).json({ message: "Car already booked" });

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    if (days <= 0)
      return res
        .status(400)
        .json({ message: "End date must be after start date" });

    const total_price = days * car.price_per_day;

    const booking = await Booking.create({
      car_id: car._id,
      user_id: req.user.id,
      host_id: car.host_id,
      start_date,
      end_date,
      total_price,
    });

    // Update car availability
    car.available = false;
    await car.save();

    res.status(201).json({
      message: "Car booked successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all bookings for logged-in customer
router.get("/mine", protect(["user"]), async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.user.id })
      .populate({
        path: "car_id",
        select: "brand model image_path price_per_day location",
      })
      .populate({
        path: "host_id",
        select: "username email",
      })
      .sort({ created_at: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all bookings for a host
router.get("/host", protect(["host"]), async (req, res) => {
  try {
    const bookings = await Booking.find({ host_id: req.user.id })
      .populate({
        path: "car_id",
        select: "brand model price_per_day image_path",
      })
      .populate({
        path: "user_id",
        select: "username email",
      })
      .sort({ created_at: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Error fetching host bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Cancel a booking (Customer)
router.post("/cancel/:bookingId", protect(["user"]), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate("car_id");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user_id.toString() !== req.user.id)
      return res.status(403).json({ message: "You are not authorized" });

    booking.status = "cancelled";
    await booking.save();

    // Make the car available again
    if (booking.car_id) {
      const car = await Car.findById(booking.car_id._id);
      if (car) {
        car.available = true;
        await car.save();
      }
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
