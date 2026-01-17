import { initVectorStore } from "../infra/vectorStore/qdrantVectorStore.js";
import type {VectorStore} from "../types/vectorStoreType.js"


let vectorStoreInstance:VectorStore;

export async function getVectorStore() {
  if (!vectorStoreInstance) {
    vectorStoreInstance = await initVectorStore();
  }
  return vectorStoreInstance;
}
