import { Client } from "twitter-api-sdk";
import { ENV_VARS } from "../config/envVars.js";

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

export async function getTwitterContent(url:string):Promise<string|null>{

    const tweetId = getTweetIdFromUrl(url);
    if (!tweetId) return null;

    try {
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
  
          return `@${username}: ${tweetText}`;
      } catch (error) {
        console.warn("Tweet fetch failed:", error);
        return null;
      }
}