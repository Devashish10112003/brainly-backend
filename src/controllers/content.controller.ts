import { Request,Response } from "express"
import { PrismaClient } from "@prisma/client";
import { addContentSchema, deleteContentSchema } from "../types/index.js";
import { getVectorStore } from "../rag/getVectorStore.js";
import { embedAndStoreContent } from "../rag/injest.js";

const client = new PrismaClient();
const vectorStore=await getVectorStore();


export async function addContent(req:Request,res:Response){

    try
    {
        const parsedData=addContentSchema.safeParse(req.body);

        if(!parsedData.success)
        {
            console.log("Insufficient Data");
            res.status(400).json({messag:"Not enough details provided"});
            return;
        }

        const {title,body,url,type}=parsedData.data;
        let content:any;

        if(type=="NOTE")
        {
            content=await client.content.create({
                data:{
                    userId:req.userId,
                    title:title,
                    body:body,
                    type:type,
                }
            })
        }
        else{
            content=await client.content.create({
                data:{
                    userId:req.userId,
                    title:title,
                    body:body,
                    url:url,
                    type:type,
                }
            })
        }

        try{
            await embedAndStoreContent(
                title,
                body,
                url,
                type,
                String(content.id),
                req.userId,
                vectorStore
            );
        }
        catch(error)
        {
            console.log(error);
        }

        
        res.status(200).json({success:true,message:"Content added successfully",contentId:content.id});
        return;
    }
    catch(error)
    {
        res.status(500).json({success:false,message:"Problem in addcontent handler",error:error});
        return;
    }
}

export async function getAllContent(req:Request,res:Response){
    
    try
    {    
        const userId=req.userId;
        
        const contents=await client.content.findMany({
            where:{
                userId:userId,
            }
        })

        res.status(200).json({success:true,message:"Got contents successfully",contents:contents});
        return;
    }
    catch(error)
    {
        res.status(500).json({success:true,message:"Porblem in getAllContent handler",error:error});
        return;
    }
    
}

export async function deleteContent(req:Request,res:Response){
    try
    {
        const userId=req.userId;
        const parsedData=deleteContentSchema.safeParse(req.body);

        if(!parsedData.success)
        {
            console.log("Insufficient Data");
            res.status(400).json({messag:"ContentID was not provided"});
            return;
        }

        const content=await client.content.delete({
            where:{
                id:parsedData.data.contentId,
                userId:userId
            }
        })

        try{
            await vectorStore.delete(content.id);
        }
        catch(error)
        {
            console.log(error);
        }

        res.status(200).json({success:true,message:"Content Deleted Successfully",contentId:content.id});
        return;
    }
    catch(error)
    {
        res.status(500).json({success:false,message:"Error in deleteContent handler",error:error});
        return;
    }
}