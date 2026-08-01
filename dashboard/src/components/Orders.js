import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/allOrders`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setOrders(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Could not fetch orders from backend.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="orders text-center p-5">
        <p className="text-muted">Loading live orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <h3 className="title">Orders ({orders.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Instrument</th>
              <th>Type</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const isBuy = order.mode === "BUY";
              const timeString = order.createdAt
                ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                : "Just now";

              return (
                <tr key={order._id || index}>
                  <td>{timeString}</td>
                  <td><strong>{order.name}</strong></td>
                  <td>
                    <span className={`badge ${isBuy ? "bg-primary" : "bg-warning"}`} style={{ padding: "4px 8px", color: "#fff", borderRadius: "4px" }}>
                      {order.mode}
                    </span>
                  </td>
                  <td>{order.qty}</td>
                  <td>₹{Number(order.price).toFixed(2)}</td>
                  <td>
                    <span style={{ color: "#10b981", fontWeight: "600" }}>
                      {order.status || "COMPLETE"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
