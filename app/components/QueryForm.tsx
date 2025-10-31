"use client";
import { useState, FormEvent } from "react";
import { Loader2, Send, Sprout, ImagePlus } from "lucide-react";
import { useTranslation } from "../contexts/TranslationContext";

export default function QueryForm() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Handle image upload and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit Query to FastAPI RAG backend
// Submit Query to FastAPI RAG backend
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!query.trim() && !image) {
    setError(t.queryForm.errorMessage);
    return;
  }

  setLoading(true);
  setError("");
  setResponse("");

  try {
    // ✅ Match the FastAPI schema
    const payload = {
      question: query,
      top_k: 3,
      min_score: 0.1,
      summarize: true,
    };

    const res = await fetch("http://127.0.0.1:8000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Backend error: ${res.status}`);

    const data = await res.json();
    setResponse(data.answer || data.summary || "No response received.");
  } catch (err) {
    console.error("Error:", err);
    setError(err instanceof Error ? err.message : t.queryForm.errorOccurred);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/50">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-300">
              {t.queryForm.title}
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            {t.queryForm.subtitle}
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full">
            <span className="text-green-300 text-sm font-medium">
              🌾 {t.queryForm.badge}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Query Input */}
            <div>
              <label
                htmlFor="query"
                className="block text-lg font-semibold text-green-300 mb-3"
              >
                {t.queryForm.label}
              </label>
              <textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.queryForm.placeholder}
                className="w-full min-h-[160px] px-6 py-4 bg-slate-700/50 border-2 border-white/10 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-500/50 outline-none transition-all resize-y text-white placeholder-gray-400 text-lg"
                disabled={loading}
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col items-center justify-center">
              <label className="flex flex-col items-center justify-center w-full cursor-pointer bg-slate-700/50 border-2 border-dashed border-green-400/40 rounded-2xl p-6 hover:border-green-500 hover:bg-slate-700/70 transition-all">
                <ImagePlus className="w-10 h-10 text-green-400 mb-2" />
                <span className="text-green-300 font-medium">
                  {t.queryForm.uploadImage}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={loading}
                />
              </label>
              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 rounded-xl border border-green-400/40 shadow-lg"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-300 px-6 py-4 rounded-2xl text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/50 hover:shadow-green-500/70 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {t.queryForm.processing}
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  {t.queryForm.submit}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Response */}
        {response && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-400">
                {t.queryForm.responseTitle}
              </h2>
            </div>
            <div className="prose prose-invert prose-green max-w-none">
              <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                {response}
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {t.queryForm.poweredBy}
            </div>
          </div>
        )}

        {/* Loading UI */}
        {loading && !response && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-12 text-center">
            <Loader2 className="w-16 h-16 text-green-400 animate-spin mx-auto mb-6" />
            <p className="text-gray-300 text-lg font-medium mb-2">
              {t.queryForm.analyzing}
            </p>
            <p className="text-gray-500 text-sm">
              {t.queryForm.analyzingMessage}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
