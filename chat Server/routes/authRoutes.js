// import express from "express";
// import { checkAuth, login, logout, signup, updateProfile } from "../controller/auth.js";
// import { protectRoute } from "../middleware/auth.middleware.js";

// const router = express.Router();

// router.post("/signup", signup);
// router.post("/login", login);
// router.post("/logout", logout);

// router.put("/update-profile", protectRoute, updateProfile);

// router.get("/check", protectRoute, checkAuth);

// export default router;

// routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
} from "../controllers/auth.js";
import { protect } from "../middleware/authMiddleware.js";
import { rateLimit } from "express-rate-limit";

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    error: "Too many attempts, please try again later",
  },
});

// Public routes
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh-token", refreshToken);

// Protected routes
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.post("/logout", protect, logout);

export default router;