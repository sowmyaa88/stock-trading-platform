const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  throw new Error(
    "FATAL SECURITY ERROR: JWT_SECRET environment variable is missing. Server refusing to start without a configured secret."
  );
}

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No authentication token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired authentication token." });
  }
};

module.exports = { verifyToken, JWT_SECRET };
