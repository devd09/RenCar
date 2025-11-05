const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const upload = require("../middleware/uploadMiddleware");
const protect = require("../middleware/authMiddleware");

// Add a new car (Host only)
// Accepts either form-data (with image file) or JSON (with image_path)
router.post("/", protect(["host"]), upload.single("image"), async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      color,
      license_plate,
      price_per_day,
      category,
      seats,
      transmission,
      fuel_type,
      location,
      description,
      image_path // for JSON uploads
    } = req.body;

    // Determine image path (file upload or JSON path)
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path;
    } else if (image_path) {
      imagePath = image_path; // use provided path directly
    }

    const newCar = new Car({
      host_id: req.user.id,
      brand,
      model,
      year,
      color,
      license_plate,
      price_per_day,
      category,
      seats,
      transmission,
      fuel_type,
      location,
      description,
      image_path: imagePath
    });

    await newCar.save();

    res.status(201).json({
      message: "Car added successfully",
      car: newCar
    });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/host/mine", protect(["host"]), async (req, res) => {
  try {
    const hostId = req.user.id;
    const cars = await Car.find({ host_id: hostId });
    res.json(cars);
  } catch (error) {
    console.error("Error fetching host cars:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Delete a car (Host only)
router.delete("/:carId", protect(["host"]), async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // Ensure the logged-in host owns this car
    if (car.host_id.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to delete this car" });

    await car.deleteOne();
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const cars = await Car.find({ available: true }); // ✅ Only available
    res.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
