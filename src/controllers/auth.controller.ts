import { Request,Response } from "express"
import { PrismaClient } from "@prisma/client";
import { LoginSchema, SignupSchema } from "../types/index.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookies } from "../utils/generateToken.js";

const client = new PrismaClient();


export async function signup(req:Request,res:Response){

    try
    {
        const parsedData=SignupSchema.safeParse(req.body);

        if(!parsedData.success)
        {
            console.log("Invalid Credentials");
            res.status(400).json({messag:"Validation failed invalid credentials"});
            return;
        }

        const { email, password, username} = parsedData.data;

        const existingUser=await client.user.findFirst({
            where:{
                OR:[
                    {email:email},
                    {username:username},
                ]
                
            },
        })

        if(existingUser?.email==email)
        {
            console.log("User Already exists with this email");
            res.status(400).json({messag:"User already exists with this email"});
            return;   
        }

        if(existingUser?.username==username)
        {
            console.log("User Already exists with this username");
            res.status(400).json({messag:"User already exists with this username"});
            return;   
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const User=await client.user.create({
                data : { 
                    username:username,
                    email:email,
                    password:hashedPassword
                }
            })

        generateTokenAndSetCookies(User.id,res);

        res.status(201).json({
            success:true,
            userId:User.id
        })

    }
    catch(error)
    {
        console.log("Error in signup ",error);
        res.status(500).json({success:false,message:"Internal server error",error:error});
    }
}

export async function login(req:Request,res:Response){

    try
    {
        const parsedData=LoginSchema.safeParse(req.body);
        if(!parsedData.success)
        {
            console.log("Invalid Credentials");
            res.status(400).json({messag:"Validation failed invalid credentials"});
            return;
        }

        const { password, username} = parsedData.data;

        const User=await client.user.findFirst({
            where:{
                username:username,
            }
        })

        if(!User)
        {
            console.log("Invalid Credentials");
            res.status(400).json({success:false, messag:"Validation failed invalid credentials"});
            return;
        }

        const isPasswordCorrect= await bcrypt.compare(password,User.password);

        if(!isPasswordCorrect)
        {
            res.status(400).json({success:false,message:"Invalid credentials"});
            return;
        }

        generateTokenAndSetCookies(User.id,res);
        res.status(200).json({
            success:true,
            user: User.id,
        })
    }
    catch(error)
    {
        console.log("Error in Login ",error);
        res.status(500).json({success:false,message:"Internal server error",error:error});
    }
}

export async function getUser(req:Request,res:Response){
    try
    {
        const userId=req.userId;
        const user=await client.user.findUnique({
            where:{id:userId},
            select:{
                username:true,
                email:true,
            }
        });

        if(!user)
        {
            res.status(404).json({success:false,message:"User not found"});
            return;
        }

        res.status(200).json({success:true,user:user});
    }
    catch(error)
    {
        console.log("Error in getUser controller",error);
        res.status(500).json({success:false,message:"Internal server error",error:error});
    }
}

export function logout(req:Request,res:Response){
    try
    {
        res.clearCookie("jwt-second-brain");
        res.status(200).json({success:true,message:"Logged out succesfully"});
    }
    catch(error)
    {
        console.log("Error in logout controller",error);
        res.status(500).json({success:false,message:"Internal server error",error:error});
    } 
}