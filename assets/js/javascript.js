var citySearchEl = document.querySelector(".citySearch");
var currentWeatherEl = document.querySelector(".currentWeather");
var fiveDayWeatherEl = document.querySelector(".fiveDayWeather");
var cityInputEl = document.querySelector("#city");

// function to obtain city's coordinates
var searchCity = function (event) {
    event.preventDefault();
    console.log(cityInputEl.value);

    var city = cityInputEl.value;
    var searchCityApi = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=cc93eb9259444b15987361c38b14835c";

    console.log(searchCityApi);

    fetch(searchCityApi)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;

                    cityWeather(city, lat, lon);
                });
            }
            else {
                alert("City Not Found, enter a US City");
            }
        })
        .catch(function (error) {
            alert("There is an error obtaining data");
        });
    cityInputEl.placeholder = city;
    cityInputEl.value = "";
}

// function to use city coordinates to get weather data
var cityWeather = function (city, latt, long) {

    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latt + "&lon=" + long + "&units=imperial&appid=cc93eb9259444b15987361c38b14835c";

    currentWeatherEl.textContent = "";

    fetch(weatherApi)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    var current = data.current;
                    var date = city.toUpperCase() + " " + moment.unix(current.dt).format("ddd MMM Do, YYYY");

                    var cityTitle = document.createElement("h2");
                    cityTitle.textContent = date;

                    var weatherIcon = document.createElement("img");
                    weatherIcon.src = "http://openweathermap.org/img/wn/" + current.weather[0].icon + "@2x.png";
                    // end of weather icon code 

                    var tempText = document.createElement("p");
                    tempText.textContent = "Temp: " + current.temp + " °F";
                    var windText = document.createElement("p");
                    windText.textContent = "Wind: " + current.wind_speed + " MPH";
                    var humidityText = document.createElement("p");
                    humidityText.textContent = "Humidity: " + current.humidity + " %";
                    var uvIndexText = document.createElement("p");
                    uvIndexText.textContent = "UV Index: " + current.uvi;

                    currentWeatherEl.appendChild(cityTitle);
                    currentWeatherEl.appendChild(weatherIcon);
                    currentWeatherEl.appendChild(tempText);
                    currentWeatherEl.appendChild(windText);
                    currentWeatherEl.appendChild(humidityText);
                    currentWeatherEl.appendChild(uvIndexText);


                    if (data != undefined) {
                        futureWeather(data);
                    }
                });
            }
            else {
                alert("No current Weather Data");
            }
        })
        .catch(function (error) {
            alert("There is an error obtaining data");
        });
}
var futureWeather = function (data) {
    console.log(data.daily);
    fiveDayWeatherEl.textContent = ""

    var futureData = data.daily;

    // checks 5 day forcast
    for (i = 1; i < 6; i++) {
        var date = moment.unix(data.daily[i].dt).format("ddd MMM Do, YYYY");

        var cityTitle = document.createElement("h3");
        cityTitle.textContent = date;

        var weatherIcon = document.createElement("img");
        weatherIcon.src = "http://openweathermap.org/img/wn/" + futureData[i].weather[0].icon + "@2x.png";
        // end of weather icon code 

        var tempText = document.createElement("p");
        tempText.textContent = "Temp: " + futureData[i].temp.day + " °F";
        var windText = document.createElement("p");
        windText.textContent = "Wind: " + futureData[i].wind_speed + " MPH";
        var humidityText = document.createElement("p");
        humidityText.textContent = "Humidity: " + futureData[i].humidity + " %";

        fiveDayWeatherEl.appendChild(cityTitle);
        fiveDayWeatherEl.appendChild(weatherIcon);
        fiveDayWeatherEl.appendChild(tempText);
        fiveDayWeatherEl.appendChild(windText);
        fiveDayWeatherEl.appendChild(humidityText);

    }

}

citySearchEl.addEventListener("submit", searchCity);