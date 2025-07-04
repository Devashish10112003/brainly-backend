import express from "express";
import { askBot } from "../controllers/bot.controller.js";

const router=express.Router();

router.post("/ask",askBot);

export default router;