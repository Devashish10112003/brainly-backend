import dotenv from "dotenv";
dotenv.config();

import { initVectorStore as initEmbedStore, embedAndStoreContent } from "./embedContent";
import { initVectorStore as initQueryStore, queryAndAskGemini } from "./queryAndAskGemini";

async function runTest() {
  // 1. Init for embedding
  await initEmbedStore();

  // 2. Embed new content (simulate a row inserted into PostgreSQL)
  const contentId = "doc_001"; // should be string
  const title = "LangChain Qdrant Integration";
  const description = "Learn how to integrate LangChain with Qdrant and HuggingFace in a Node.js project.";
  const url = "https://example.com/langchain-qdrant";

  await embedAndStoreContent(title, description, url, contentId);

  // 3. Init for querying
  await initQueryStore();

  // 4. Ask a question
  await queryAndAskGemini("How do I use LangChain with Qdrant?");
}

runTest().catch((err) => console.error("❌ Test error:", err));
