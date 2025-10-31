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
        humidity: 75,
        windSpeed: 12,
        rainChance: 40,
        description: "Partly cloudy",
        location: "Kerala",
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
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
      rainChance: rainChance,
      description: weatherData.weather[0].description,
      location: weatherData.name || "Your Location",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Weather API error:", error);

    // Return fallback data instead of error
    return NextResponse.json({
      temperature: 28,
      humidity: 75,
      windSpeed: 12,
      rainChance: 40,
      description: "Partly cloudy",
      location: "Kerala",
    });
  }
}
