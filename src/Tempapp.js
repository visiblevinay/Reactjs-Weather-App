import React, { useEffect, useState } from "react";

const Tempapp = () => {
  const [city, setCity] = useState(null);
  const [search, setSearch] = useState("Raxaul");

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=238f980e7ae001d065b0e0bdec9c4f8e&units=metric`
    )
      .then((response) => response.json())
      .then((json) => setCity(json));
  }, [search]);

  return (
    <div className="container">
      <div className="inputData">
        <input
          type="search"
          className="inputFeild"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search city..."
        />
      </div>

      <div className="info">
        {city && city.main ? (
          <>
            <h2 className="location">{city.name}</h2>
            <h1 className="temp">{Math.round(city.main.temp)}°C</h1>
            <h3 className="tempmin-max">
              Min: {Math.round(city.main.temp_min)}°C | Max:{" "}
              {Math.round(city.main.temp_max)}°C
            </h3>
          </>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default Tempapp;
