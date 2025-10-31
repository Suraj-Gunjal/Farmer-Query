# 🖼️ Plant Image Analysis Feature

## Overview

The image upload feature enables **AI-powered plant disease detection and diagnosis** using Google Gemini Vision. This is **extremely useful** for:

- 🔍 Identifying plant diseases from photos
- 🐛 Detecting pests and infestations
- 🍃 Diagnosing nutritional deficiencies
- 🌱 Assessing overall plant health
- 💊 Getting specific treatment recommendations

## ✅ What Makes It Useful

### 1. **Visual Diagnosis**

Farmers can simply take a photo of their diseased plant and get instant diagnosis, rather than trying to describe symptoms in text.

### 2. **Accurate Identification**

AI can identify:

- Plant species
- Specific diseases (leaf spot, blight, rust, etc.)
- Pest damage patterns
- Nutrient deficiencies (yellowing, stunted growth)
- Environmental stress (water, temperature)

### 3. **Kerala-Specific Recommendations**

The AI provides treatments tailored for:

- Kerala's tropical climate
- Monsoon season considerations
- Local organic remedies (neem, turmeric, cow urine)
- Chemical options safe for small-scale farming
- Timing based on Kerala's weather patterns

### 4. **Comprehensive Analysis**

Each image analysis includes:

- Plant identification
- Health assessment
- Disease/pest detection
- Symptom analysis
- Diagnosis
- Treatment recommendations
- Cultural practices
- Preventive measures

## 🚀 How to Enable

### Step 1: Get Gemini API Key (FREE)

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key

### Step 2: Add to Environment

Open `.env.local` and add:

```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### Step 3: Restart Server

```bash
npm run dev
```

## 📱 How to Use

### For Farmers:

1. **Navigate to "Ask Your Query" section**

2. **Click "Upload Plant Image"** button

3. **Select or capture a photo** of the diseased/affected plant

   - Take photo in good lighting
   - Show the affected part clearly
   - Include leaves, stems, or fruits with symptoms

4. **Optional: Add a text query** like:

   - "What disease is this?"
   - "How do I treat this?"
   - "കാരണം എന്താണ്?" (Malayalam)

5. **Click "Get AI Advice"**

6. **Receive detailed analysis** including:
   - Disease identification
   - Treatment steps
   - Preventive measures

## 💡 Example Use Cases

### Use Case 1: Tomato Leaf Disease

**Image**: Photo of tomato leaves with brown spots
**AI Response**:

- Identifies: Early Blight (Alternaria solani)
- Symptoms: Concentric rings on older leaves
- Treatment: Spray Mancozeb 0.2% or neem oil
- Prevention: Improve air circulation, avoid overhead watering

### Use Case 2: Coconut Pest Infestation

**Image**: Photo of coconut fronds with damage
**AI Response**:

- Identifies: Rhinoceros beetle damage
- Treatment: Set up pheromone traps, remove breeding sites
- Prevention: Clean farm debris, apply neem cake to soil

### Use Case 3: Nutrient Deficiency

**Image**: Photo of yellowing rice plants
**AI Response**:

- Identifies: Nitrogen deficiency
- Treatment: Apply urea 50kg/hectare, foliar spray DAP
- Timing: Apply during vegetative stage

## 🎯 API Details

### Endpoint

```
POST /api/query-vision
```

### Request Format

```json
{
  "query": "What disease is this?",
  "image": "base64_encoded_image_data",
  "mimeType": "image/jpeg"
}
```

### Response Format

```json
{
  "response": "Detailed AI analysis...",
  "success": true,
  "model": "gemini-1.5-flash-vision",
  "analysisType": "plant-disease-detection"
}
```

## 🔧 Technical Implementation

### Frontend (QueryForm.tsx)

- Captures image from file input
- Converts to base64 format
- Shows preview with analysis indicator
- Routes to vision API if image present
- Routes to text API if text-only

### Backend (query-vision/route.js)

- Validates Gemini API key
- Receives base64 image + query
- Constructs specialized prompt for plant diagnosis
- Calls Gemini Vision API
- Returns detailed analysis

### AI Model

- **Model**: Gemini 1.5 Flash Vision
- **Temperature**: 0.4 (for accuracy)
- **Max Tokens**: 2048 (for detailed response)
- **Safety**: All filters disabled for agricultural content

## 🌾 Supported Plant Types

The AI can analyze photos of:

- **Field Crops**: Rice, wheat, maize
- **Plantation Crops**: Coconut, rubber, tea, coffee
- **Spices**: Pepper, cardamom, ginger, turmeric
- **Vegetables**: Tomato, chili, okra, beans
- **Fruits**: Banana, mango, jackfruit, papaya

## ⚠️ Limitations & Best Practices

### Image Quality Requirements

- ✅ Clear, well-lit photos
- ✅ Focus on affected area
- ✅ Close-up of symptoms
- ❌ Avoid blurry images
- ❌ Avoid images in poor lighting
- ❌ Avoid photos from too far away

### API Limits (Free Tier)

- **Requests**: 60 per minute
- **Image Size**: Max 20MB
- **Supported Formats**: JPG, PNG, WEBP, GIF

### Accuracy Notes

- AI provides probable diagnosis, not 100% guaranteed
- Severe cases may need expert consultation
- Multiple photos from different angles improve accuracy
- Combine with text description for best results

## 🔄 Workflow

```
User uploads image
    ↓
Convert to base64
    ↓
Send to /api/query-vision
    ↓
Gemini Vision analyzes
    ↓
Returns diagnosis + treatment
    ↓
Display to user
```

## 💰 Cost

- **Gemini API**: FREE (with generous limits)
- **No storage costs**: Images not saved
- **No processing fees**: Direct API call

## 🛡️ Privacy & Security

- Images are NOT stored on server
- Processed in real-time via API
- Deleted after analysis
- No image database maintained
- User privacy protected

## 🎓 Educational Value

The feature helps farmers:

- Learn to identify diseases visually
- Understand symptom progression
- Know when to take action
- Build agricultural knowledge
- Reduce crop losses

## 📊 Expected Impact

- **Faster diagnosis**: Instant vs days/weeks
- **Better accuracy**: AI trained on millions of images
- **Lower costs**: Reduce unnecessary chemical use
- **Higher yields**: Early detection prevents spread
- **Knowledge sharing**: Farmers can help each other

## 🚀 Future Enhancements

- [ ] Batch image upload (multiple plants)
- [ ] Image history/comparison
- [ ] Severity scoring (mild/moderate/severe)
- [ ] Treatment cost estimation
- [ ] Local language responses
- [ ] Offline analysis capability
- [ ] Integration with weather data
- [ ] Disease outbreak alerts

---

**Status**: ✅ Fully functional (requires GEMINI_API_KEY)  
**Value**: ⭐⭐⭐⭐⭐ Essential for plant disease diagnosis  
**Setup Time**: < 5 minutes  
**Cost**: FREE
