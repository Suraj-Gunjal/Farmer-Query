# 🌾 Kerala AI-based Farmer Advisory System

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?logo=tailwindcss)

A modern, AI-powered farming advisory platform specifically designed for Kerala farmers. This application provides real-time weather insights, AI-driven agricultural guidance, plant disease detection through image analysis, and multilingual support (English & Malayalam).

---
For RAG code, follow this repo
https://github.com/chandanb778/Farm-Easy

## 🌟 Features

### 1. **AI-Powered Query System**

- **Text-Based Queries**: Get instant answers to farming questions using Groq AI (llama-3.3-70b-versatile)
- **Kerala-Specific Advice**: Tailored recommendations for Kerala's climate, crops, and farming practices
- **Multilingual Support**: Ask questions in English or Malayalam, get responses in the same language

### 2. **Plant Disease Detection (Image Analysis)**

- **Upload Plant Images**: Take a photo of your crop and get instant disease diagnosis
- **AI Vision Analysis**: Powered by Google Gemini Vision API
- **Comprehensive Diagnosis**: Includes plant identification, disease detection, treatment recommendations, and prevention tips
- **Kerala-Focused Solutions**: Organic and chemical treatment options suitable for Kerala's climate

### 3. **Real-Time Weather & Soil Insights**

- **Live Weather Data**: Current temperature, humidity, wind speed, and rain probability
- **Location-Based**: Automatically detects your location for accurate local weather
- **Soil Health Metrics**: pH levels, moisture, NPK (Nitrogen, Phosphorus, Potassium) analysis
- **Smart Recommendations**: Weather-based farming suggestions

### 4. **Multilingual Interface**

- **English & Malayalam**: Complete UI translation with one-click language switching
- **Regional Accessibility**: Makes technology accessible to all Kerala farmers
- **Context-Aware Translation**: AI responses adapt to the language of your query

### 5. **Modern 3D UI/UX**

- **Interactive 3D Animations**: Kerala map visualization with Three.js
- **Particle Effects**: Engaging visual experience with @react-three/fiber
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Smooth Animations**: Powered by Framer Motion

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.5.4 (App Router)
- **UI Library**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4.0
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Animations**: Framer Motion 12.23.24
- **Icons**: Lucide React

### Backend APIs

- **AI Text Queries**: Groq API (llama-3.3-70b-versatile)
- **Image Analysis**: Google Gemini Vision API
- **Weather Data**: OpenWeather API
- **Internationalization**: Custom React Context with localStorage

### Key Libraries

