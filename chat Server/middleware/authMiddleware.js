// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { user as User } from "../models/User.js";

/**
 * Protect routes - Verify JWT token and attach user to request
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token from Bearer header
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      // Or get from cookies
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this route",
        code: "NO_TOKEN",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (exclude password)
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User no longer exists",
          code: "USER_NOT_FOUND",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          error: "Account has been deactivated",
          code: "ACCOUNT_DEACTIVATED",
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          error: "Invalid token",
          code: "INVALID_TOKEN",
        });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          error: "Token expired",
          code: "TOKEN_EXPIRED",
        });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Optional auth - Attach user if token exists, but don't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
    }
    
    next();
  } catch (error) {
    // Don't throw error, just continue without user
    next();
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Generate refresh token (longer expiry)
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  });
};