import { exec } from "child_process";
import path from "path";

export function getTranscriptFromPython(videoId: string): Promise<string> {
  const scriptPath = path.resolve(__dirname, "get_transcript.py"); // adjust if in different folder

  return new Promise((resolve, reject) => {
    exec(`python venv/Scripts/python.exe ${scriptPath} ${videoId}`, (error, stdout, stderr) => {
      if (error) {
        console.error("Python error:", error);
        return reject(error);
      }

      try {
        const parsed = JSON.parse(stdout);
        if (parsed.error) {
          return reject(new Error(parsed.error));
        }
        resolve(parsed.transcript);
      } catch (e) {
        reject(new Error("Failed to parse Python response: " + stdout));
      }
    });
  });
}
