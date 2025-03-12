import { randomBytes } from "crypto";
import { existsSync, readFileSync, writeFileSync, appendFileSync } from "fs";
import { resolve } from "path";

function generateJWTSecret(): string {
  return randomBytes(128).toString("hex");
}

function createEnvFileWithJWTSecret(): void {
  const envPath = resolve(process.cwd(), ".envs");
  let envContent = "";

  try {
    // Check if .env exists
    if (existsSync(envPath)) {
      envContent = readFileSync(envPath, "utf-8");
    } else {
      console.log("Creating new .env file...");
      writeFileSync(envPath, "");
    }

    // Check if JWT_SECRET already exists
    const hasJwtSecret = envContent
      .split("\n")
      .some((line) => line.startsWith("JWT_SECRET="));

    if (!hasJwtSecret) {
      const secret = generateJWTSecret();
      const secretLine = `\nJWT_SECRET=${secret}\n`;

      console.log("Adding JWT_SECRET to .env file");
      appendFileSync(envPath, secretLine);
      console.log("JWT secret successfully generated and added!");
    } else {
      console.log("JWT_SECRET already exists in .env - skipping generation");
    }
  } catch (error) {
    console.error("Error handling .env file:", error);
    process.exit(1);
  }
}

createEnvFileWithJWTSecret();
