document.addEventListener("DOMContentLoaded", function () {
    let locationInput = document.getElementById('location');
    let searchButton = document.getElementById('search-button'); // Ensure your button has this ID

    function getWeather() {
        let location = locationInput.value.trim();
        if (!location) return;

        let apiKey = 'aedc0b7466d74c8db7d171735252703';
        let searchUrl = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${location}`;

        fetch(searchUrl)
            .then(response => response.json())
            .then(locations => {
                if (locations.length === 0) {
                    document.getElementById('weather-result').innerHTML = `<p class="text-danger">Location not found!</p>`;
                    return;
                }

                let bestMatch = locations[0].name;
                let weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${bestMatch}&aqi=yes`;
                let forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${bestMatch}&days=5`;

                fetch(weatherUrl)
                    .then(response => response.json())
                    .then(data => {
                        document.body.style.background = getBackgroundColor(data.current.condition.text);
                        let weatherResult = `
                            <h4>${data.location.name}, ${data.location.country}</h4>
                            <h5>${data.current.temp_c}°C</h5>
                            <p>${data.current.condition.text}</p>
                            <img src="https:${data.current.condition.icon}" alt="Weather Icon">
                            <p>Feels Like: ${data.current.feelslike_c}°C</p>
                            <p>Humidity: ${data.current.humidity}%</p>
                            <p>Wind: ${data.current.wind_kph} km/h</p>
                        `;
                        document.getElementById('weather-result').innerHTML = weatherResult;
                    });

                fetch(forecastUrl)
                    .then(response => response.json())
                    .then(data => {
                        let forecastData = data.forecast.forecastday.map(day => `
                            <div>
                                <p>${day.date.slice(-2)}/${day.date.slice(5, 7)}</p>
                                <img src="https:${day.day.condition.icon}" alt="Icon">
                                <p>${day.day.avgtemp_c}°C</p>
                            </div>
                        `).join('');
                        document.getElementById('forecast').innerHTML = forecastData;
                    });
            })
            .catch(error => {
                document.getElementById('weather-result').innerHTML = `<p class="text-danger">Location not found!</p>`;
            });
    }

    function getBackgroundColor(condition) {
        if (condition.includes("Rain")) return "linear-gradient(135deg, #3a7bd5, #3a6073)";
        if (condition.includes("Cloud")) return "linear-gradient(135deg, #5d4157, #a8caba)";
        if (condition.includes("Sunny")) return "linear-gradient(135deg, #ffb347, #ffcc33)";
        return "linear-gradient(135deg, #1f1c2c, #928dab)";
    }

    function fetchWeatherOnEnter(event) {
        if (event.key === 'Enter') {
            getWeather();
        }
    }

    locationInput.addEventListener('keypress', fetchWeatherOnEnter);
    searchButton.addEventListener('click', getWeather);
});
