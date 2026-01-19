import express  from "express";
import { login,signup,logout,getUser } from "../controllers/auth.controller.js";
import { middleware } from "../middleware/middleware.js";

const router=express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);
router.get('/user',middleware,getUser);

export default router;