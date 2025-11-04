const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  car_id: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  host_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  total_price: { type: Number, required: true },
  status: { type: String, enum: ["booked", "cancelled", "completed"], default: "booked" },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
