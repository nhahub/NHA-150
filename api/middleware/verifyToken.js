import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ message: "Not authenticated!" });
  }

  try {
    const secret = process.env.JWT_SECRET_KEY || process.env.jwt_secret_key;
    if (!secret) {
      console.error("JWT secret not set in env");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const payload = jwt.verify(token, secret);
    req.userId = payload?.id || payload?.userId;
    next();
  } catch (err) {
    console.error("verifyToken error:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
};