import { useState, useEffect } from 'react';
import './App.css';

// TODO: Replace with your actual OpenWeatherMap API Key
const API_KEY = "b2713f886f4a7c8ba4f506c1ecad6d51"; // NOTE: Put your own key if this public test key expires or fails

export default function App() {
  const [city, setCity] = useState("Kolkata");
  const [searchInput, setSearchInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`City "${cityName}" not found.`);
        } else if (response.status === 401) {
          throw new Error("Invalid API Key. Please update the API_KEY in App.jsx.");
        } else {
          throw new Error("Failed to fetch weather data. Please try again.");
        }
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim() === "") return;
    setCity(searchInput);
    fetchWeather(searchInput);
    setSearchInput("");
  };

  const formatTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app-container">
      <div className="weather-dashboard">
        <header className="header">
          <h1>Weather Dashboard</h1>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search by city name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">Search</button>
          </form>
        </header>

        <main className="main-content">
          {loading && (
            <div className="loader-container">
              <div className="spinner"></div>
              <p>Fetching weather data...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
            </div>
          )}

          {weatherData && !loading && !error && (
            <div className="weather-card">
              <div className="weather-header">
                <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                <p className="weather-desc">{weatherData.weather[0].description}</p>
              </div>

              <div className="weather-main">
                <div className="temp-container">
                  <img 
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} 
                    alt="Weather Icon" 
                    className="weather-icon"
                  />
                  <div className="temperature">
                    {Math.round(weatherData.main.temp)}<span className="unit">°C</span>
                  </div>
                </div>
              </div>

              <div className="weather-details">
                <div className="detail-item">
                  <span className="detail-label">Humidity</span>
                  <span className="detail-value">{weatherData.main.humidity}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Wind Speed</span>
                  <span className="detail-value">{weatherData.wind.speed} m/s</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Sunrise</span>
                  <span className="detail-value">{formatTime(weatherData.sys.sunrise)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Sunset</span>
                  <span className="detail-value">{formatTime(weatherData.sys.sunset)}</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
