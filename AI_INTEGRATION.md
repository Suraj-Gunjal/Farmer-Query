# AI Integration Guide

## Overview

The Kerala Farmer AI Advisory System now supports **two AI providers** for answering farmer queries:

1. **Groq (Default)** - Free, fast, and powerful using Llama 3.3 70B
2. **Google Gemini (Alternative)** - High-quality responses using Gemini 1.5 Flash

## Current Setup

### ✅ Groq AI (Active)

- **Model**: `llama-3.3-70b-versatile`
- **API Route**: `/api/query`
- **Status**: ✅ Configured and ready to use
- **API Key**: Already set in `.env.local`

### 🔧 Google Gemini (Optional)

- **Model**: `gemini-1.5-flash`
- **API Route**: `/api/query-gemini`
- **Status**: ⚙️ Ready (needs API key)
- **API Key**: Add to `.env.local` to activate

## How to Get API Keys

### Groq API Key (Already Configured ✅)

Your Groq API key is already set up and working!

### Google Gemini API Key (Optional)

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add to `.env.local`:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Features

### Kerala-Specific Agricultural Expertise

Both AI models are configured with deep knowledge of:

- **Climate**: Kerala's tropical climate, monsoon patterns, seasonal variations
- **Major Crops**: Rice (paddy), coconut, rubber, tea, coffee, spices, vegetables, fruits
- **Soil Types**: Laterite and alluvial soils common in Kerala
- **Farming Methods**: Organic farming, sustainable agriculture
- **Pest Management**: Traditional and modern pest control methods
- **Water Management**: Irrigation techniques for Kerala's rainfall patterns
- **Government Schemes**: Support programs for Kerala farmers

### Multilingual Support

- **Malayalam**: If query is in Malayalam, AI responds in Malayalam
- **English**: English queries get English responses
- **Auto-detection**: AI automatically detects language

### Response Quality

- **Concise**: 3-5 sentences for quick answers
- **Detailed**: Longer explanations when needed
- **Practical**: Solutions suitable for small-scale farmers
- **Sustainable**: Prioritizes eco-friendly methods
- **Economical**: Cost-effective solutions

## Testing the AI

### Test with Groq (Default)

1. Open the application
2. Navigate to "Ask Your Query" section
3. Try these test queries:

**English:**

```
What fertilizer should I use for tomato plants in Kerala?
```

**Malayalam:**

```
കേരളത്തിൽ തക്കാളി ചെടികൾക്ക് ഏത് വളം ഉപയോഗിക്കണം?
```

### Test with Gemini (If configured)

1. Update `QueryForm.tsx` to use `/api/query-gemini` instead of `/api/query`
2. Try the same queries above

## Switching Between AI Providers

### To use Groq (Default):

```typescript
// In QueryForm.tsx
const res = await fetch("/api/query", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: query.trim() }),
});
```

### To use Gemini:

```typescript
// In QueryForm.tsx
const res = await fetch("/api/query-gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: query.trim() }),
});
```

## API Response Format

Both APIs return the same format:

```json
{
  "response": "AI generated response text...",
  "success": true,
  "model": "llama-3.3-70b-versatile" // or "gemini-1.5-flash"
}
```

## Error Handling

The system handles various errors gracefully:

- ❌ Missing API key → Clear error message
- ❌ Network issues → Retry suggestion
- ❌ Invalid query → Validation feedback
- ❌ API rate limits → Friendly notification

All errors are displayed to users in their selected language (English/Malayalam).

## Performance

### Groq (Current)

- ⚡ Response time: ~1-2 seconds
- 💰 Cost: FREE
- 🎯 Rate limit: Generous free tier
- ✅ Reliability: Very high

### Gemini (Alternative)

- ⚡ Response time: ~2-3 seconds
- 💰 Cost: FREE (with limits)
- 🎯 Rate limit: 60 requests/minute (free tier)
- ✅ Reliability: Very high

## Troubleshooting

### "API key not configured" Error

1. Check `.env.local` file exists
2. Verify API key is set correctly
3. Restart the development server: `npm run dev`

### "Failed to generate advice" Error

1. Check internet connection
2. Verify API key is valid
3. Check console for detailed error logs
4. Try the alternative AI provider

### Slow Responses

1. Groq is usually faster - stick with default
2. Check your internet speed
3. Try switching to Gemini if Groq is slow

## Best Practices

1. **Always validate user input** before sending to AI
2. **Show loading states** during AI processing
3. **Handle errors gracefully** with user-friendly messages
4. **Log errors** for debugging
5. **Monitor API usage** to stay within free tier limits

## Future Enhancements

- [ ] Image analysis for plant disease detection
- [ ] Voice input/output support
- [ ] Conversation history
- [ ] Personalized recommendations based on farm location
- [ ] Integration with weather data for context-aware advice
- [ ] Multi-turn conversations for complex queries

## Support

For issues or questions:

- Check console logs (F12 in browser)
- Review API route logs in terminal
- Verify `.env.local` configuration
- Test with simple queries first

---

**Status**: ✅ Groq AI is configured and ready to use!  
**Next Step**: Test the query form with real farming questions!
