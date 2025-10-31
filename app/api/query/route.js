// app/api/query/route.js (Using Groq - FREE and FAST)

export async function POST(request) {
  try {
    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY is not set in environment variables");
      return Response.json(
        {
          error:
            "API key not configured. Please set GROQ_API_KEY in .env.local",
        },
        { status: 500 }
      );
    }

    // Parse request body
    const { query, language } = await request.json();

    if (!query || query.trim() === "") {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    // Determine response language instruction
    const languageInstruction =
      language === "ml"
        ? "You MUST respond in Malayalam language. Use Malayalam script (മലയാളം) for your entire response."
        : "If the query is in Malayalam, respond in Malayalam. Otherwise, respond in English.";

    // Create prompt for farming advice with Kerala-specific context
    const messages = [
      {
        role: "system",
        content:
          "You are an expert agricultural advisor specializing in Kerala, India farming practices. You have deep knowledge of:\n" +
          "- Kerala's tropical climate, monsoon patterns, and seasonal variations\n" +
          "- Major crops: rice (paddy), coconut, rubber, tea, coffee, spices (pepper, cardamom, ginger), vegetables, and fruits (banana, mango, jackfruit)\n" +
          "- Organic farming methods and sustainable agriculture\n" +
          "- Soil health management in laterite and alluvial soils common in Kerala\n" +
          "- Pest and disease management using both traditional and modern methods\n" +
          "- Water management and irrigation techniques\n" +
          "- Government schemes and support for Kerala farmers\n\n" +
          "Provide practical, accurate, and helpful advice in a friendly tone. " +
          languageInstruction +
          " " +
          "Keep responses concise (3-5 sentences) unless detailed explanation is needed. " +
          "Always prioritize sustainable and economical solutions suitable for Kerala's small-scale farmers.",
      },
      {
        role: "user",
        content: query,
      },
    ];

    // Call Groq API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Free, fast, and powerful
          messages: messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Groq API error: ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return Response.json({
      response: aiResponse,
      success: true,
    });
  } catch (error) {
    console.error("API Error:", error);

    return Response.json(
      {
        error: "Failed to generate advice",
        details: error.message,
        hint: "Check server logs for more details",
      },
      { status: 500 }
    );
  }
}

// ===================================
// FOR PAGES ROUTER (pages/api/query.js)
// ===================================
/*
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY is not set in environment variables');
      return res.status(500).json({
        error: 'API key not configured. Please set GROQ_API_KEY in .env.local'
      });
    }

    const { query } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log('📝 Received query:', query);

    const messages = [
      {
        role: 'system',
        content: 'You are an agricultural expert assistant helping farmers with their queries. Provide practical, accurate, and helpful advice.'
      },
      {
        role: 'user',
        content: query
      }
    ];

    console.log('🤖 Calling Groq API...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('✅ Response generated successfully');

    return res.status(200).json({
      response: aiResponse,
      success: true
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({
      error: 'Failed to generate advice',
      details: error.message,
      hint: 'Check server logs for more details'
    });
  }
}
*/
