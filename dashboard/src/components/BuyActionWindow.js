import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(100.0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    const qty = Number(stockQuantity);
    const price = Number(stockPrice);

    if (isNaN(qty) || qty <= 0) {
      setErrorMsg("Quantity must be at least 1.");
      return;
    }
    if (isNaN(price) || price < 0) {
      setErrorMsg("Price must be a positive number.");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API_URL}/newOrder`, {
        name: uid,
        qty: qty,
        price: price,
        mode: "BUY",
        userId: "sowmyaa88",
      });

      setIsSubmitting(false);
      if (generalContext && generalContext.closeBuyWindow) {
        generalContext.closeBuyWindow();
      }
    } catch (err) {
      console.error("Order error:", err);
      setErrorMsg(err.response?.data?.error || "Failed to place order. Is backend server running?");
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = (e) => {
    if (e) e.preventDefault();
    if (generalContext && generalContext.closeBuyWindow) {
      generalContext.closeBuyWindow();
    }
  };

  const marginRequired = (Number(stockQuantity) * Number(stockPrice)).toFixed(2);

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <h4 className="mb-3" style={{ color: "#387ed1", fontSize: "1.1rem" }}>
          Buy {uid} x {stockQuantity} Qty
        </h4>

        {errorMsg && (
          <div className="alert alert-danger p-2 mb-3" style={{ fontSize: "0.85rem", color: "#dc3545" }}>
            {errorMsg}
          </div>
        )}

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="0"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons mt-3">
        <span style={{ fontSize: "0.85rem" }}>Margin required ₹{marginRequired}</span>
        <div>
          <button
            type="button"
            className="btn btn-blue"
            onClick={handleBuyClick}
            disabled={isSubmitting}
            style={{ backgroundColor: "#387ed1", color: "#fff", border: "none", padding: "6px 16px", borderRadius: "4px", marginRight: "8px" }}
          >
            {isSubmitting ? "Placing..." : "Buy"}
          </button>
          <button
            type="button"
            className="btn btn-grey"
            onClick={handleCancelClick}
            style={{ backgroundColor: "#94a3b8", color: "#fff", border: "none", padding: "6px 16px", borderRadius: "4px" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