- `@google/generative-ai` - Gemini AI integration
- `framer-motion` - Advanced animations
- `lucide-react` - Modern icon library
- `three` - 3D graphics rendering

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Git**: For cloning the repository ([Download](https://git-scm.com/))

You'll also need API keys from:

- [Groq Cloud](https://console.groq.com/) - Free AI API
- [Google AI Studio](https://aistudio.google.com/apikey) - Free Gemini API
- [OpenWeather](https://openweathermap.org/api) - Free weather API (optional)

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Suraj-Gunjal/Farmer-Query.git
cd Farmer-Query
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:

- Next.js, React, TypeScript
- TailwindCSS for styling
- Three.js for 3D graphics
- Framer Motion for animations
- AI libraries (Groq, Gemini)

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Windows PowerShell
New-Item .env.local

# macOS/Linux
touch .env.local
```

Add the following environment variables to `.env.local`:

```env
# Required: Groq AI API Key (for text queries)
GROQ_API_KEY=your_groq_api_key_here

# Required: Google Gemini API Key (for image analysis)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: OpenWeather API Key (falls back to mock data if not provided)
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

#### 🔑 How to Get API Keys:

1. **Groq API Key** (FREE):

   - Visit [https://console.groq.com/](https://console.groq.com/)
   - Sign up for a free account
   - Go to "API Keys" section
   - Create a new API key
   - Copy and paste into `.env.local`

2. **Gemini API Key** (FREE):

   - Visit [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy and paste into `.env.local`

3. **OpenWeather API Key** (OPTIONAL):
   - Visit [https://openweathermap.org/api](https://openweathermap.org/api)
   - Sign up for a free account
   - Go to "API Keys" section
   - Copy your default API key
   - Paste into `.env.local`

> **Note**: The app will work without OpenWeather API key using mock weather data. However, Groq and Gemini keys are required for AI features.

### Step 4: Run the Development Server

```bash
npm run dev
```

The application will start at **http://localhost:3000**

You should see:

```
  ▲ Next.js 15.5.4
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

### Step 5: Verify Setup

1. Open **http://localhost:3000** in your browser
2. You should see the Kerala Farmer AI homepage with 3D animations
3. Try asking a query like "How to grow rice in Kerala?"
4. Upload an image of a plant to test disease detection
5. Switch between English and Malayalam using the language toggle

---

## 📁 Project Structure

```
kerala-farmer-ai/
├── app/
│   ├── api/                      # Backend API routes
│   │   ├── query/                # Groq AI text queries
│   │   │   └── route.js
│   │   ├── query-vision/         # Gemini Vision image analysis
│   │   │   └── route.js
│   │   ├── query-gemini/         # Alternative Gemini text API
│   │   │   └── route.js
│   │   ├── list-models/          # Utility to list Gemini models
│   │   │   └── route.js
│   │   └── weather/              # OpenWeather API integration
│   │       └── route.js
│   ├── components/               # React components
│   │   ├── Header.tsx            # Navigation header
│   │   ├── Hero.tsx              # Hero section with 3D globe
│   │   ├── QueryForm.tsx         # AI query interface with image upload
│   │   ├── WeatherSoilInsights.tsx  # Weather display
│   │   ├── Footer.tsx            # Site footer
│   │   └── LanguageSwitcher.tsx  # Language toggle
│   ├── contexts/                 # React Context providers
│   │   └── TranslationContext.tsx  # i18n translation context
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main homepage
├── messages/                     # Translation files
│   ├── en.json                   # English translations
│   └── ml.json                   # Malayalam translations
├── public/                       # Static assets
├── .env.local                    # Environment variables (create this)
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # TailwindCSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Project dependencies
└── README.md                     # This file
```

---

## 🎯 Usage Guide

### 1. Ask Farming Questions

1. Navigate to the **"Ask Your Query"** section
2. Type your question in English or Malayalam:
   - Example (English): _"What is the best fertilizer for coconut trees?"_
   - Example (Malayalam): _"തെങ്ങിന് ഏറ്റവും നല്ല വളം ഏതാണ്?"_
3. Click **"Send"** or press Enter
4. Get instant AI-powered answers tailored to Kerala farming

### 2. Detect Plant Diseases

1. Scroll to the **Query Form** section
2. Click **"Choose File"** or drag & drop an image
3. Upload a clear photo of your plant (leaf, stem, or fruit)
4. Add an optional text query for specific concerns
5. Click **"Analyze Image"**
6. Receive:
   - Plant identification
   - Disease diagnosis
   - Organic treatment options (Neem oil, cow urine, etc.)
   - Chemical alternatives (if needed)
   - Prevention tips

### 3. Check Weather & Soil

1. Allow location access when prompted
2. View real-time weather data:
   - Temperature, humidity, wind speed
   - Rain probability
3. Check soil health indicators:
   - pH level, moisture
   - NPK (Nitrogen, Phosphorus, Potassium)
4. Read AI-generated farming recommendations

### 4. Switch Languages

- Click the language toggle in the header
- Choose between **English** and **മലയാളം** (Malayalam)
- Entire UI updates instantly
- AI responses adapt to your selected language

---

## 🔧 Configuration

### Changing AI Models

**For Text Queries** (`app/api/query/route.js`):

```javascript
const response = await fetch(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile", // Change model here
      messages: messages,
      temperature: 0.7,
    }),
  }
);
```

**For Image Analysis** (`app/api/query-vision/route.js`):

```javascript
// The API tries multiple models automatically:
const modelOptions = [
  "gemini-2.0-flash-exp",
  "gemini-1.5-pro-latest",
  "gemini-1.5-flash-latest",
  "gemini-pro-vision",
];
```

### Customizing Translations

Add new translations in `messages/en.json` and `messages/ml.json`:

```json
{
  "newSection": {
    "title": "Your Title",
    "description": "Your Description"
  }
}
```

Use in components:

```tsx
import { useTranslation } from "./contexts/TranslationContext";

const { t } = useTranslation();
<h1>{t.newSection.title}</h1>;
```

---

## 🏗️ Building for Production

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### Start Production Server

```bash
npm start
```

The production server runs on **http://localhost:3000**

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com/)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables:
   - `GROQ_API_KEY`
   - `GEMINI_API_KEY`
   - `OPENWEATHER_API_KEY` (optional)
6. Click "Deploy"

Your app will be live in minutes with automatic HTTPS!

---

## 🌐 Environment Variables Reference

| Variable              | Required    | Description                               | Default   |
| --------------------- | ----------- | ----------------------------------------- | --------- |
| `GROQ_API_KEY`        | ✅ Yes      | Groq AI API key for text queries          | None      |
| `GEMINI_API_KEY`      | ✅ Yes      | Google Gemini API key for image analysis  | None      |
| `OPENWEATHER_API_KEY` | ❌ Optional | OpenWeather API key for real weather data | Mock data |

---

## 🐛 Troubleshooting

### API Key Errors

**Issue**: "API key not configured"

**Solution**:

1. Check if `.env.local` file exists in root directory
2. Verify API keys are correctly pasted (no extra spaces)
3. Restart development server: `Ctrl+C` then `npm run dev`

### Image Upload Not Working

**Issue**: "Failed to analyze image"

**Solution**:

1. Check `GEMINI_API_KEY` is set in `.env.local`
2. Ensure image is in supported format: JPG, PNG, WebP
3. Try a smaller image (< 5MB)
4. Check browser console (F12) for detailed error messages

### Weather Not Loading

**Issue**: "Location Services Not Available"

**Solution**:

1. Allow location access in browser settings
2. Chrome: Click 🔒 icon → Site settings → Location → Allow
3. If still failing, app will use mock weather data
4. Add `OPENWEATHER_API_KEY` for real weather data

### Build Errors

**Issue**: TypeScript compilation errors

**Solution**:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Port Already in Use

**Issue**: "Port 3000 is already in use"

**Solution**:

```bash
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Bugs

1. Check if the issue already exists in [GitHub Issues](https://github.com/Suraj-Gunjal/Farmer-Query/issues)
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

---

## 👨‍💻 Developer

**Suraj Gunjal**

- GitHub: [@Suraj-Gunjal](https://github.com/Suraj-Gunjal)
- Repository: [Farmer-Query](https://github.com/Suraj-Gunjal/Farmer-Query)

---

## 🙏 Acknowledgments

- **Government of Kerala** - For the initiative to support farmers
- **Groq** - For providing free, fast AI inference
- **Google** - For Gemini Vision API
- **OpenWeather** - For weather data services
- **Next.js Team** - For the amazing React framework
- **Kerala Farmers** - The true inspiration behind this project

---

## 📞 Support

Need help? Here's how to get support:

1. **Documentation**: Read this README thoroughly
2. **GitHub Issues**: [Report bugs or request features](https://github.com/Suraj-Gunjal/Farmer-Query/issues)

---

## 🔮 Future Roadmap

- [ ] Add more regional languages (Tamil, Kannada, Hindi)
- [ ] Integrate crop price predictions
- [ ] Add farming calendar with seasonal reminders
- [ ] Implement voice input for queries (speech-to-text)
- [ ] Create mobile apps (iOS & Android)
- [ ] Add community forum for farmers
- [ ] Integrate government scheme information
- [ ] Implement soil testing lab locator

---

<div align="center">

**Made with ❤️ for Kerala Farmers**

⭐ Star this repo if you found it helpful!

[Report Bug](https://github.com/Suraj-Gunjal/Farmer-Query/issues) • [Request Feature](https://github.com/Suraj-Gunjal/Farmer-Query/issues)

</div>
