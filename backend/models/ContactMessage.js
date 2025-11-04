const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
{
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
},
{ timestamps: { createdAt: "submitted_at", updatedAt: false } }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
