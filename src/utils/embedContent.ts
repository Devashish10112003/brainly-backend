import { Document } from "langchain/document";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { QdrantClient } from "@qdrant/js-client-rest";
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";

// Declare exports here
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

export async function embedAndStoreContent(title: string, description: string, url: string,contentId:string) {
  if (!vectorStore) {
    throw new Error("Vector store not initialized. Call initVectorStore() first.");
  }

  const content = `${title}\n${description}`;
  const doc = new Document({
    pageContent: content,
    metadata: { title, url,contentId },
  });

  await vectorStore.addDocuments([doc]);
  console.log("✅ Content embedded and stored.");
}
