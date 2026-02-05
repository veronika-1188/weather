import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import '../widget/Widget.css'
import search_icon from '../../assets/search.png'
import clear_icon from '../../assets/clear.png'
import humidity_icon from '../../assets/humidity.png'
import wind_icon from '../../assets/wind.png'
import WEATHER_ICONS from '../../assets/dataIcons'

const Weather = () => {
    const inputRef = useRef(0)
    const [weatherData, setWeatherData] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const search = async(city) =>{
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=9f9cd458da4352407e473758a6a5c509&lang=ru`

            const response = await fetch(url);

            if(!response.ok) {
                throw new Error('Город не найден');
               
            }


            const data = await response.json();

            const icon = WEATHER_ICONS[data.weather[0].icon] || clear_icon;

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
            })
            setMessage('')

        }catch(error){
            setMessage(error.message);
        };
    }

    const handleSearch = () => {
        const city = inputRef.current?.value;
        if (city) search(city);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    useEffect(() => {
        search('Moscow');
    }, [])
    return ( 
        <div className='weather'>
            <div className="search-bar">
                <input ref={inputRef} type="search" placeholder='Введите город' onKeyPress={handleKeyPress}/>
                <img src={search_icon} alt="#"  onClick={handleSearch}/>
            </div>

            {message && <p className='error-message'>{message}, попробуйте еще раз</p>}
            <img src={weatherData.icon || clear_icon} alt="" className="weather-icon" />
            <p className="temperature">{weatherData.temperature ? `${weatherData.temperature}°C` : ''}</p>
            <p className="location">{weatherData.location}</p>


           <div className="weather-data">
                        <WeatherDetail 
                            icon={humidity_icon} 
                            value={`${weatherData.humidity}%`} 
                            label="Влажность" 
                        />
                        <WeatherDetail 
                            icon={wind_icon} 
                            value={`${weatherData.windSpeed} м/с`} 
                            label="Скорость ветра" 
                        />
                    </div>
        </div>
     );
}

const WeatherDetail = ({ icon, value, label }) => (
    <div className="col">
        <img src={icon} alt={label} />
        <div>
            <p>{value}</p>
            <span>{label}</span>
        </div>
    </div>
);
 
export default Weather;