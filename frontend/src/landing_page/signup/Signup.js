import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.email || !formData.mobile) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Option B: HTTP-Only cookie is automatically set by the server via withCredentials
      await axios.post(
        `${API_URL}/signup`,
        {
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password || "password123",
        },
        { withCredentials: true }
      );

      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      console.error("Signup failed:", err);
      setIsSubmitting(false);
      setErrorMsg(err.response?.data?.error || "Registration failed. Is the backend server running?");
    }
  };

  return (
    <div className="container p-5 mb-5">
      <div className="row p-5 mt-5">
        <div className="col-7 p-5 text-center">
          <img
            src="media/images/homeHero.svg"
            style={{ width: "90%" }}
            alt="Signup Banner"
          />
        </div>
        <div className="col-5 p-5">
          {submitted ? (
            <div className="alert alert-success p-4 text-center">
              <h4>🎉 Account Created Successfully!</h4>
              <p className="mt-2 text-muted">
                Welcome to Stock Trading Platform! Your user account for <strong>{formData.email}</strong> is active.
              </p>
              <a href="http://localhost:3001" className="btn btn-primary mt-3 px-4 py-2">
                Go to Trading Dashboard
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 className="fs-2 mb-3">Signup now</h1>
              <p className="text-muted mb-4">
                Create your account to start trading stocks & mutual funds
              </p>

              {errorMsg && (
                <div className="alert alert-danger p-2 mb-3" style={{ fontSize: "0.9rem" }}>
                  {errorMsg}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label text-muted">Mobile Number</label>
                <div className="input-group mb-3">
                  <span className="input-group-text">+91</span>
                  <input
                    type="tel"
                    className="form-control p-2"
                    placeholder="Enter 10 digit mobile number"
                    required
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">Email Address</label>
                <input
                  type="email"
                  className="form-control p-2"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">Password</label>
                <input
                  type="password"
                  className="form-control p-2"
                  placeholder="Set a secure password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary px-4 py-2 fs-5 mt-2"
                style={{ width: "100%" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Continue"}
              </button>

              <p className="mt-4 text-muted" style={{ fontSize: "0.8rem" }}>
                By signing up, you agree to our Terms & Conditions and Privacy Policy.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;
