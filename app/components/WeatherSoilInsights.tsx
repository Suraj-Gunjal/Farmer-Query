'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Cloud, Droplets, Wind, Thermometer, Leaf, Sprout } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  description: string;
  location: string;
}

interface SoilData {
  ph: number;
  moisture: number;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
}

export default function WeatherSoilInsights() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [soil, setSoil] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check for secure context (required on mobile)
        if (!window.isSecureContext) {
          console.error('❌ NOT A SECURE CONTEXT - Geolocation will not work!');
          throw new Error('Geolocation requires HTTPS. Please access the site via https:// or use localhost.');
        }

        // Get user's location with timeout
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by your browser');
        }

        // Check permissions API if available
        if (navigator.permissions) {
          try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
            
            if (permissionStatus.state === 'denied') {
              throw new Error('Location permission was previously denied. Please enable it in browser settings.');
            }
          } catch (permError) {
          }
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(t.weather.locationUnavailable + '. ' + t.weather.pleaseCheck));
          }, 15000); // Increased to 15 seconds for mobile

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              clearTimeout(timeout);
              resolve(pos);
            },
            (err) => {
              clearTimeout(timeout);
              console.error('❌ Location error:', err);
              console.error('❌ Error code:', err?.code);
              console.error('❌ Error message:', err?.message);
              console.error('❌ Error PERMISSION_DENIED:', err?.PERMISSION_DENIED);
              
              // Handle empty error object or missing properties
              const errorCode = err?.code ?? -1;
              const errorMessage = err?.message || 'Unknown error';
              
              let userMessage;
              if (errorCode === 1 || errorCode === err?.PERMISSION_DENIED) {
                userMessage = 'Location permission denied. Please enable location in your browser settings.';
              } else if (errorCode === 2 || errorCode === err?.POSITION_UNAVAILABLE) {
                userMessage = 'Location unavailable. Please check if location services are enabled on your device.';
              } else if (errorCode === 3 || errorCode === err?.TIMEOUT) {
                userMessage = 'Location request timed out. Please try again.';
              } else {
                // Fallback for empty error objects
                userMessage = `Unable to access location. Error: ${errorMessage}`;
              }
              
              reject(new Error(userMessage));
            },
            { 
              enableHighAccuracy: true, // Changed to true for mobile GPS
              timeout: 15000, // Increased timeout for mobile
              maximumAge: 0 // Don't use cached position, force fresh request
            }
          );
        });

        const { latitude, longitude } = position.coords;

        // Fetch weather data
        const weatherRes = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
        if (!weatherRes.ok) {
          console.error('❌ Weather API error:', weatherRes.status, weatherRes.statusText);
          throw new Error('Failed to fetch weather');
        }
        const weatherData = await weatherRes.json();
        setWeather(weatherData);

        // Mock soil data (replace with ML API when ready)
        setSoil({
          ph: 6.5,
          moisture: 65,
          nitrogen: 'Medium',
          phosphorus: 'High',
          potassium: 'Medium'
        });
      } catch (err) {
        console.error('❌ Error in fetchData:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        // Fallback data
        setWeather({
          temperature: 28,
          humidity: 75,
          windSpeed: 12,
          rainChance: 40,
          description: 'Partly cloudy',
          location: 'Kerala'
        });
        setSoil({
          ph: 6.5,
          moisture: 65,
          nitrogen: 'Medium',
          phosphorus: 'High',
          potassium: 'Medium'
        });
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
    
    // Failsafe: Force loading to false after 15 seconds
    const failsafeTimer = setTimeout(() => {
      console.warn('⚠️ Failsafe activated - forcing loading to false');
      setLoading(false);
    }, 15000);
    
    return () => clearTimeout(failsafeTimer);
  }, [retryCount]);

  const handleRetryLocation = () => {
    setRetryCount(prev => prev + 1);
  };

  const getRecommendations = () => {
    if (!weather || !soil) return [];

    const recommendations = [];

    if (weather.rainChance > 60) {
      recommendations.push(t.weather.highRain);
    }
    if (soil.moisture < 50) {
      recommendations.push(t.weather.lowMoisture);
    }
    if (soil.ph < 6.0 || soil.ph > 7.5) {
      recommendations.push(t.weather.phOutOfRange);
    }
    if (weather.temperature > 35) {
      recommendations.push(t.weather.highTemp);
    }
    if (soil.nitrogen === 'Low') {
      recommendations.push(t.weather.applyNitrogen);
    }

    if (recommendations.length === 0) {
      recommendations.push(t.weather.favorableConditions);
    }

    return recommendations;
  };

  if (loading) {
    return (
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
            <span className="ml-4 text-gray-300">{t.weather.loading}</span>
            <p className="text-xs text-gray-500">{t.weather.checkConsole}</p>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section ref={sectionRef} className="py-24 px-6 relative bg-slate-900" id="weather-insights">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 text-green-300"
        >
          {t.weather.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-gray-300 mb-16 text-lg"
        >
          {weather?.location ? `${t.weather.location}: ${weather.location}` : t.weather.loading}
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Weather Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Cloud className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-2xl font-bold text-blue-300">{t.weather.weatherConditions}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Thermometer className="w-6 h-6 text-red-400 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">{t.weather.temperature}</p>
                    <p className="text-2xl font-bold text-white">{weather?.temperature}°C</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Droplets className="w-6 h-6 text-blue-400 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">{t.weather.rainChance}</p>
                    <p className="text-2xl font-bold text-white">{weather?.rainChance}%</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Droplets className="w-6 h-6 text-cyan-400 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">{t.weather.humidity}</p>
                    <p className="text-2xl font-bold text-white">{weather?.humidity}%</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Wind className="w-6 h-6 text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">{t.weather.windSpeed}</p>
                    <p className="text-2xl font-bold text-white">{weather?.windSpeed} km/h</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-gray-300 capitalize">{weather?.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Soil Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Leaf className="w-8 h-8 text-green-400 mr-3" />
                <h3 className="text-2xl font-bold text-green-300">{t.weather.soilHealth}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div>
                    <p className="text-gray-400 text-sm">{t.weather.phLevel}</p>
                    <p className="text-2xl font-bold text-white">{soil?.ph}</p>
                    <p className="text-xs text-gray-500 mt-1">{t.weather.ideal}: 6.0-7.5</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Droplets className="w-6 h-6 text-blue-400 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">{t.weather.moisture}</p>
                    <p className="text-2xl font-bold text-white">{soil?.moisture}%</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Sprout className="w-6 h-6 text-green-400 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">{t.weather.nitrogen}</p>
                    <p className="text-xl font-bold text-white">{soil?.nitrogen}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Sprout className="w-6 h-6 text-orange-400 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">{t.weather.phosphorus}</p>
                    <p className="text-xl font-bold text-white">{soil?.phosphorus}</p>
                  </div>
                </div>

                <div className="flex items-start col-span-2">
                  <Sprout className="w-6 h-6 text-yellow-400 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">{t.weather.potassium}</p>
                    <p className="text-xl font-bold text-white">{soil?.potassium}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-amber-300 mb-4">{t.weather.recommendations}</h3>
            <ul className="space-y-3">
              {getRecommendations().map((rec, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-amber-400 mr-3 mt-1">•</span>
                  <span className="text-gray-300">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {error && (
          <div className="mt-6 bg-amber-500/10 border-2 border-amber-400/50 rounded-xl p-5 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-amber-200 text-base mb-2">
                <span className="font-bold">⚠️ {error}</span>
              </p>
              <div className="text-amber-300/90 text-sm mb-4 text-left max-w-md mx-auto">
                {error.includes('unavailable') ? (
                  <div className="space-y-2">
                    <p className="font-semibold">📍 {t.weather.locationUnavailable}</p>
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-yellow-300">{t.weather.pleaseCheck}</p>
                      <ol className="list-decimal ml-4 mt-1 space-y-1">
                        <li><strong>{t.weather.locationServicesOn}</strong>
                          <ul className="list-disc ml-4 text-xs mt-1">
                            <li>{t.weather.android}</li>
                            <li>{t.weather.ios}</li>
                          </ul>
                        </li>
                        <li><strong>{t.weather.browserPermission}</strong></li>
                        <li><strong>{t.weather.notAirplaneMode}</strong></li>
                        <li><strong>{t.weather.betterSignal}</strong></li>
                      </ol>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg mt-2">
                      <p className="font-semibold text-green-300">{t.weather.chromeMobile}:</p>
                      <ol className="list-decimal ml-4 mt-1 space-y-1 text-xs">
                        <li>{t.weather.chromeStep1}</li>
                        <li>{t.weather.chromeStep2}</li>
                        <li>{t.weather.chromeStep3}</li>
                      </ol>
                    </div>
                  </div>
                ) : error.includes('permission') || error.includes('denied') ? (
                  <div className="space-y-2">
                    <p className="font-semibold">📱 {t.weather.locationUnavailable}</p>
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-green-300">{t.weather.chromeMobile}:</p>
                      <ol className="list-decimal ml-4 mt-1 space-y-1">
                        <li>{t.weather.chromeStep1}</li>
                        <li>{t.weather.chromeStep2}</li>
                        <li>{t.weather.chromeStep3}</li>
                      </ol>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-blue-300">Safari iOS:</p>
                      <ol className="list-decimal ml-4 mt-1 space-y-1">
                        <li>Open <strong>Settings</strong> app</li>
                        <li>Scroll to <strong>Safari</strong></li>
                        <li>Tap <strong>Location</strong></li>
                        <li>Select <strong>"Ask"</strong> or <strong>"Allow"</strong></li>
                        <li>Return and refresh this page</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <p>{t.weather.locationUnavailable}. {t.weather.currentlyShowing}</p>
                )}
              </div>
              <p className="text-amber-400/80 text-xs mb-4">📍 {t.weather.currentlyShowing}</p>
              <button
                onClick={handleRetryLocation}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-base font-bold rounded-full transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? t.weather.requesting : t.weather.retryButton}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
