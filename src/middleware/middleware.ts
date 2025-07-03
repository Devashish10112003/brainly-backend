import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";
import { Request,Response,NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

interface JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    export interface Request {
      userId: string;
    }
  }
}

const client=new PrismaClient();

export async function middleware(req:Request,res:Response,next:NextFunction)
{
    try{
        const token=req.cookies['jwt-second-brain'];

        if(!token)
        {
            res.status(401).json({success:false,message:"unauthorized - No token provided"});
            return;
        }

        const decoded = jwt.verify(token,ENV_VARS.JWT_SECRET) as JwtPayload;

        
        const user=await client.user.findUnique({
            where:{
                id:decoded.userId,
            }
        })
        
        if(!user)
        {
            res.status(404).json({success:false, message:"User not found"});
            return;
        }

        req.userId=user.id;

        next();

    }
    catch(error)
    {
        console.log("Error in protectRoute middleware : ",error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
}
