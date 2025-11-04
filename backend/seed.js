const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Car = require("./models/Car");
const Booking = require("./models/Booking");
const ContactMessage = require("./models/ContactMessage");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const seedDatabase = async () => {
  try {
    console.log("🧹 Clearing existing data...");
    await Booking.deleteMany();
    await Car.deleteMany();
    await User.deleteMany();
    await ContactMessage.deleteMany();

    console.log("🔐 Hashing passwords...");
    const hashedPassword = await bcrypt.hash("123456", 10);

    console.log("🌱 Inserting sample users...");
    const users = await User.insertMany([
      {
        username: "john_doe",
        email: "john@example.com",
        password: hashedPassword,
        full_name: "John Doe",
        phone: "9998887777",
        address: "123 Main Street, New York",
        role: "user",
      },
      {
        username: "carhost1",
        email: "host1@example.com",
        password: hashedPassword,
        full_name: "Alice Host",
        phone: "8887776666",
        address: "Los Angeles, CA",
        role: "host",
      },
      {
        username: "carhost2",
        email: "host2@example.com",
        password: hashedPassword,
        full_name: "Bob Host",
        phone: "7776665555",
        address: "Miami, FL",
        role: "host",
      },
    ]);

    console.log("🚘 Inserting sample cars...");
    await Car.insertMany([
      {
        host_id: users[1]._id,
        brand: "Toyota",
        model: "Corolla",
        year: 2022,
        color: "White",
        license_plate: "TOY123",
        price_per_day: 35,
        category: "economy",
        seats: 5,
        transmission: "automatic",
        fuel_type: "petrol",
        image_path: "uploads/sample1.png",
        location: "New York",
        description: "Fuel-efficient and reliable compact car.",
      },
      {
        host_id: users[1]._id,
        brand: "Honda",
        model: "Civic",
        year: 2023,
        color: "Silver",
        license_plate: "HON456",
        price_per_day: 38,
        category: "economy",
        seats: 5,
        transmission: "automatic",
        fuel_type: "petrol",
        image_path: "uploads/sample2.png",
        location: "Los Angeles",
        description: "Sleek design with excellent fuel economy.",
      },
      {
        host_id: users[2]._id,
        brand: "BMW",
        model: "3 Series",
        year: 2023,
        color: "Black",
        license_plate: "BMW789",
        price_per_day: 90,
        category: "luxury",
        seats: 5,
        transmission: "automatic",
        fuel_type: "petrol",
        image_path: "uploads/sample3.png",
        location: "Miami",
        description: "Luxury sedan with sporty performance.",
      },
    ]);

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
