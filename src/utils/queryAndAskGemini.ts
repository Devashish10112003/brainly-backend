import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { QdrantClient } from "@qdrant/js-client-rest";
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Avoid top-level await by deferring initialization
let vectorStore: QdrantVectorStore;

export async function initVectorStore() {
  const embeddings = new HuggingFaceTransformersEmbeddings({
    modelName: "BAAI/bge-base-en",
  });

  const qdrantClient = new QdrantClient({ url: "http://localhost:6333" });

  const collectionName = "content_collection";

  vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    collectionName,
    client: qdrantClient,
  });

  console.log("✅ Vector store initialized");
}

export async function queryAndAskGemini(userQuery: string) {
  if (!vectorStore) {
    throw new Error("❌ Vector store not initialized. Call initVectorStore() first.");
  }

  // Import Gemini-related modules only where needed
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
  console.log("🤖 Gemini Answer:\n", result);
}