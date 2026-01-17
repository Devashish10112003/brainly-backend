import { initVectorStore } from "./queryAndAskLLM.js";

type VectorSearchResult<TPayload = any> = {
  id: string | number;
  score: number;
  payload?: TPayload;
};

type VectorStore<TPayload = any> = {
  embedText: (text: string) => Promise<number[]>;
  upsert: (id: string, vector: number[], payload?: any) => Promise<void>;
  search: (vector: number[], limit?: number) => Promise<VectorSearchResult<TPayload>[]>;
  delete: (id: string | number) => Promise<void>;
};

let vectorStoreInstance:VectorStore;

export async function getVectorStore() {
  if (!vectorStoreInstance) {
    vectorStoreInstance = await initVectorStore();
  }
  return vectorStoreInstance;
}
