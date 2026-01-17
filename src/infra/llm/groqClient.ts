import Groq from "groq-sdk";
import { ENV_VARS } from "../../config/envVars.js";

export const groqClient = new Groq({
    apiKey: ENV_VARS.GROQ_API_KEY,
 });