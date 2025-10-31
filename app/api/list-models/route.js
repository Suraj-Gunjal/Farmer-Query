// app/api/list-models/route.js - List available Gemini models

export async function GET(request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    console.log("📋 Fetching available Gemini models...");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API error: ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();

    // Filter to show only models that support generateContent
    const generateContentModels =
      data.models?.filter((model) =>
        model.supportedGenerationMethods?.includes("generateContent")
      ) || [];

    console.log(
      `✅ Found ${generateContentModels.length} models with generateContent support`
    );

    return Response.json({
      success: true,
      totalModels: data.models?.length || 0,
      generateContentModels: generateContentModels.map((m) => ({
        name: m.name,
        displayName: m.displayName,
        description: m.description,
        supportedMethods: m.supportedGenerationMethods,
        inputTokenLimit: m.inputTokenLimit,
        outputTokenLimit: m.outputTokenLimit,
      })),
    });
  } catch (error) {
    console.error("❌ Error listing models:", error);
    return Response.json(
      {
        error: "Failed to list models",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
