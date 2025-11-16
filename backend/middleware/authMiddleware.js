const jwt = require("jsonwebtoken");

const protect = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      // No token provided
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
        username: decoded.username,
      };

      // Role-based access check
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return res
        .status(401)
        .json({ message: "Invalid or expired token. Please log in again." });
    }
  };
};

module.exports = protect;
