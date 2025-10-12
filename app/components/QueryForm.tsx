import { useState, FormEvent } from 'react';
import { Loader2, Send, Sprout } from 'lucide-react';

export default function QueryForm() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter your query');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error('Failed to get advice');
      }

      const data = await res.json();
      setResponse(data.response || data.advice || 'No response received');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/50">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-300">
              Farmer Support
            </h1>
          </div>
          <p className="text-xl text-gray-300">Get expert AI-powered advice for your farming queries</p>
          <div className="mt-4 inline-block px-4 py-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full">
            <span className="text-green-300 text-sm font-medium">24/7 AI Advisory System</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="query" className="block text-lg font-semibold text-green-300 mb-3">
                Your Farming Query
              </label>
              <textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., What's the best time to plant wheat in Kerala? How can I prevent pest damage to my rice crops?"
                className="w-full min-h-[180px] px-6 py-4 bg-slate-700/50 border-2 border-white/10 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-500/50 outline-none transition-all resize-y text-white placeholder-gray-400 text-lg"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-300 px-6 py-4 rounded-2xl text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/50 hover:shadow-green-500/70 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing Your Query...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Get AI Advice
                </>
              )}
            </button>
          </form>
        </div>

        {/* Response Card */}
        {response && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-400">
                AI Advisory Response
              </h2>
            </div>
            <div className="prose prose-invert prose-green max-w-none">
              <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">{response}</p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Powered by Kerala AI Farmer Advisory System
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !response && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-12 text-center">
            <div className="relative inline-block">
              <Loader2 className="w-16 h-16 text-green-400 animate-spin mx-auto mb-6" />
              <div className="absolute inset-0 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <p className="text-gray-300 text-lg font-medium mb-2">Analyzing your farming query...</p>
            <p className="text-gray-500 text-sm">Our AI is processing your request and preparing personalized advice</p>
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