import Groq from "groq-sdk";
import { HfInference } from "@huggingface/inference";
import { QdrantClient } from "@qdrant/js-client-rest";
import { Client } from "twitter-api-sdk";
import { getTranscriptFromPython } from "./getYoutubeTranscript.js";
import { ENV_VARS } from "../config/envVars.js";
import ogs from "open-graph-scraper";

const groq = new Groq({
    apiKey: ENV_VARS.GROQ_API_KEY,
  });

const hf = new HfInference(ENV_VARS.HUGGINGFACEHUB_ACCESS_TOKEN);

const qdrant = new QdrantClient({
  url: ENV_VARS.QDRANT_URL,
});

const COLLECTION_NAME = "contentEmbeddings";
const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";

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

function getTweetIdFromUrl(url: string): string | null {
  try 
  {
    const parsed = new URL(url);
    if (parsed.hostname.includes("twitter.com") || parsed.hostname.includes("x.com")) 
    {
      const parts = parsed.pathname.split("/");
      return parts.find((part) => /^\d{10,}$/.test(part)) || null;
    }
  } 
  catch 
  {
    throw new Error("Error extracting the tweet id");
  }
  return null;
}

function getYouTubeId(url: string): string | null {
  try 
  {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1);
    if (parsed.hostname.includes("youtube.com")) return new URLSearchParams(parsed.search).get("v");
  } 
  catch 
  {
    throw new Error("Error extracting youtube video id");
  }
  return null;
}

export async function summarizeWithLLM(text:string) {

  const prompt = `You are a helpful summarization assistant. Summarize the following content in a concise and informative way, keeping it roughly as long as a tweet (280 characters max):
    Content:
    ${text}
  `;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "user", content: prompt }
    ],
    max_tokens: 150,
    temperature: 0.4,
  });
  
  return response.choices[0]?.message?.content?.trim() || "";

}

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

    search: async (queryVector: number[], limit = 5) => {
      const results = await qdrant.search(COLLECTION_NAME, {
        vector: queryVector,
        limit,
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

export async function embedAndStoreContent(
  title: string,
  description: string,
  url: string | undefined,
  type: string,
  contentId: string,
  vectorStore: VectorStore
) {
  if (!vectorStore) {
    throw new Error("Vector store not initialized. Call initVectorStore() first.");
  }

  url ||= "";
  let content = `${title}\n${description}`; // fallback

  // ───────────────────── TWEET ─────────────────────
  if (type === "TWEET") {
    try {
      const tweetId = getTweetIdFromUrl(url);

      if (tweetId) {
        const client = new Client(ENV_VARS.TWEETER_BEARER_TOKEN);

        const response = await client.tweets.findTweetById(tweetId, {
          "tweet.fields": ["text", "author_id"],
          expansions: ["author_id"],
          "user.fields": ["username", "name"],
        });

        const tweetText = response.data?.text || "";
        const authorId = response.data?.author_id;
        const user = response.includes?.users?.find(
          (u) => u.id === authorId
        );
        const username = user?.username || "unknown";

        content = `@${username}: ${tweetText}`;
        console.log(content);
      }
    } catch (error) {
      console.warn("Tweet fetch failed:", error);
    }
  }

  // ───────────────────── VIDEO ─────────────────────
  else if (type === "VIDEO") {
    const videoId = getYouTubeId(url);
    if (videoId) {
      try {
        const transcriptText = await getTranscriptFromPython(videoId);
        const summary = await summarizeWithLLM(transcriptText);
        content = summary;
      } catch (err) {
        console.warn("Transcript / summarization failed:", err);
      }
    }
  }

  // ───────────────────── LINK ─────────────────────
  else if (type === "LINK") {
    try {
      const ogRes = await ogs({ url });
      if (ogRes.result.success) {
        const ogTitle = ogRes.result.ogTitle || title;
        const ogDesc = ogRes.result.ogDescription || description;

        const summary = await summarizeWithLLM(
          `${ogTitle}\n${ogDesc}`
        );

        content = summary;
      }
    } catch {
      console.warn("Open Graph scraping failed, using fallback.");
    }
  }

  // ───────────────────── EMBED & STORE ─────────────────────
  const embedding = await vectorStore.embedText(content);

  await vectorStore.upsert(contentId, embedding, {
    title,
    description,
    url,
    type,
    contentId,
    content,
    createdAt: new Date().toISOString(),
  });
}

export async function queryAndAskLLM(userQuery:string,vectorStore:VectorStore){
if (!vectorStore) {
    throw new Error("Vector store not initialized. Call initVectorStore() first.");
  }

  const retrievalQuery = `Represent this sentence for retrieval: ${userQuery}`;
  const queryEmbedding = await vectorStore.embedText(retrievalQuery);

  const results = await vectorStore.search(queryEmbedding, 4);

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

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 400,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

