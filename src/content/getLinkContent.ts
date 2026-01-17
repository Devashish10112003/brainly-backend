import ogs from "open-graph-scraper";

export async function getLinkContent(url:string,title:string,description:string,summarize: (text: string) => Promise<string>):Promise<string|null>{
    try {
        
        const ogRes = await ogs({ url });
        if (!ogRes.result.success) return null;
        const ogTitle = ogRes.result.ogTitle || title;
        const ogDesc = ogRes.result.ogDescription || description;
  
        const summary = await summarize(
            `${ogTitle}\n${ogDesc}`
        );
  
        return summary;
      } catch {
        console.warn("Open Graph scraping failed, using fallback.");
        return null;
      }
}