import express from "express";
import { protect as protectRoute } from "../middleware/authMiddleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;
