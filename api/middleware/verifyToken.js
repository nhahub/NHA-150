// this middleware verifies JWT tokens for protected routes
// imports
import jwt from "jsonwebtoken";

// middleware function to verify JWT token
export const verifyToken = (req, res, next) => {
  
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);  // Retrieve token from cookies or Authorization header
    
  // if no token is found, respond with 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: "Not authenticated!" });
  }

  try {
    const secret = process.env.JWT_SECRET_KEY || process.env.jwt_secret_key;  // Get JWT secret from environment variables
    if (!secret) {
      console.error("JWT secret not set in env");
      return res.status(500).json({ message: "Server misconfiguration" });
    }
    // verify the token
    const payload = jwt.verify(token, secret);
    req.userId = payload?.id || payload?.userId;
    next(); // proceed to the next middleware or route handler
  } catch (err) {
    // if token verification fails, respond with 403 Forbidden
    console.error("verifyToken error:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
};