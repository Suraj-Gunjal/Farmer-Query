import React from 'react';
import { Sprout, ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  const scrollToForm = () => {
    const formElement = document.getElementById('query-form');
    if (formElement) { 
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600">
        {/* Animated overlay pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDE0YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHptMC00MGMwIDIuMjEtMS43OSA0LTQgNHMtNC0xLjc5LTQtNCAxLjc5LTQgNC00IDQgMS43OSA0IDR6TTEyIDM0YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6 animate-bounce">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
            <Sprout className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Get instant AI-based advice
          <br />
          <span className="text-green-100">for your crops and farming issues.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl md:text-2xl text-green-50 mb-10 max-w-3xl mx-auto font-light">
          Connect with smart farming solutions powered by artificial intelligence. 
          Get answers to your agricultural questions in seconds.
        </p>

        {/* CTA Button */}
        <button
          onClick={scrollToForm}
          className="group relative inline-flex items-center gap-3 bg-white text-green-700 px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-all duration-300 hover:bg-green-50"
        >
          <span>Ask Your Query</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          
          {/* Button glow effect */}
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
        </button>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-green-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span className="text-sm md:text-base">24/7 Available</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-green-300/50 rounded-full"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse delay-300"></div>
            <span className="text-sm md:text-base">Expert Knowledge</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-green-300/50 rounded-full"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse delay-700"></div>
            <span className="text-sm md:text-base">Free Support</span>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>

      {/* Demo Query Form Section (for scroll target) */}
      <div id="query-form" className="absolute -bottom-[600px] left-0 right-0 bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
            Ask Your Farming Question
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
            <textarea
              placeholder="Describe your farming issue or question here..."
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none resize-none text-gray-700"
            />
            <button className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200">
              Submit Query
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}