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
};
