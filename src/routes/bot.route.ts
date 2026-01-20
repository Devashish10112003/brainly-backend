import express from "express";
import { askBot } from "../controllers/bot.controller.js";
import { middleware } from "../middleware/middleware.js";

const router = express.Router();

// Protect the bot route so we always have req.userId for filtering
router.post("/ask", middleware, askBot);

export default router;