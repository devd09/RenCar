const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

const User = require("./models/User");
const Car = require("./models/Car");
const Booking = require("./models/Booking");
const ContactMessage = require("./models/ContactMessage");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const seedData = async () => {
  try {
    console.log(" Clearing existing data...");
    await User.deleteMany();
    await Car.deleteMany();
    await Booking.deleteMany();
    await ContactMessage.deleteMany();

    // Create users (1 host + 1 customer)
    const salt = await bcrypt.genSalt(10);

    const hostPassword = await bcrypt.hash("host123", salt);
    const customerPassword = await bcrypt.hash("user123", salt);

    const hostUser = await User.create({
      full_name: "Rajesh Sharma",
      username: "rajesh_host",
      email: "rajesh.host@example.com",
      password: hostPassword,
      role: "host",
    });

    const customerUser = await User.create({
      full_name: "Priya Mehta",
      username: "priya_user",
      email: "priya.user@example.com",
      password: customerPassword,
      role: "user",
    });

    // Create cars for the host
    const carsData = [
      {
        host_id: hostUser._id,
        brand: "Maruti Suzuki",
        model: "Swift",
        year: 2022,
        color: "Red",
        license_plate: "MH12AB1234",
        price_per_day: 1800,
        category: "Hatchback",
        seats: 5,
        transmission: "Manual",
        fuel_type: "Petrol",
        image_path: "uploads/cars/maruti-swift.png",
        location: "Mumbai",
        available: true,
        description: "A compact and reliable car, perfect for city rides.",
      },
      {
        host_id: hostUser._id,
        brand: "Hyundai",
        model: "Creta",
        year: 2023,
        color: "White",
        license_plate: "DL8CAF5678",
        price_per_day: 3000,
        category: "SUV",
        seats: 5,
        transmission: "Automatic",
        fuel_type: "Diesel",
        image_path: "uploads/cars/hyundai-creta.png",
        location: "Delhi",
        available: true,
        description: "Spacious SUV with great comfort for family trips.",
      },
      {
        host_id: hostUser._id,
        brand: "Tata",
        model: "Nexon EV",
        year: 2023,
        color: "Blue",
        license_plate: "KA03EV4321",
        price_per_day: 3500,
        category: "Electric",
        seats: 5,
        transmission: "Automatic",
        fuel_type: "Electric",
        image_path: "uploads/cars/tata-nexon-ev.png",
        location: "Bengaluru",
        available: true,
        description: "Electric SUV with premium comfort and zero emissions.",
      },
      {
        host_id: hostUser._id,
        brand: "Toyota",
        model: "Innova Crysta",
        year: 2021,
        color: "Silver",
        license_plate: "TN10CR2021",
        price_per_day: 4000,
        category: "MPV",
        seats: 7,
        transmission: "Automatic",
        fuel_type: "Diesel",
        image_path: "uploads/cars/toyota-innova.png",
        location: "Chennai",
        available: true,
        description: "Perfect for long family journeys with excellent comfort.",
      },
      {
        host_id: hostUser._id,
        brand: "Honda",
        model: "City",
        year: 2022,
        color: "Grey",
        license_plate: "GJ05HC5678",
        price_per_day: 2500,
        category: "Sedan",
        seats: 5,
        transmission: "Manual",
        fuel_type: "Petrol",
        image_path: "uploads/cars/honda-city.png",
        location: "Ahmedabad",
        available: true,
        description: "Elegant sedan with smooth performance and mileage.",
      },
    ];

    // Ensure uploads folder exists
    const uploadDir = path.join(__dirname, "uploads", "cars");
    fs.mkdirSync(uploadDir, { recursive: true });

    await Car.insertMany(carsData);

    console.log("Seed data inserted successfully!");
    console.log("Host login: rajesh.host@example.com / host123");
    console.log("Customer login: priya.user@example.com / user123");

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
