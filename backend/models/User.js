const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ["user", "host"], default: "user" },
},
{ timestamps: { createdAt: "created_at", updatedAt: false } }
);

module.exports = mongoose.model("User", userSchema);
