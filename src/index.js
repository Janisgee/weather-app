let mainCurrentTime = document.querySelector("#main-current-time");
let bottomCurrentTime = document.querySelector("#bottom-livetime");

function updateDisplayTime(time, timeZone) {
    let timeString;
    try {
        timeString = time.toLocaleString("en-us", {
            timeZone: timeZone,
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "shortGeneric",
        });
    } catch (error) {
        timeString = time.toLocaleString("en-us", {
            timeZone: timeZone,
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    mainCurrentTime.innerHTML = timeString;
}

function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
}

function displayForecast(updateTemperatureResponse) {
    let forecast = updateTemperatureResponse.data.daily;
    let forecastElement = document.querySelector("#forecast");

    let forecastHTML = `<div class="row forecast">`;
    forecast.forEach(function(forecastDay, index) {
        if (index < 6) {
            forecastHTML =
                forecastHTML +
                `    
                        <div class="col-2">
                            <div class = "weather-forecast-date">
                            ${formatDay(forecastDay.dt)}
                            </div>
                            <img id="forecastIcon"src="http://openweathermap.org/img/wn/${
                              forecastDay.weather[0].icon
                            }@2x.png" alt="Day Forecast Image" />
                            <div class="weather-forecast-temperature">
                                <span class="weather-forecast-temperature-max"><strong> ${Math.round(
                                  forecastDay.temp.max
                                )}°C </strong></span>
                                <span class="weather-forecast-temperature-min">
                                <small> ${Math.round(
                                  forecastDay.temp.min
                                )}°C </small>
                            </span>
                        </div>
                    </div>`;
        }
    });

    updateDisplayTime(new Date(), updateTemperatureResponse.data.timezone);
    updateBottomTime(new Date());
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
}

function updateBottomTime(time) {
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let ampm = hours < 12 ? "AM" : "PM";

    month = month < 10 ? "0" + month : month;
    date = date < 10 ? "0" + date : date;
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let timeString = `UPDATED ${year}/${month}/${date} ${hours}:${minutes} ${ampm}`;
    bottomCurrentTime.innerHTML = timeString;
}

function citySearch(searchEvent) {
    searchEvent.preventDefault();
    let searchInput = document.querySelector("#searchEngine");
    let typeCity = searchInput.value.trim();

    let apiKey = `1c3ae5d402b2dfe20732c3c1797bed76`;
    let apiWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${typeCity}&appid=${apiKey}&units=metric`;
    axios
        .get(apiWeatherUrl)
        .then(updateSearchWeatherCondition)
        .catch(function() {
            alert("Please type a valid city name.");
        });
}

let displayCity = document.querySelector("#searchBar");
displayCity.addEventListener("submit", citySearch);

function updatePosition(position) {
    let currentGpsLatitude = position.coords.latitude;
    let currentGpslongitude = position.coords.longitude;
    let apiKey = `1c3ae5d402b2dfe20732c3c1797bed76`;
    let units = "metric";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentGpsLatitude}&lon=${currentGpslongitude}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(updateSearchWeatherCondition);
}

function getForecast(coordinates) {
    let apiKey = `1c3ae5d402b2dfe20732c3c1797bed76`;
    let units = "metric";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;

    axios.get(apiUrl).then(displayForecast);
}

function updateSearchWeatherCondition(updateTemperatureResponse) {
    let currentSearchTemperature = Math.round(
        updateTemperatureResponse.data.main.temp
    );
    let currentTemp = document.querySelector("#currentTemperature");
    currentTemp.innerHTML = ` ${currentSearchTemperature} `;
    let currentLocation = updateTemperatureResponse.data.name;
    let updateLocation = document.querySelector("#searchCity");
    updateLocation.innerHTML = `${currentLocation}`;
    document.querySelector("#humidityLevel").innerHTML = Math.round(
        updateTemperatureResponse.data.main.humidity
    );
    document.querySelector("#windSpeedLevel").innerHTML = Math.round(
        updateTemperatureResponse.data.wind.speed
    );

    let arr = updateTemperatureResponse.data.weather[0].description.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    let capitalizeWeatherDiscription = arr.join(" ");
    let weatherDiscription = document.querySelector("#description");
    weatherDiscription.innerHTML = capitalizeWeatherDiscription;

    let iconElement = document.querySelector("#icon");

    document.querySelector("#miniumTemperature").innerHTML = Math.round(
        updateTemperatureResponse.data.main.temp_min
    );
    document.querySelector("#maximumTemperature").innerHTML = Math.round(
        updateTemperatureResponse.data.main.temp_max
    );

    iconElement.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${updateTemperatureResponse.data.weather[0].icon}@2x.png`
    );

    getForecast(updateTemperatureResponse.data.coord);
}

function changePosition() {
    navigator.geolocation.getCurrentPosition(updatePosition);
}

let gpsButton = document.querySelector(".gps-location");
gpsButton.addEventListener("click", changePosition);

changePosition();