// app/api/query-gemini/route.js (Using Google Gemini)

export async function POST(request) {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY is not set in environment variables");
      return Response.json(
        {
          error:
            "API key not configured. Please set GEMINI_API_KEY in .env.local",
        },
        { status: 500 }
      );
    }

    // Parse request body
    const { query } = await request.json();

    if (!query || query.trim() === "") {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    console.log("📝 Received query:", query);

    // Create enhanced prompt for Kerala farming
    const systemPrompt =
      "You are an expert agricultural advisor specializing in Kerala, India farming practices. You have deep knowledge of:\n" +
      "- Kerala's tropical climate, monsoon patterns, and seasonal variations\n" +
      "- Major crops: rice (paddy), coconut, rubber, tea, coffee, spices (pepper, cardamom, ginger), vegetables, and fruits (banana, mango, jackfruit)\n" +
      "- Organic farming methods and sustainable agriculture\n" +
      "- Soil health management in laterite and alluvial soils common in Kerala\n" +
      "- Pest and disease management using both traditional and modern methods\n" +
      "- Water management and irrigation techniques\n" +
      "- Government schemes and support for Kerala farmers\n\n" +
      "Provide practical, accurate, and helpful advice in a friendly tone. " +
      "If the query is in Malayalam, respond in Malayalam. Otherwise, respond in English. " +
      "Keep responses concise (3-5 sentences) unless detailed explanation is needed. " +
      "Always prioritize sustainable and economical solutions suitable for Kerala's small-scale farmers.\n\n" +
      "User Query: ";

    const fullPrompt = systemPrompt + query;

    console.log("🤖 Calling Gemini API...");

    // Call Gemini API (using standard model name)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Gemini API error: ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    const aiResponse =
      data.candidates[0]?.content?.parts[0]?.text || "No response generated";

    console.log("✅ Response generated successfully");

    return Response.json({
      response: aiResponse,
      success: true,
      model: "gemini-1.5-flash",
    });
  } catch (error) {
    console.error("❌ API Error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });

    return Response.json(
      {
        error: "Failed to generate advice",
        details: error.message,
        hint: "Check server logs for more details. Make sure GEMINI_API_KEY is set in .env.local",
      },
      { status: 500 }
    );
  }
}
