import { QdrantClient } from "@qdrant/js-client-rest";
import { ENV_VARS } from "../../config/envVars.js";
import { hf,EMBEDDING_MODEL } from "../embeddings/huggingFaceEmbeddings.js";

const COLLECTION_NAME = "contentEmbeddings";

export const qdrant = new QdrantClient({
    url: ENV_VARS.QDRANT_URL,
    apiKey:ENV_VARS.QDRANT_API_KEY
});

export async function initVectorStore() {
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(
      (c) => c.name === COLLECTION_NAME
    );
  
    if (!exists) {
      await qdrant.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 384, // all-MiniLM-L6-v2 embedding size
          distance: "Cosine",
        },
      });
    }

    // Ensure there is a payload index on `userId` so we can filter by it
    try {
      await qdrant.createPayloadIndex(COLLECTION_NAME, {
        field_name: "userId",
        field_schema: "keyword",
      });
    } catch {
      // If index already exists, Qdrant will throw; ignore that case
    }
  
    console.log("Vector store initialized");
  
    return {
      embedText: async (text: string): Promise<number[]> => {
        const embedding = await hf.featureExtraction({
          model: EMBEDDING_MODEL,
          inputs: text,
        });
  
        return embedding as number[];
      },
  
      upsert: async (id: string, vector: number[], payload?: any) => {
        await qdrant.upsert(COLLECTION_NAME, {
          wait: true,
          points: [
            {
              id,
              vector,
              payload,
            },
          ],
        });
      },
  
      search: async (queryVector: number[], limit = 5, filter?: unknown) => {
        const results = await qdrant.search(COLLECTION_NAME, {
          vector: queryVector,
          limit,
          // Optional filter, typically used to scope by userId
          filter: filter as any,
        });
  
        return results;
      },
  
      delete: async (id: string | number) => {
        await qdrant.delete(COLLECTION_NAME, {
          wait: true,
          points: [id],
        });
      },
    };
  }