import { Request,Response } from "express"
import { PrismaClient } from "@prisma/client";
import { shareBrainSchema } from "../types/index.js";
import { random } from "../utils/randomHash.js";

const client = new PrismaClient();

export async function shareBrain(req:Request,res:Response){

    try
    {
        const parsedData=shareBrainSchema.safeParse(req.body);
        
        if(!parsedData.success)
        {
            console.log("Insufficient Data");
            res.status(400).json({messag:"Not enough details provided"});
            return;
        }

        const share=parsedData.data.share;
        const userId=req.userId;

        await client.user.update({
            where:{id:userId},
            data:{share:share},
        })

        if(share)
        {
            let exisitingLink=await client.link.findUnique({
                where:{
                    userId:userId,
                }
            });

            if(!exisitingLink)
            {
                const hash=random(10);
                exisitingLink=await client.link.create({
                    data:{
                        hash:hash,
                        userId:userId,
                    }
                })
            }

            res.status(200).json({success:true,message:"Link Shared Successfully",link:`${req.protocol}://${req.get("host")}/api/v1/share/${exisitingLink.hash}` });
            return;
        }
        else
        {
            await client.link.deleteMany({
                where:{
                    userId:userId,
                }
            })
        }
    }
    catch(error)
    {
        res.status(500).json({success:false,message:"Error in sharebrain handler",error:error});
        return;
    }
}

export async function openBrain(req:Request,res:Response){

    try
    {
        const brainLink=req.params.brainLink;
    
        const link=await client.link.findUnique({
            where:{
                hash:brainLink.toString(),
            },
            select:{
                userId:true,
            }
        })

        if(link)
        {
            const contents=await client.content.findMany({
                where:{
                    userId:link.userId,
                }
            })

            res.status(200).json({success:true,message:"Found all the contents",contents:contents});
        }
        else
        {
            res.status(400).json({success:false,message:"The provided link is invalid",error:link});
        }
    }
    catch(error)
    {
        res.status(500).json({success:false,message:"Error in the openBrain handler",error:error});
        return;
    }    
}
