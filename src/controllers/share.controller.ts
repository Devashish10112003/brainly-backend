import { Request,Response } from "express"
import { PrismaClient } from "@prisma/client";
import { shareBrainSchema, shareContentSchema } from "../types/index.js";
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

            res.status(200).json({success:true,message:"Link Shared Successfully",link:`/share/${exisitingLink.hash}` });
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

export async function shareContent(req:Request,res:Response)
{
    try{
        const parsedData=shareContentSchema.safeParse(req.body);
        
        if(!parsedData.success)
        {
            console.log("Insufficient Data");
            res.status(400).json({messag:"No contentId provided"});
            return;
        }

        const userId=req.userId;

        const content=await client.content.update({
            where:{
                id:parsedData.data.contentId,
                userId:userId
            },
            data:{
                share:true,
            },
            select:{
                id:true,
            }
        });

        res.status(200).json({success:true,message:"Shared the content successfully",content:content});
    }
    catch(error){
        res.status(500).json({success:false,message:"Error in shareContent handler",error:error});
        return;
    }
}

export async function openContent(req:Request,res:Response)
{
    try{
        const contentId=req.params.contentId;
        const content=await client.content.findFirst({
            where:{
                id:contentId.toString(),
                share:true,
            },
        });

        if(content==null)
        {
            res.status(400).json({success:false,message:"No content shared with this id"});
        }

        res.status(200).json({success:true,message:"Got the content successfully",content:content});
    }
    catch(error){
        res.status(500).json({success:false,message:"Error in shareContent handler",error:error});
        return;
    }
}
