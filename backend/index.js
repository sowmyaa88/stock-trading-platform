require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const { verifyToken, JWT_SECRET } = require("./middleware/auth");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Fallback seed datasets when database is unpopulated or offline
const tempHoldings = [
  { name: "BHARTIARTL", qty: 2, avg: 538.05, price: 541.15, net: "+0.58%", day: "+2.99%" },
  { name: "HDFCBANK", qty: 2, avg: 1383.4, price: 1522.35, net: "+10.04%", day: "+0.11%" },
  { name: "HINDUNILVR", qty: 1, avg: 2335.85, price: 2417.4, net: "+3.49%", day: "+0.21%" },
  { name: "INFY", qty: 1, avg: 1350.5, price: 1555.45, net: "+15.18%", day: "-1.60%", isLoss: true },
  { name: "ITC", qty: 5, avg: 202.0, price: 207.9, net: "+2.92%", day: "+0.80%" },
  { name: "KPITTECH", qty: 5, avg: 250.3, price: 266.45, net: "+6.45%", day: "+3.54%" },
  { name: "M&M", qty: 2, avg: 809.9, price: 779.8, net: "-3.72%", day: "-0.01%", isLoss: true },
  { name: "RELIANCE", qty: 1, avg: 2193.7, price: 2112.4, net: "-3.71%", day: "+1.44%" },
  { name: "SBIN", qty: 4, avg: 324.35, price: 430.2, net: "+32.63%", day: "-0.34%", isLoss: true },
  { name: "TATAPOWER", qty: 5, avg: 104.2, price: 124.15, net: "+19.15%", day: "-0.24%", isLoss: true },
  { name: "TCS", qty: 1, avg: 3041.7, price: 3194.8, net: "+5.03%", day: "-0.25%", isLoss: true },
  { name: "WIPRO", qty: 4, avg: 489.3, price: 577.75, net: "+18.08%", day: "+0.32%" },
];

const tempPositions = [
  { product: "CNC", name: "EVEREADY", qty: 2, avg: 316.27, price: 312.35, net: "+0.58%", day: "-1.24%", isLoss: true },
  { product: "CNC", name: "JUBLFOOD", qty: 1, avg: 3124.75, price: 3082.65, net: "+10.04%", day: "-1.35%", isLoss: true },
];

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

// GET /allHoldings
app.get("/allHoldings", async (req, res) => {
  try {
    let allHoldings = await HoldingsModel.find({});
    if (!allHoldings || allHoldings.length === 0) {
      return res.json(tempHoldings);
    }
    res.json(allHoldings);
  } catch (err) {
    res.json(tempHoldings);
  }
});

// GET /allPositions
app.get("/allPositions", async (req, res) => {
  try {
    let allPositions = await PositionsModel.find({});
    if (!allPositions || allPositions.length === 0) {
      return res.json(tempPositions);
    }
    res.json(allPositions);
  } catch (err) {
    res.json(tempPositions);
  }
});

// GET /allOrders
app.get("/allOrders", verifyToken, async (req, res) => {
  try {
    let allOrders = await OrdersModel.find({}).sort({ createdAt: -1 });
    res.json(allOrders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// POST /newOrder (With Authentication & Input Validation)
app.post("/newOrder", verifyToken, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    // Input Validation
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Stock name is required." });
    }
    const parsedQty = Number(qty);
    const parsedPrice = Number(price);

    if (isNaN(parsedQty) || parsedQty <= 0) {
      return res.status(400).json({ error: "Quantity must be a positive number greater than 0." });
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ error: "Price must be a non-negative number." });
    }
    if (!mode || !["BUY", "SELL"].includes(mode.toUpperCase())) {
      return res.status(400).json({ error: "Order mode must be either BUY or SELL." });
    }

    // Extract authenticated userId securely from decoded JWT token
    const authenticatedUserId = req.user?.username || req.user?.id || "sowmyaa88";

    let newOrder = new OrdersModel({
      name: name.trim().toUpperCase(),
      qty: parsedQty,
      price: parsedPrice,
      mode: mode.toUpperCase(),
      userId: authenticatedUserId,
      status: "COMPLETE",
      createdAt: new Date(),
    });

    await newOrder.save();
    res.status(201).json({ message: "Order saved successfully!", order: newOrder });
  } catch (err) {
    console.error("Order processing error:", err);
    res.status(500).json({ error: "Server error saving order." });
  }
});

// POST /signup (Secure User Registration with Bcrypt Password Hashing & JWT)
app.post("/signup", async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if (!email || !mobile || !password) {
      return res.status(400).json({ error: "Email, mobile number, and password are required." });
    }

    const username = email.split("@")[0] || "user";
    
    // Check if user already exists
    let existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      // Verify password for existing user
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password for existing email account." });
      }
      
      const token = jwt.sign(
        { id: existingUser._id, username: existingUser.username, email: existingUser.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const userObject = existingUser.toObject();
      delete userObject.password;

      return res.json({ message: "Welcome back! User logged in successfully.", token, user: userObject });
    }

    // Hash password securely with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = new UserModel({
      username,
      email,
      mobile,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userObject = newUser.toObject();
    delete userObject.password;

    res.status(201).json({ message: "Account created successfully!", token, user: userObject });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// POST /login (Secure User Authentication with Bcrypt Password Verification & JWT)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User account not found. Please sign up." });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password. Access denied." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userObject = user.toObject();
    delete userObject.password;

    res.json({ message: "Login successful!", token, user: userObject });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during authentication." });
  }
});

// ----------------------------------------------------
// SERVER START
// ----------------------------------------------------
app.listen(PORT, () => {
  console.log(`Backend API Server running on port ${PORT}!`);
  if (uri && !uri.includes("<<")) {
    mongoose
      .connect(uri)
      .then(() => console.log("Database connected successfully!"))
      .catch((err) => console.log("Database connection warning:", err.message));
  } else {
    console.log("No MONGO_URL configured in .env - running in fallback API mode.");
  }
});
