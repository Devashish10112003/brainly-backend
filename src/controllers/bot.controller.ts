import { Request,Response } from "express"
import { getVectorStore } from "../utils/getVectorStore.js";
import { queryAndAskGemini } from "../utils/queryAndAskGemini.js";
import { askBotSchema } from "../types/index.js";

const vectorStore=await getVectorStore();

export async function askBot(req:Request,res:Response){

    try
    {
        const parsedData=askBotSchema.safeParse(req.body);
    
        if(!parsedData.success)
        {
            console.log("Insufficient data");
            res.status(400).json({messag:"Got the wrong message"});
            return;
        }

        const message=parsedData.data.message;
        
        const result=await queryAndAskGemini(message,vectorStore);
        res.status(200).json({success:true,message:"Got the response successfully",result:result});
    }
    catch(error)
    {
        res.status(500).json({success:false,message:"Error in the askBot handler",error:error});
        return;
    }
}