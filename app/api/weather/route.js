import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      console.warn("OPENWEATHER_API_KEY not configured, using mock data");
      return NextResponse.json({
        temperature: 28,
        feelsLike: 30,
        humidity: 75,
        windSpeed: 12,
        windDirection: 180,
        pressure: 1013,
        visibility: 10,
        cloudiness: 50,
        rainChance: 40,
        description: "Partly cloudy",
        weatherMain: "Clouds",
        weatherIcon: "03d",
        location: "Kerala",
        country: "IN",
        sunrise: null,
        sunset: null,
        timezone: 19800,
        currentTime: Math.floor(Date.now() / 1000),
      });
    }

    // Fetch current weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const weatherResponse = await fetch(weatherUrl, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const weatherData = await weatherResponse.json();

    // Fetch forecast for rain chance
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastResponse = await fetch(forecastUrl, {
      next: { revalidate: 1800 },
    });

    let rainChance = 0;
    if (forecastResponse.ok) {
      const forecastData = await forecastResponse.json();
      // Calculate rain probability from next 24 hours
      const next24Hours = forecastData.list.slice(0, 8);
      const rainyPeriods = next24Hours.filter(
        (period) => period.weather[0].main === "Rain" || period.pop > 0.3
      );
      rainChance = Math.round((rainyPeriods.length / next24Hours.length) * 100);
    }

    const result = {
      temperature: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: weatherData.wind.deg,
      pressure: weatherData.main.pressure,
      visibility: Math.round((weatherData.visibility || 10000) / 1000), // Convert to km
      cloudiness: weatherData.clouds?.all || 0,
      rainChance: rainChance,
      description: weatherData.weather[0].description,
      weatherMain: weatherData.weather[0].main,
      weatherIcon: weatherData.weather[0].icon,
      location: weatherData.name || "Your Location",
      country: weatherData.sys?.country || "",
      sunrise: weatherData.sys?.sunrise || null,
      sunset: weatherData.sys?.sunset || null,
      timezone: weatherData.timezone || 0,
      currentTime: Math.floor(Date.now() / 1000),
    };

    console.log(
      "✅ Weather data fetched successfully:",
      result.location,
      result.temperature + "°C"
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Weather API error:", error);

    // Return fallback data instead of error
    console.warn("⚠️ Using fallback weather data due to error");
    return NextResponse.json({
      temperature: 28,
      feelsLike: 30,
      humidity: 75,
      windSpeed: 12,
      windDirection: 180,
      pressure: 1013,
      visibility: 10,
      cloudiness: 50,
      rainChance: 40,
      description: "Partly cloudy",
      weatherMain: "Clouds",
      weatherIcon: "03d",
      location: "Kerala",
      country: "IN",
      sunrise: null,
      sunset: null,
      timezone: 19800,
      currentTime: Math.floor(Date.now() / 1000),
    });
  }
}
