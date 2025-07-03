import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "langchain/document";

export async function initVectorStore() 
{

  const embeddings = new HuggingFaceInferenceEmbeddings({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    apiKey: process.env.HUGGINGFACEHUB_ACCESS_TOKEN,
  });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url:process.env.QDRANT_URL,
    collectionName: "contentEmbeddings"  
  });

  console.log("Vector store initialized");
  
  return vectorStore;

}

export async function embedAndStoreContent(title: string, description: string, url: string,contentId:string,vectorStore: QdrantVectorStore) 
{

  if (!vectorStore) 
  {
    throw new Error("Vector store not initialized. Call initVectorStore() first.");
  }

  const content = `${title}\n${description}`;
  const doc : Document = {
    pageContent: content,
    metadata: { title, url,contentId },
  };

  await vectorStore.addDocuments([doc]);
  console.log("Content embedded and stored.");
}

export async function queryAndAskGemini(userQuery: string,vectorStore: QdrantVectorStore) 
{
  
  if (!vectorStore) 
  {
    throw new Error("Vector store not initialized. Call initVectorStore() first.");
  }

  const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-pro",
    apiKey: process.env.GOOGLE_API_KEY!,
  });

  const instruction = "Represent this sentence for retrieval: " + userQuery;
  const relevantDocs = await vectorStore.similaritySearch(instruction, 4);

  const context = relevantDocs.map((doc) => doc.pageContent).join("\n---\n");

  const prompt = `
    You are an expert AI assistant. Based on the following context, answer the user's question:

    Context:
    ${context}

    Question:
    ${userQuery}
    `;

  const chain = RunnableSequence.from([
    async () => prompt,
    gemini,
    new StringOutputParser(),
  ]);

  const result = await chain.invoke({});
  console.log("Gemini Answer:\n", result);
}