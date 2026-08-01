require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");

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
app.get("/allOrders", async (req, res) => {
  try {
    let allOrders = await OrdersModel.find({}).sort({ createdAt: -1 });
    res.json(allOrders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// POST /newOrder (With Input Validation)
app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    // Strict input validation
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

    let newOrder = new OrdersModel({
      name: name.trim().toUpperCase(),
      qty: parsedQty,
      price: parsedPrice,
      mode: mode.toUpperCase(),
      userId: req.body.userId || "sowmyaa88",
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

// POST /signup (User Registration)
app.post("/signup", async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if (!email || !mobile) {
      return res.status(400).json({ error: "Email and mobile number are required." });
    }

    const username = email.split("@")[0] || "user";
    
    // Check if user exists
    let existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.json({ message: "User logged in successfully", user: existingUser });
    }

    let newUser = new UserModel({
      username,
      email,
      mobile,
      password: password || "defaultSecretPassword123",
    });

    await newUser.save();
    res.status(201).json({ message: "Account created successfully!", user: newUser });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// POST /login (User Authentication)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "Login successful!", user });
  } catch (err) {
    res.status(500).json({ error: "Server error during login." });
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
