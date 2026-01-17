import dotenv from "dotenv";

dotenv.config();

function getEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const ENV_VARS = {
  PORT: process.env.PORT || "5000", // PORT can be optional or default
  JWT_SECRET: getEnvVariable("JWT_SECRET"),
  TWEETER_BEARER_TOKEN:getEnvVariable("TWEETER_BEARER_TOKEN"),
  HUGGINGFACEHUB_ACCESS_TOKEN:getEnvVariable("HUGGINGFACEHUB_ACCESS_TOKEN"),
  QDRANT_URL:getEnvVariable("QDRANT_URL"),
  QDRANT_API_KEY:getEnvVariable("QDRANT_API_KEY"),
  GROQ_API_KEY:getEnvVariable("GROQ_API_KEY")  
};
