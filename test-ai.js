// Test AI Integration
// Run this in browser console or create a test page

async function testGroqAI() {
  console.log("🧪 Testing Groq AI...");

  const testQuery = "What fertilizer should I use for tomato plants in Kerala?";

  try {
    const response = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: testQuery }),
    });

    const data = await response.json();
    console.log("✅ Groq Response:", data);
    return data;
  } catch (error) {
    console.error("❌ Error:", error);
    return null;
  }
}

async function testGeminiAI() {
  console.log("🧪 Testing Gemini AI...");

  const testQuery = "കേരളത്തിൽ തക്കാളി ചെടികൾക്ക് ഏത് വളം ഉപയോഗിക്കണം?";

  try {
    const response = await fetch("/api/query-gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: testQuery }),
    });

    const data = await response.json();
    console.log("✅ Gemini Response:", data);
    return data;
  } catch (error) {
    console.error("❌ Error:", error);
    return null;
  }
}

// Run tests
console.log("🚀 Starting AI Integration Tests...");
console.log("📝 Test 1: Groq AI (English query)");
testGroqAI();

console.log(
  "📝 Test 2: Gemini AI (Malayalam query) - only if GEMINI_API_KEY is set"
);
// Uncomment to test Gemini:
// testGeminiAI();
