'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Cloud, Droplets, Wind, Thermometer, Leaf, Sprout } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

interface WeatherData {
  temperature: number;
  feelsLike?: number;
  humidity: number;
  windSpeed: number;
  windDirection?: number;
  pressure?: number;
  visibility?: number;
  cloudiness?: number;
  rainChance: number;
  description: string;
  weatherMain?: string;
  weatherIcon?: string;
  location: string;
  country?: string;
  sunrise?: number | null;
  sunset?: number | null;
  timezone?: number;
  currentTime?: number;
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

  const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Starting location fetch...');

        let latitude: number;
        let longitude: number;

        // Try GPS first
        try {
          // Check if geolocation is available
          if (!navigator.geolocation) {
            console.warn('❌ Geolocation not supported by browser');
            throw new Error('Geolocation not supported');
          }

          // Check if we're in a secure context (HTTPS or localhost)
          if (!window.isSecureContext) {
            console.warn('⚠️ Not in secure context - geolocation may not work');
          }

          console.log('📍 Requesting GPS location...');

          // Try to get user's location via GPS
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            const timeout = setTimeout(() => {
              console.warn('⏱️ GPS request timed out after 8 seconds');
              reject(new Error('Location timeout'));
            }, 8000); // 8 seconds timeout

            navigator.geolocation.getCurrentPosition(
              (pos) => {
                clearTimeout(timeout);
                console.log('✅ GPS location permission granted');
                resolve(pos);
              },
              (err) => {
                clearTimeout(timeout);
                
                // Log full error object for debugging
                console.warn('❌ GPS error details:', {
                  fullError: err,
                  code: err?.code,
                  message: err?.message,
                  codeDescription: 
                    err?.code === 1 ? 'PERMISSION_DENIED' :
                    err?.code === 2 ? 'POSITION_UNAVAILABLE' :
                    err?.code === 3 ? 'TIMEOUT' : 'UNKNOWN',
                });
                
                reject(err);
              },
              { 
                enableHighAccuracy: false,
                timeout: 8000,
                maximumAge: 300000
              }
            );
          });

          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          console.log('✅ GPS location obtained:', { latitude, longitude });

        } catch (gpsError) {
          // GPS failed, try IP-based geolocation as fallback
          console.log('🌐 GPS unavailable, trying IP-based geolocation...');
          
          try {
            const ipLocationRes = await fetch('https://ipapi.co/json/');
            if (ipLocationRes.ok) {
              const ipData = await ipLocationRes.json();
              latitude = ipData.latitude;
              longitude = ipData.longitude;
              console.log('✅ IP-based location obtained:', { 
                latitude, 
                longitude,
                city: ipData.city,
                region: ipData.region,
                country: ipData.country_name
              });
            } else {
              throw new Error('IP geolocation failed');
            }
          } catch (ipError) {
            console.warn('❌ IP-based geolocation also failed:', ipError);
            throw new Error('All location methods failed');
          }
        }

        // Fetch weather data
        console.log('🌤️ Fetching weather data for location...');
        const weatherRes = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
        if (!weatherRes.ok) {
          const errorText = await weatherRes.text();
          console.error('❌ Weather API failed:', weatherRes.status, errorText);
          throw new Error('Failed to fetch weather');
        }
        const weatherData = await weatherRes.json();
        setWeather(weatherData);
        console.log('✅ Weather data loaded for:', weatherData.location, weatherData);

        // Mock soil data
        setSoil({
          ph: 6.5,
          moisture: 65,
          nitrogen: 'Medium',
          phosphorus: 'High',
          potassium: 'Medium'
        });
      } catch (err) {
        // Silently handle errors and use fallback data
        const errorMsg = err instanceof Error ? err.message : 
                        (err as any)?.code === 1 ? 'Permission denied' :
                        (err as any)?.code === 2 ? 'Position unavailable' :
                        (err as any)?.code === 3 ? 'Timeout' : 'Unknown';
        
        console.log('ℹ️ Using default location data. Reason:', errorMsg);
        console.log('📍 Fallback: Showing Kerala weather data');
        console.log('💡 Tip: Allow location permission in browser to see your local weather');
        
        // Use fallback data without showing error
        setWeather({
          temperature: 28,
          feelsLike: 30,
          humidity: 75,
          windSpeed: 12,
          windDirection: 180,
          pressure: 1013,
          visibility: 10,
          cloudiness: 50,
          rainChance: 40,
          description: 'Partly cloudy',
          weatherMain: 'Clouds',
          weatherIcon: '03d',
          location: 'Kerala',
          country: 'IN'
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
      if (loading) {
        console.warn('⚠️ Failsafe activated - forcing loading to false');
        setLoading(false);
      }
    }, 15000);
    
    return () => clearTimeout(failsafeTimer);
  }, []);

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
          className="text-center text-gray-300 mb-4 text-lg"
        >
          {weather?.location ? `${t.weather.location}: ${weather.location}` : t.weather.loading}
        </motion.p>

        {/* Refresh Location Button */}
        <div className="text-center mb-12">
          <button
            onClick={() => {
              console.log('🔄 Manual location refresh requested');
              fetchData();
            }}
            disabled={loading}
            className="px-5 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 text-sm font-medium rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {loading ? 'Updating...' : 'Use My Location'}
          </button>
        </div>

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
                    {weather?.feelsLike && (
                      <p className="text-xs text-gray-500 mt-1">Feels like {weather.feelsLike}°C</p>
                    )}
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
                
                {weather?.pressure && (
                  <div className="flex items-start col-span-2">
                    <Cloud className="w-6 h-6 text-purple-400 mr-3 mt-1" />
                    <div className="flex gap-8">
                      <div>
                        <p className="text-gray-400 text-sm">Pressure</p>
                        <p className="text-xl font-bold text-white">{weather.pressure} hPa</p>
                      </div>
                      {weather?.visibility && (
                        <div>
                          <p className="text-gray-400 text-sm">Visibility</p>
                          <p className="text-xl font-bold text-white">{weather.visibility} km</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <p className="text-gray-300 capitalize flex items-center gap-2">
                    {weather?.weatherIcon && (
                      <img 
                        src={`https://openweathermap.org/img/wn/${weather.weatherIcon}@2x.png`} 
                        alt={weather.description}
                        className="w-10 h-10"
                      />
                    )}
                    {weather?.description}
                  </p>
                  {weather?.cloudiness !== undefined && (
                    <p className="text-gray-500 text-sm">Cloud cover: {weather.cloudiness}%</p>
                  )}
                </div>
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
      </div>
    </section>
  );
}
