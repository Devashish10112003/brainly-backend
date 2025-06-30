import { Request,Response } from "express"
import { PrismaClient } from "@prisma/client";
import { shareBrainSchema } from "../types";

const client = new PrismaClient();

export function shareBrain(req:Request,res:Response){
    
    const parsedData=shareBrainSchema.safeParse(req.body);

    

}

export function openBrain(req:Request,res:Response){
    
}
