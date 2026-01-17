import { HfInference } from "@huggingface/inference";
import { ENV_VARS } from "../../config/envVars.js";

export const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";

export const hf = new HfInference(ENV_VARS.HUGGINGFACEHUB_ACCESS_TOKEN);
