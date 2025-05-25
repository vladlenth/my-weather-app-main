import "./style.css";
const API_KEY = process.env.API_KEY;


let lastLocation = '';

document.getElementById('weather-form').addEventListener('submit', function(event) {
    event.preventDefault();
    lastLocation = document.getElementById('location').value.trim();
    if (lastLocation) {
        getWeather(lastLocation);
    }
});

async function getWeather(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=us&key=${API_KEY}&contentType=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка сети');
        const data = await response.json();
        const weatherInfo = processWeatherData(data);
        displayWeatherInfo(weatherInfo);
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось получить данные о погоде.');
    }
}

function processWeatherData(data) {
    const temperatureF = data.currentConditions.temp;
    const temperatureC = fahrenheitToCelsius(temperatureF);
    const roundedTemperatureC = Math.ceil(temperatureC);
    return {
        temperatureF,
        temperatureC: roundedTemperatureC,
        description: data.currentConditions.conditions,
        location: data.resolvedAddress,
    };
}

function fahrenheitToCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9;
}


function displayWeatherInfo(weatherInfo) {
    const apiDiv = document.getElementById('api-weather');
    apiDiv.innerHTML = `
        <div class="api-data">
            <h3>Текущий прогноз</h3>
            <p>Температура (Fahrenheit): ${weatherInfo.temperatureF}°F</p>
            <p>Температура (Celsius): ${weatherInfo.temperatureC}°C</p>
            <p>Описание: ${weatherInfo.description}</p>
            <p>Местоположение: ${weatherInfo.location}</p>
            <button id="refresh-btn">Обновить</button>
        </div>
    `;
}

document.getElementById('api-weather').addEventListener('click', function(event) {
    if (event.target && event.target.id === 'refresh-btn') {
        if (lastLocation) {
            getWeather(lastLocation);
        } else {
            alert('Пожалуйста, введите местоположение и выполните поиск.');
        }
    }
});