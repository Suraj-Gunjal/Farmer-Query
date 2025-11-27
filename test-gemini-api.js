// Quick test to verify Gemini API key works
// Read .env.local manually
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

console.log("🔑 Testing Gemini API Key...");
console.log("API Key present:", !!GEMINI_API_KEY);
console.log("API Key length:", GEMINI_API_KEY?.length || 0);
console.log("API Key starts with:", GEMINI_API_KEY?.substring(0, 10) + "...");

async function testGeminiAPI() {
  const testModels = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash-lite",
  ];

  for (const testModel of testModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${testModel}:generateContent?key=${GEMINI_API_KEY}`;

    console.log(`\n🧪 Testing model: ${testModel}`);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Say hello",
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          `❌ ${testModel} failed:`,
          data.error?.message || data.error?.status
        );
        continue;
      }

      console.log(
        `✅ ${testModel} works!`,
        data.candidates?.[0]?.content?.parts?.[0]?.text
      );
      console.log(`\n✅ Found working model: ${testModel}`);
      return;
    } catch (error) {
      console.error(`❌ ${testModel} threw error:`, error.message);
    }
  }

  console.error("\n❌ No working models found!");
  process.exit(1);
}

testGeminiAPI();
