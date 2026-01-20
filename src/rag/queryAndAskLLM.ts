import { groqClient } from "../infra/llm/groqClient.js";
import type { VectorStore } from "../types/vectorStoreType.js";

export async function queryAndAskLLM(userQuery:string,vectorStore:VectorStore,userId:string){
    if (!vectorStore) {
        throw new Error("Vector store not initialized. Call initVectorStore() first.");
      }
      const retrievalQuery = `Represent this sentence for retrieval: ${userQuery}`;
      const queryEmbedding = await vectorStore.embedText(retrievalQuery);
    
      // Scope retrieval to the current user's documents only
      const results = await vectorStore.search(queryEmbedding, 4, {
        must: [
          {
            key: "userId",
            match: { value: userId },
          },
        ],
      });
    console.log(results);
      const context = results
        .map((r: any) => r.payload?.content)
        .filter(Boolean)
        .join("\n---\n");
    
      const prompt = `
        You are an expert AI assistant.
        Answer the user's question using ONLY the provided context.
        If the answer is not in the context, say you don't know.
    
        Context:
        ${context}
    
        Question:
        ${userQuery}
        `;
    
      console.log("Hi there 1");

      const response = await groqClient.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 400,
      });
      
      console.log(response);

      return response.choices[0]?.message?.content?.trim() || "";
    }
    
    