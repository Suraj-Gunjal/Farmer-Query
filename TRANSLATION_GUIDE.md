# Malayalam Translation Setup

## ✅ What's Been Added:

1. **Translation Files:**

   - `messages/en.json` - English translations
   - `messages/ml.json` - Malayalam translations

2. **Translation System:**

   - `app/contexts/TranslationContext.tsx` - Translation context provider
   - `app/components/LanguageSwitcher.tsx` - Language toggle button

3. **Features:**
   - Language switcher button (top-right corner)
   - Saves language preference in localStorage
   - Instant language switching
   - All text translatable

## 🎯 How to Use:

### For Users:

- Click the **language button** in the top-right corner
- Toggle between **English** and **മലയാളം**
- Language preference is saved automatically

### For Developers - Adding Translations:

#### Step 1: Add text to translation files

**English (`messages/en.json`):**

```json
{
  "newSection": {
    "title": "My New Title",
    "description": "My description"
  }
}
```

**Malayalam (`messages/ml.json`):**

```json
{
  "newSection": {
    "title": "എന്റെ പുതിയ ശീർഷകം",
    "description": "എന്റെ വിവരണം"
  }
}
```

#### Step 2: Use in your component

```tsx
"use client";
import { useTranslation } from "./contexts/TranslationContext";

export default function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t.newSection.title}</h1>
      <p>{t.newSection.description}</p>
    </div>
  );
}
```

## 📋 Currently Translated Sections:

✅ Hero section (badge, title, subtitle, buttons)
✅ Feature cards (titles, descriptions)
✅ Weather & Soil Insights (all labels)
✅ Query Form (labels, placeholders, buttons)
✅ About section
✅ Footer

## 🔧 To Translate More:

1. Open the component you want to translate
2. Import `useTranslation`: `import { useTranslation } from './contexts/TranslationContext';`
3. Get translations: `const { t } = useTranslation();`
4. Replace hardcoded text with `{t.section.key}`
5. Add the text to both `en.json` and `ml.json`

## 🌐 Example - Full Component:

```tsx
"use client";
import { useTranslation } from "../contexts/TranslationContext";

export default function Example() {
  const { t, language } = useTranslation();

  return (
    <div>
      <h1>{t.hero.title}</h1>
      <p>Current language: {language}</p>
    </div>
  );
}
```

## 🎨 Language Switcher:

The switcher shows:

- **"മലയാളം"** when English is active
- **"English"** when Malayalam is active

It's a floating button in the top-right corner with a translation icon.

---

**Your website now supports Malayalam! 🎉**
