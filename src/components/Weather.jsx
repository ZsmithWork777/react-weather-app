import { useState, useEffect, useRef } from 'react';
import './Weather.css';
import searchIcon from '../assets/search.png';
import clearIcon from '../assets/clear.png';
import cloudIcon from '../assets/cloud.png';
import rainIcon from '../assets/rain.png';
import snowIcon from '../assets/snow.png';
import windIcon from '../assets/wind.png';
import humidityIcon from '../assets/humidity.png';

const iconMap = {
  '01d': clearIcon, '01n': clearIcon,
  '02d': cloudIcon, '02n': cloudIcon,
  '03d': cloudIcon, '03n': cloudIcon,
  '04d': cloudIcon, '04n': cloudIcon,
  '09d': rainIcon,  '09n': rainIcon,
  '10d': rainIcon,  '10n': rainIcon,
  '13d': snowIcon,  '13n': snowIcon,
};

const Weather = () => {
const inputRef = useRef()
  const [weatherData, setWeatherData] = useState(null);

  const search = async (city) => {
    if (city ==='') {
      alert('Please enter a city name');
      return;
    }
    try {
     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod === '404') {
        alert('City not found. Please try again.');
        return;
      }
      const code = data?.weather?.[0]?.icon || '01d';
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: iconMap[code] || clearIcon,
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    search('london');
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input ref={(inputRef)} type="text" placeholder="Search" />
        <img src={searchIcon} alt="" onClick={()=>search(inputRef.current.value)}/>
      </div>

      {/* Guard: use a default icon until data arrives */}
      <img
        src={weatherData ? weatherData.icon : clearIcon}
        alt=""
        className="weather-icon"
      />

      <p className="temperature">
        {weatherData ? `${weatherData.temperature}°c` : '...'}
      </p>
      <p className="location">
        {weatherData ? weatherData.location : '...'}
      </p>

      <div className="weather-data">
        <div className="col">
          <img src={humidityIcon} alt="" />
          <div>
            <p>{weatherData ? `${weatherData.humidity} %` : '...'}</p>
            <span>Humidity</span>
          </div>
        </div>

        <div className="col">
          <img src={windIcon} alt="" />
          <div>
            <p>{weatherData ? `${weatherData.windSpeed} m/s` : '...'}</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;