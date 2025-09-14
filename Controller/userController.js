const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  console.log("Inside register function");
  const { userName, email, password } = req.body;
  
  try {
    // Validation
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const userResponse = {
      _id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
      token
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  console.log("Inside login function");
  const { email, password } = req.body;
  
  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const userResponse = {
      _id: existingUser._id,
      userName: existingUser.userName,
      email: existingUser.email,
      createdAt: existingUser.createdAt
    };

    res.status(200).json({
      message: "Login successful",
      user: userResponse,
      token
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Optional: Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};