const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  throw new Error(
    "FATAL SECURITY ERROR: JWT_SECRET environment variable is missing. Server refusing to start without a configured secret."
  );
}

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  // Extract token from HTTP-only cookie or Authorization header fallback
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({ error: "Access denied. Authentication token required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired authentication token." });
  }
};

module.exports = { verifyToken, JWT_SECRET };
