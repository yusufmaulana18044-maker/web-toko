const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "rahasia_jwt";

// Middleware untuk verify token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      console.warn("⚠️  No token provided");
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan"
      });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    console.log("✅ Token verified for user:", decoded.username);
    next();
  } catch (err) {
    console.error("❌ Token verification error:", err.message);
    res.status(401).json({
      success: false,
      message: "Token tidak valid: " + err.message
    });
  }
};

// Middleware untuk check role tertentu
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Role yang diizinkan: ${allowedRoles.join(", ")}`
      });
    }

    next();
  };
};

module.exports = { verifyToken, checkRole };
