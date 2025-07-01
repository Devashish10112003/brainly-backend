import express  from "express";
import { login,signup,logout } from "../controllers/auth.controller";

const router=express.Router();

router.get("/",(req,res)=>{
    res.send("Hello");
})
router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);

export default router;