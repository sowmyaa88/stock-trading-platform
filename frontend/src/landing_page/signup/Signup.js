import React, { useState } from "react";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
              <h4>🎉 Account Created!</h4>
              <p className="mt-2 text-muted">
                Welcome to Stock Trading Platform! You can now log into your dashboard on <strong>http://localhost:3001</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 className="fs-2 mb-3">Signup now</h1>
              <p className="text-muted mb-4">
                Or track your existing application
              </p>

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

              <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                You will receive an OTP on your mobile number for verification.
              </p>

              <button
                type="submit"
                className="btn btn-primary px-4 py-2 fs-5 mt-2"
                style={{ width: "100%" }}
              >
                Continue
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
