// src/vectorStore.ts
import { QdrantVectorStore } from "@langchain/qdrant";
import { initVectorStore } from "./queryAndAskGemini.js";

let vectorStoreInstance:QdrantVectorStore;

export async function getVectorStore() {
  if (!vectorStoreInstance) {
    vectorStoreInstance = await initVectorStore();
  }
  return vectorStoreInstance;
}
