const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  host_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  brand: String,
  model: String,
  year: Number,
  color: String,
  license_plate: String,
  price_per_day: Number,
  category: String,
  seats: Number,
  transmission: String,
  fuel_type: String,
  location: String,
  description: String,
  image_path: String,
  available: { type: Boolean, default: true },
  booked_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Car", carSchema);
