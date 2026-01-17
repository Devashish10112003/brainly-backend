import { getTranscriptFromPython } from "../utils/getYoutubeTranscript.js";

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

export async function getYouTubeContent(url:string,summarize: (text: string) => Promise<string>):Promise<string|null>{
    const videoId = getYouTubeId(url);
    if(!videoId) return null;

    try {
        const transcriptText = await getTranscriptFromPython(videoId);
        const summary = await summarize(transcriptText);
        return summary;
    } catch (err) {
        console.warn("Transcript / summarization failed:", err);
        return null;
    }
}