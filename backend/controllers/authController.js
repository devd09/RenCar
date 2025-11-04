const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (user) => {
return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
);
};

// REGISTER
exports.registerUser = async (req, res) => {
try {
    const { username, email, password, full_name, phone, address, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
    username,
    email,
    password: hashedPassword,
    full_name,
    phone,
    address,
    role,
    });

    res.status(201).json({
    message: "User registered successfully",
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    },
    token: generateToken(user),
    });
} catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
}
};

// 🔑 LOGIN
exports.loginUser = async (req, res) => {
try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
    message: "Login successful",
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    },
    token: generateToken(user),
    });
} catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
}
};
