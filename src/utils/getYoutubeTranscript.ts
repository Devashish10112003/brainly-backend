import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getTranscriptFromPython(videoId: string): Promise<string> {
  const scriptPath = path.resolve(__dirname, "../../pythonScript/get_transcript.py");
  const pythonPath = path.resolve(__dirname, "../../venv/Scripts/python.exe");

  return new Promise((resolve, reject) => {
    const command = `"${pythonPath}" "${scriptPath}" ${videoId}`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Python execution error:", error.message);
        console.error("Stderr:", stderr);
        return reject(error);
      }

      try {
        const parsed = JSON.parse(stdout);
        if (parsed.error) {
          console.error("Python returned an error:", parsed.error);
          return reject(new Error(parsed.error));
        }
        resolve(parsed.transcript);
      } catch (e) {
        console.error("Failed to parse Python output:", stdout);
        return reject(new Error("Failed to parse Python response: " + stdout));
      }
    });
  });
}
