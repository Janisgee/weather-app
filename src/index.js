let mainCurrentTime = document.querySelector("#main-current-time");
let bottomCurrentTime = document.querySelector("#bottom-livetime");

function updateDisplayTime(time) {
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    let day = days[time.getDay()];
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let ampm = hours < 12 ? "a.m." : "p.m.";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let timeString = `${day} ${hours}:${minutes} ${ampm}`;
    mainCurrentTime.innerHTML = timeString;
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

    let timeString = `UPDATED ${year}/${month}/${date} ${hours}:${minutes} ${ampm} AWST`;
    bottomCurrentTime.innerHTML = timeString;
}

updateDisplayTime(new Date());
updateBottomTime(new Date());

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

let tempC = 22;
let tempF = (tempC * 9) / 5 + 32;
tempF = Math.round(tempF);

function changeToCelsius() {
    let currentTemp = document.querySelector("#currentTemperature");
    currentTemp.innerHTML = ` ${tempC} `;
    displayFahrenheitUnit.classList.remove("active");
    displayCelsiustUnit.classList.add("active");
}

function changeToFahrenheit() {
    let currentTemp = document.querySelector("#currentTemperature");
    currentTemp.innerHTML = ` ${tempF} `;
    displayCelsiustUnit.classList.remove("active");
    displayFahrenheitUnit.classList.add("active");
}

let displayCelsiustUnit = document.querySelector("#celsiusButton");
displayCelsiustUnit.addEventListener("click", changeToCelsius);

let displayFahrenheitUnit = document.querySelector("#fahrenheitButton");
displayFahrenheitUnit.addEventListener("click", changeToFahrenheit);

function updatePosition(position) {
    let currentGpsLatitude = position.coords.latitude;
    let currentGpslongitude = position.coords.longitude;
    let apiKey = `1c3ae5d402b2dfe20732c3c1797bed76`;
    let units = "metric";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentGpsLatitude}&lon=${currentGpslongitude}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(updateSearchWeatherCondition);
}

function updateSearchWeatherCondition(updateTemperatureResponse) {
    let currentSearchTemperature = Math.round(
        updateTemperatureResponse.data.main.temp
    );
    tempC = currentSearchTemperature;
    tempF = Math.round((tempC * 9) / 5 + 32);
    changeToCelsius();
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

    document.querySelector("#miniumTemperature").innerHTML = Math.round(
        updateTemperatureResponse.data.main.temp_min
    );
    document.querySelector("#maximumTemperature").innerHTML = Math.round(
        updateTemperatureResponse.data.main.temp_max
    );
    console.log(updateTemperatureResponse.data);
}

function changePosition() {
    navigator.geolocation.getCurrentPosition(updatePosition);
}

let gpsButton = document.querySelector(".gps-location");
gpsButton.addEventListener("click", changePosition);

changePosition();