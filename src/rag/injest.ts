import type { VectorStore } from "../types/vectorStoreType.js";
import {groqClient} from "../infra/llm/groqClient.js"
import { getTwitterContent } from "../content/getTwitterContent.js";
import { getYouTubeContent } from "../content/getYouTubeContent.js";
import { getLinkContent } from "../content/getLinkContent.js";

type ContentType = "TWEET" | "VIDEO" | "LINK" | "NOTE";

export async function summarizeWithLLM(text:string) {

  const prompt = `You are a helpful summarization assistant. Summarize the following content in a concise and informative way, keeping it roughly as long as a tweet (280 characters max):
    Content:
    ${text}
  `;

  const response = await groqClient.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "user", content: prompt }
    ],
    max_tokens: 150,
    temperature: 0.4,
  });
  
  return response.choices[0]?.message?.content?.trim() || "";

}


export async function embedAndStoreContent(
  title: string,
  description: string,
  url: string | undefined,
  type: ContentType,
  contentId: string,
  userId: string,
  vectorStore: VectorStore
) {
  if (!vectorStore) {
    throw new Error("Vector store not initialized. Call initVectorStore() first.");
  }

  url ||= "";
  let content = `${title}\n${description}`; // fallback

  if (type === "TWEET") {
    content = (await getTwitterContent(url)) ?? content;
  }
  else if (type === "VIDEO") {
    content = (await getYouTubeContent(url,summarizeWithLLM)) ?? content;
  }
  else if (type === "LINK") {
    content = (await getLinkContent(url,title,description,summarizeWithLLM)) ?? content;
  }

  content = content.trim();
  if (!content) return;

  const embedding = await vectorStore.embedText(content);

  await vectorStore.upsert(contentId, embedding, {
    title,
    description,
    url,
    type,
    contentId,
    content,
    userId,
    createdAt: new Date().toISOString(),
  });
}

