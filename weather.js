"use strict"
// import config from './config.js';

// const api_key = config.apiKey;
const corsProxyUrl = 'https://api.allorigins.win/raw?url=';
// const map_api = config.mapApi;
const api_key = "%API_KEY%";
const map_api = "%MAP_API_KEY%";
let city = "Paris";
let isFahrenheit = true;

function updateTemp(result) {
    let temp, min, max;
    let unit;
    if (isFahrenheit) {
        temp = Math.round(result.main.temp * (9/5) - 459.67);
        min = Math.round(result.main.temp_min * (9/5) - 459.67);
        max = Math.round(result.main.temp_max * (9/5) - 459.67);
        unit = 'F';
    }
    else {
        temp = Math.round(result.main.temp - 273.15);
        min = Math.round(result.main.temp_min - 273.15);
        max = Math.round(result.main.temp_max - 273.15);
        unit = 'C';
    }
    let displayTemp = `Temperature: ${temp}\u00B0${unit}`;
    let displayMinMax = `Min of ${min}\u00B0${unit} and Max of ${max}\u00B0${unit}`;
    $("#minmax").text(displayMinMax);
    $("#temperature").text(displayTemp);
}

function updateWeather(city) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`
    $.ajax ({
        url: url,
        success: function (result) { // upon success [retrieving data], put data into result

            // Location
            let displayLocation = `Current Weather in ${result.name}, ${result.sys.country}`;
            $("#location").text(displayLocation);

            // Temp
            updateTemp(result);

            // Wind
            let windSpeed = Math.round(result.wind.speed / 0.44704);
            let displayWind = `Wind: ${windSpeed} MPH`;
            $("#wind").text(displayWind);

            // Sky
            let displaySky = `Sky Conditions: ${result.weather[0].description}`;
            $("#sky").text(displaySky);

            // // Rain
            // if (result.rain && result.rain["3h"] !== undefined) {
            //     let displayRain = `Rain: ${result.rain["3h"]} mm`;
            //     $("#rain").text(displayRain);
            // } else {
            //     $("#rain").text("No rain data available");
            // }

            let timezoneOffset = result.timezone + 21600; // 7200 is local offset
            let localTime = new Date(new Date().getTime() + (timezoneOffset * 1000));
            let displayTime = `Time: ${localTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true})}`;
            $("#timezone").text(displayTime);
        }
    });
}

function getCityPhoto(city) {
    let cityUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${city}&inputtype=textquery&fields=photos,formatted_address,name,geometry&key=${map_api}`
    let requestUrl = corsProxyUrl + cityUrl;
    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK' && data.candidates.length > 0) {
                const placeId = data.candidates[0].place_id;
                const photoReference = data.candidates[0].photos[0].photo_reference;
                let  photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference=${photoReference}&key=${map_api}`
                document.getElementById('cityPhoto').src = photoUrl;
                console.log('It worked');
            }   
            else {
                console.error('City not found');
            }
        })
        .catch(error => console.error('Error fetching city details: ', error));
}

updateWeather(city);
getCityPhoto(city);


$("#searchButton").click(function() {
    let newCity = $("#destination").val().trim();
    if (newCity !== "") {
        city = newCity;
        updateWeather(city);
        getCityPhoto(city);
    }
});


$("#toggleButton").click(function() {
    isFahrenheit = !isFahrenheit;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
    $.ajax ({
        url: url,
        success: function (result) {
            updateTemp(result);
        }
    })
});

$("#destination").on('keyup', function(e) {
    if (e.keyCode === 13) {
        $('#searchButton').click();
    }
});

// json = javascript object notation

// - `coord`
//     - `coord.lon` Longitude of the location
//     - `coord.lat` Latitude of the location
// - `weather` (more info [Weather condition codes](https://openweathermap.org/weather-conditions))
//     - `weather.id` Weather condition id
//     - `weather.main` Group of weather parameters (Rain, Snow, Clouds etc.)
//     - `weather.description` Weather condition within the group. Please find more [here.](https://openweathermap.org/current#list) You can get the output in your language. [Learn more](https://openweathermap.org/current#multi)
//     - `weather.icon` Weather icon id
// - `base` Internal parameter
// - `main`
//     - `main.temp` Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
//     - `main.feels_like` Temperature. This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
//     - `main.pressure` Atmospheric pressure on the sea level, hPa
//     - `main.humidity` Humidity, %
//     - `main.temp_min` Minimum temperature at the moment. This is minimal currently observed temperature (within large megalopolises and urban areas). Please find more info [here.](https://openweathermap.org/current#min) Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
//     - `main.temp_max` Maximum temperature at the moment. This is maximal currently observed temperature (within large megalopolises and urban areas). Please find more info [here.](https://openweathermap.org/current#min) Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
//     - `main.sea_level` Atmospheric pressure on the sea level, hPa
//     - `main.grnd_level` Atmospheric pressure on the ground level, hPa
// - `visibility` Visibility, meter. The maximum value of the visibility is 10 km
// - `wind`
//     - `wind.speed` Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour
//     - `wind.deg` Wind direction, degrees (meteorological)
//     - `wind.gust` Wind gust. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour
// - `clouds`
//     - `clouds.all` Cloudiness, %
// - `rain`
//     - `rain.1h` (where available) Rain volume for the last 1 hour, mm. Please note that only mm as units of measurement are available for this parameter
//     - `rain.3h` (where available) Rain volume for the last 3 hours, mm. Please note that only mm as units of measurement are available for this parameter
// - `snow`
//     - `snow.1h`(where available) Snow volume for the last 1 hour, mm. Please note that only mm as units of measurement are available for this parameter
//     - `snow.3h` (where available)Snow volume for the last 3 hours, mm. Please note that only mm as units of measurement are available for this parameter
// - `dt` Time of data calculation, unix, UTC
// - `sys`
//     - `sys.type` Internal parameter
//     - `sys.id` Internal parameter
//     - `sys.message` Internal parameter
//     - `sys.country` Country code (GB, JP etc.)
//     - `sys.sunrise` Sunrise time, unix, UTC
//     - `sys.sunset` Sunset time, unix, UTC
// - `timezone` Shift in seconds from UTC
// - `id` City ID. Please note that built-in geocoder functionality has been deprecated. Learn more [here](https://openweathermap.org/current#builtin)
// - `name` City name. Please note that built-in geocoder functionality has been deprecated. Learn more [here](https://openweathermap.org/current#builtin)
// - `cod` Internal parameter