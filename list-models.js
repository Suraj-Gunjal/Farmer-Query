// List available Gemini models
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");

// Parse GEMINI_API_KEY
const lines = envContent.split("\n");
let GEMINI_API_KEY;

for (const line of lines) {
  if (line.trim().startsWith("GEMINI_API_KEY=")) {
    GEMINI_API_KEY = line.split("=")[1].trim();
    break;
  }
}

console.log("🔍 Listing available Gemini models...\n");

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error:", data.error?.message || data);
      return;
    }

    console.log("Available models with vision support:\n");

    data.models?.forEach((model) => {
      const supportsVision =
        model.supportedGenerationMethods?.includes("generateContent");
      const hasVision =
        model.name?.includes("vision") ||
        model.name?.includes("1.5") ||
        model.name?.includes("2.0");

      if (supportsVision) {
        console.log(`✅ ${model.name}`);
        console.log(`   Display Name: ${model.displayName}`);
        console.log(
          `   Supported Methods: ${model.supportedGenerationMethods?.join(
            ", "
          )}`
        );
        console.log("");
      }
    });
  } catch (error) {
    console.error("❌ Failed to list models:", error.message);
  }
}

listModels();
