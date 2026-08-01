const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  mode: { type: String, required: true, enum: ["BUY", "SELL"] },
  userId: { type: String, default: "demo_user" },
  status: { type: String, default: "COMPLETE" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = { OrdersSchema };
