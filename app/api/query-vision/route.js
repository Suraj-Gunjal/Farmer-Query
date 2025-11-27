// app/api/query-vision/route.js (Using Google Gemini Vision for Plant Disease Detection)

export async function POST(request) {
  try {
    console.log("🔍 Vision API called");

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY is not set in environment variables");
      return Response.json(
        {
          error:
            "Gemini API key not configured. Please set GEMINI_API_KEY in .env.local to enable image analysis.",
          hint: "Get your free API key from https://makersuite.google.com/app/apikey",
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();

    const { query, image, mimeType, language } = body;

    console.log("📋 Request details:", {
      hasQuery: !!query,
      hasImage: !!image,
      imageLength: image?.length,
      mimeType,
      language,
    });

    if (!image) {
      console.error("❌ No image in request");
      return Response.json({ error: "Image is required" }, { status: 400 });
    }

    // Determine response language instruction
    const languageInstruction =
      language === "ml"
        ? "You MUST respond in Malayalam language. Use Malayalam script (മലയാളം) for your entire response including all sections."
        : "If the query is in Malayalam, respond in Malayalam. Otherwise, respond in English.";

    // Create enhanced prompt for plant disease detection in Kerala
    const systemPrompt =
      "You are an expert plant pathologist and agricultural advisor specializing in Kerala, India farming. " +
      "Analyze the provided plant image and provide a CONCISE response in PLAIN TEXT (no markdown symbols like #, *, -) with:\n\n" +
      "🌿 Plant Identification\n" +
      "Identify the plant species (1-2 lines)\n\n" +
      "🔍 Diagnosis\n" +
      "Main issue detected (2-3 lines)\n\n" +
      "💊 Immediate Treatment\n" +
      "Organic Solution (Priority):\n" +
      "• Primary remedy with exact dosage (e.g., Neem oil: 5ml/liter water)\n" +
      "• Application method\n\n" +
      "Chemical Option (if severe):\n" +
      "• Product name and dosage\n" +
      "• Safety note\n\n" +
      "🛡️ Prevention Tips\n" +
      "• 2-3 key preventive measures\n" +
      "• Best timing for Kerala climate\n\n" +
      "IMPORTANT: Do NOT use markdown symbols (no #, **, -, *). Use emoji headers and bullet points (•) only. " +
      "Keep ENTIRE response under 200 words. Be direct and actionable. " +
      languageInstruction +
      "\n\n" +
      (query ? `User Query: ${query}\n\n` : "") +
      "Analyze the image:";

    // Try multiple model options for compatibility
    const modelOptions = [
      "gemini-2.5-flash", // Latest stable flash model
      "gemini-2.0-flash", // 2.0 Flash stable
      "gemini-flash-latest", // Generic latest
      "gemini-2.0-flash-lite", // Lighter version
      "gemini-2.5-flash-lite", // Latest lite version
    ];

    let response;
    let lastError;
    let usedModel;

    // Try each model until one works
    for (const modelName of modelOptions) {
      try {
        console.log(`🔄 Trying model: ${modelName}`);
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                      text: systemPrompt,
                    },
                    {
                      inline_data: {
                        mime_type: mimeType || "image/jpeg",
                        data: image,
                      },
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.4,
                topK: 32,
                topP: 0.95,
                maxOutputTokens: 2048,
              },
              safetySettings: [
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_NONE",
                },
                {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_NONE",
                },
                {
                  category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                  threshold: "BLOCK_NONE",
                },
                {
                  category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                  threshold: "BLOCK_NONE",
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            `❌ ${modelName} failed:`,
            errorData.error?.message || errorData
          );

          // Check for quota exceeded error
          if (
            errorData.error?.message?.includes("quota") ||
            errorData.error?.message?.includes("Quota exceeded")
          ) {
            throw new Error(
              "Gemini API quota exceeded. Please check your billing details or wait for quota reset. Visit https://ai.google.dev/gemini-api/docs/rate-limits for more info."
            );
          }

          lastError = new Error(
            `${modelName}: ${errorData.error?.message || "Unknown error"}`
          );
          continue; // Try next model
        }

        // Success! Break out of loop
        console.log(`✅ Success with model: ${modelName}`);
        usedModel = modelName;
        break;
      } catch (error) {
        console.error(`❌ ${modelName} threw error:`, error.message);
        lastError = error;
        continue; // Try next model
      }
    }

    // If all models failed, throw the last error
    if (!response || !response.ok) {
      console.error("❌ All models failed. Last error:", lastError);
      throw lastError || new Error("All Gemini models failed to respond");
    }

    const data = await response.json();

    // Check if response was blocked
    if (data.candidates?.[0]?.finishReason === "SAFETY") {
      throw new Error(
        "Image analysis was blocked by safety filters. Please try a different image."
      );
    }

    // Check if we got valid candidates
    if (!data.candidates || data.candidates.length === 0) {
      console.error(
        "❌ No candidates in response:",
        JSON.stringify(data, null, 2)
      );
      throw new Error(
        "No analysis results returned. The image might not be suitable for analysis."
      );
    }

    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated";

    return Response.json({
      response: aiResponse,
      success: true,
      model: usedModel || "gemini-vision",
      analysisType: "plant-disease-detection",
    });
  } catch (error) {
    console.error("Vision API Error:", error);

    // Provide specific error messages based on error type
    let userMessage = "Failed to analyze image";
    let hint = "Please try again or check console for details";

    if (error.message.includes("API error")) {
      userMessage = error.message;
      hint =
        "Your Gemini API key might be invalid. Get a new key from https://makersuite.google.com/app/apikey";
    } else if (error.message.includes("safety filters")) {
      userMessage = error.message;
      hint = "Try taking a clearer photo in better lighting";
    } else if (
      error.message.includes("NetworkError") ||
      error.message.includes("fetch failed")
    ) {
      userMessage = "Network error - cannot reach Gemini API";
      hint = "Check your internet connection and try again";
    } else if (error.message.includes("API key not configured")) {
      userMessage = error.message;
      hint = "Add GEMINI_API_KEY to .env.local file";
    }

    return Response.json(
      {
        error: userMessage,
        details: error.message,
        hint: hint,
      },
      { status: 500 }
    );
  }
}
