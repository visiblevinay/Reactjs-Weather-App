import React, { useEffect, useState, Fragment } from "react";
import "./App.css";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiFog,
  WiThunderstorm,
  WiSnow,
  WiNightClear,
} from "react-icons/wi";

const API_KEY = "238f980e7ae001d065b0e0bdec9c4f8e";

const fetchWeather = async (search, setCity, setError, setLoading, setAQI) => {
  const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_KEY}&units=metric`;
  setLoading(true);
  try {
    const res = await fetch(weatherApi);
    const data = await res.json();
    if (data.cod !== 200) {
      throw new Error(data.message);
    }

    setCity(data);
    setError(null);

    if (data.coord) {
      const { lat, lon } = data.coord;
      const aqiApi = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      const aqiRes = await fetch(aqiApi);
      const aqiData = await aqiRes.json();
      setAQI(aqiData.list[0]);
    } else {
      setAQI(null);
    }
  } catch (error) {
    setError("City not found or API limit reached.");
  }
  setLoading(false);
};

const getIconComponent = (main) => {
  switch (main) {
    case "Clear":
      return <WiDaySunny size={64} color="gold" />;
    case "Clouds":
      return <WiCloudy size={64} color="#ccc" />;
    case "Rain":
      return <WiRain size={64} color="#6ec6ff" />;
    case "Snow":
      return <WiSnow size={64} color="#aee" />;
    case "Thunderstorm":
      return <WiThunderstorm size={64} color="purple" />;
    case "Mist":
    case "Haze":
    case "Fog":
      return <WiFog size={64} color="gray" />;
    case "Night":
      return <WiNightClear size={64} />;
    default:
      return <WiDaySunny size={64} />;
  }
};

const getAQILevel = (index) => {
  if (index === 1) return "Good";
  if (index === 2) return "Fair";
  if (index === 3) return "Moderate";
  if (index === 4) return "Poor";
  if (index === 5) return "Very Poor";
  return "Unknown";
};

const Tempapp = () => {
  const [city, setCity] = useState(null);
  const [search, setSearch] = useState("Raxaul");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aqi, setAQI] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchWeather(search, setCity, setError, setLoading, setAQI);
  }, []);

  const fetchSuggestions = async (query) => {
    if (!query) return setSuggestions([]);
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    setSuggestions(data);
  };

  const handleSelectSuggestion = (suggestion) => {
    const name = `${suggestion.name}${suggestion.state ? ", " + suggestion.state : ""}, ${suggestion.country}`;
    setSearch(name);
    setSuggestions([]);
    fetchWeather(name, setCity, setError, setLoading, setAQI);
  };

  return (
    <div className="container">
      <h1 className="app-title">Weather App</h1>
      <div className="inputData">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchWeather(search, setCity, setError, setLoading, setAQI);
            setSuggestions([]);
          }}
        >
          <input
            type="search"
            className="inputField"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            placeholder="Search city..."
            autoComplete="off"
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>

        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((sug, idx) => (
              <li key={idx} onClick={() => handleSelectSuggestion(sug)}>
                {sug.name}{sug.state ? ", " + sug.state : ""}, {sug.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="info">
        {loading ? (
          <p className="status-msg">Loading...</p>
        ) : error ? (
          <p className="status-msg error">{error}</p>
        ) : city && city.main ? (
          <Fragment>
            <h2 className="location">📍 {city.name}</h2>
            <div className="weather-icon">
              {getIconComponent(city.weather[0].main)}
            </div>
            <h1 className="temp">🌡️ {Math.round(city.main.temp)}°C</h1>
            <h3 className="tempmin-max">
              Min: {Math.round(city.main.temp_min)}°C | Max: {Math.round(city.main.temp_max)}°C
            </h3>
            <h3 className="humidity">💧 Humidity: {city.main.humidity}%</h3>
            <h4 className="description">Condition: {city.weather[0].description}</h4>
            {aqi && (
              <div className="air-quality">
                <h4>🌬️ Air Quality: {getAQILevel(aqi.main.aqi)}</h4>
              </div>
            )}
          </Fragment>
        ) : (
          <p className="status-msg">No data available</p>
        )}
      </div>
    </div>
  );
};

export default Tempapp;
