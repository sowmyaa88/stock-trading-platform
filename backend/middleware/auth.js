const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "stock_trading_jwt_secret_key_2026";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Fallback demo user for unauthenticated requests
    req.user = { id: "sowmyaa88", username: "sowmyaa88" };
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired authentication token. Please log in again." });
  }
};

module.exports = { verifyToken, JWT_SECRET };
