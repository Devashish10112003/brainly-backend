import jwt from "jsonwebtoken";
import  {ENV_VARS}  from "../config/envVars.js";
import { Response } from "express";

export function generateTokenAndSetCookies(userId:String,res:Response){
    const token = jwt.sign({userId},ENV_VARS.JWT_SECRET,{expiresIn: "30d"});

    res.cookie("jwt-second-brain",token,{
        maxAge: 30*24*60*60*1000,
        httpOnly:true,
        sameSite:"none",
        secure: true,
    });

    return token;
}