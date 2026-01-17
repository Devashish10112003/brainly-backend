// //import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
// //import { QdrantVectorStore } from "@langchain/qdrant";
// //import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// //import {ChatGroq} from "@langchain/groq";
// //import { RunnableSequence } from "@langchain/core/runnables";
// //import { StringOutputParser } from "@langchain/core/output_parsers";
// import { Client } from "twitter-api-sdk";
// //import { Document } from "langchain/document";
// import ogs from "open-graph-scraper";
// import { getTranscriptFromPython } from "./getYoutubeTranscript.js";
// import { ENV_VARS } from "../config/envVars.js";



// function getTweetIdFromUrl(url: string): string | null {
//   try 
//   {
//     const parsed = new URL(url);
//     if (parsed.hostname.includes("twitter.com") || parsed.hostname.includes("x.com")) 
//     {
//       const parts = parsed.pathname.split("/");
//       return parts.find((part) => /^\d{10,}$/.test(part)) || null;
//     }
//   } 
//   catch 
//   {

//   }
//   return null;
// }

// function getYouTubeId(url: string): string | null {
//   try 
//   {
//     const parsed = new URL(url);
//     if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1);
//     if (parsed.hostname.includes("youtube.com")) return new URLSearchParams(parsed.search).get("v");
//   } 
//   catch 
//   {

//   }
//   return null;
// }

// export async function summarizeWithGemini(text: string) {
//   // const gemini = new ChatGoogleGenerativeAI({
//   //   model: "gemini-2.0-flash",
//   //   apiKey: process.env.GOOGLE_API_KEY!,
//   // });

//   // const llm=new ChatGroq({
//   //   model:"llama-3.3-70b-versatile",
//   //   apiKey:process.env.GROQ_API_KEY,
//   // })

//   const prompt = `
//   You are a helpful summarization assistant. Summarize the following content in a concise and informative way, keeping it roughly as long as a tweet (280 characters max):

//   Content:
//   ${text}
//   `;

//   // const chain = RunnableSequence.from([
//   //   async () => prompt,
//   //   llm,
//   //   new StringOutputParser(),
//   // ]);

//   //const summary = await chain.invoke({});
//   //return summary;
// }

// export async function initVectorStore() 
// {

//   // const embeddings = new HuggingFaceInferenceEmbeddings({
//   //   model: "sentence-transformers/all-MiniLM-L6-v2",
//   //   apiKey: process.env.HUGGINGFACEHUB_ACCESS_TOKEN,
//   // });

//   //   const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
//   //   url:process.env.QDRANT_URL,
//   //   collectionName: "contentEmbeddings"  
//   // });

//   console.log("Vector store initialized");
  
//   //return vectorStore;

// }

// export async function embedAndStoreContent(title: string, description: string, url: string|undefined,type:string,contentId:string,vectorStore: QdrantVectorStore) 
// {

//   if (!vectorStore) 
//   {
//     throw new Error("Vector store not initialized. Call initVectorStore() first.");
//   }

//   url ||= "";
//   let content = `${title}\n${description}`; // default fallback

//   if (type === "TWEET") 
//   {
//     try{
//       const tweetId = getTweetIdFromUrl(url);
    
//       if (tweetId) 
//       {
//         const client = new Client(ENV_VARS.TWEETER_BEARER_TOKEN);
        
//         const response = await client.tweets.findTweetById(tweetId, {
//           "tweet.fields": ["text","author_id"],
//           expansions: ["author_id"],
//           "user.fields": ["username", "name"],
//         });


        
//         const tweetText = response.data?.text || "";
//         const authorId = response.data?.author_id;
//         const user = response.includes?.users?.find((u) => u.id === authorId);
//         const username = user?.username || "unknown";

//         // Combine username and tweet for embedding
//         content = `@${username}: ${tweetText}`;
//         console.log(content);

      
//       }
//     }
//     catch(error)
//     {
//       console.warn("tweet thing failed.",error);
//     }
    
//   } 
//   else if (type === "VIDEO") 
//   {
//     const videoId = getYouTubeId(url);
//     if (videoId) 
//     {
//       try 
//       {
//         const transcriptText = await getTranscriptFromPython(videoId);
//         const summary = await summarizeWithGemini(transcriptText);
//         content = summary;        
//       } 
//       catch (err) 
//       {
//         console.warn("Transcript or Gemini summarization failed:", err);
//       }
//     }
//   } 
//   else if(type==="LINK") 
//   {
//     try 
//     {
      
//       const ogRes = await ogs({ url });
//       if (ogRes.result.success) 
//       {
//         const ogTitle = ogRes.result.ogTitle || title;
//         const ogDesc = ogRes.result.ogDescription || description;
//         const summary = await summarizeWithGemini(`${ogTitle}\n${ogDesc}`);

//         content = summary;  
//       }
//     } 
//     catch 
//     {
//       console.warn("Open Graph scraping failed, using fallback.");
//     }
//   }

//   // const doc: Document = {
//   //   pageContent: content,
//   //   metadata: { title, description, url, contentId },
//   // };

//   //await vectorStore.addDocuments([doc], { ids: [contentId] });
// }

// export async function queryAndAskGemini(userQuery: string,vectorStore: any) 
// {
  
//   if (!vectorStore) 
//   {
//     throw new Error("Vector store not initialized. Call initVectorStore() first.");
//   }

//   // const gemini = new ChatGoogleGenerativeAI({
//   //   model: "gemini-2.0-flash",
//   //   apiKey: process.env.GOOGLE_API_KEY!,
//   // });

//   // const llm=new ChatGroq({
//   //   model:"llama-3.3-70b-versatile",
//   //   apiKey:process.env.GROQ_API_KEY,
//   // });

//   const instruction = "Represent this sentence for retrieval: " + userQuery;
//   const relevantDocs = await vectorStore.similaritySearch(instruction, 4);

//   //const context = relevantDocs.map((doc) => doc.pageContent).join("\n---\n");

//   const prompt = `
//     You are an expert AI assistant. Based on the following context, answer the user's question:

//     Context:
//     ${context}

//     Question:
//     ${userQuery}
//     `;

//     console.log("Reaching here or not?");
//   // const chain = RunnableSequence.from([
//   //   llm,
//   //   new StringOutputParser(),
//   // ]);

//   // const result = await chain.invoke(prompt);
//   // console.log("Reaching here or not??");
//   // return result;
// }