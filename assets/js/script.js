var citySearchEl = document.querySelector(".citySearch");
var currentWeatherEl = document.querySelector(".currentWeather");
var fiveDayWeatherEl = document.querySelector(".fiveDayWeather");
var recentSearchEl = document.querySelector(".recentSearch");
var cityInputEl = document.querySelector("#city");
var cityInfo = [];

// function to obtain city's coordinates
var searchCity = function (event) {
    event.preventDefault();
    console.log(cityInputEl.value);

    var city = cityInputEl.value;
    var searchCityApi = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=cc93eb9259444b15987361c38b14835c";

    console.log(searchCityApi);

    fetch(searchCityApi)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;

                    // uses coordinate to get current and future forecast as well as saves them
                    cityWeather(city, lat, lon);
                    recentSearch(city, lat, lon);
                    saveSearch(city, lat, lon);
                });
            }
            else {
                alert("City Not Found, enter a US City");
            }
        })
        .catch(function (error) {
            alert("There is an error obtaining data");
        });

}

// function to use city coordinates to get weather data
var cityWeather = function (city, latt, long) {
    cityInputEl.placeholder = city;
    cityInputEl.value = "";
    // api call
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latt + "&lon=" + long + "&units=imperial&appid=cc93eb9259444b15987361c38b14835c";

    currentWeatherEl.textContent = "";

    fetch(weatherApi)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    var current = data.current;
                    var date = moment.unix(current.dt).format("ddd MMM Do, YYYY");

                    var cityTitle = document.createElement("h2");
                    cityTitle.textContent = city.toUpperCase();

                    var cityDate = document.createElement("h2");
                    cityDate.textContent = date;

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

                    if (current.uvi < 2) {
                        uvIndexText.className = "bg-success"
                    }
                    else if (current.uvi > 7) {
                        uvIndexText.className = "bg-danger"
                    }
                    else {
                        uvIndexText.className = "bg-warning"
                    }


                    currentWeatherEl.appendChild(cityTitle);
                    currentWeatherEl.appendChild(cityDate);
                    currentWeatherEl.appendChild(weatherIcon);
                    currentWeatherEl.appendChild(tempText);
                    currentWeatherEl.appendChild(windText);
                    currentWeatherEl.appendChild(humidityText);
                    currentWeatherEl.appendChild(uvIndexText);

                    futureWeather(data);
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

// function to obtain and display the five day forecast
var futureWeather = function (data) {
    console.log(data.daily);
    fiveDayWeatherEl.textContent = ""

    var futureData = data.daily;

    // gets 5 day forcast
    for (i = 1; i < 6; i++) {
        var date = moment.unix(data.daily[i].dt).format("ddd MMM Do, YYYY");

        var dayContainer = document.createElement("div")
        dayContainer.classList = "col-lg-2 bg-secondary text-white"
        var cityTitle = document.createElement("h3");
        cityTitle.textContent = date;

        var weatherIcon = document.createElement("img");
        weatherIcon.src = "http://openweathermap.org/img/wn/" + futureData[i].weather[0].icon + "@2x.png";


        var tempText = document.createElement("p");
        tempText.textContent = "Temp: " + futureData[i].temp.day + " °F";
        var windText = document.createElement("p");
        windText.textContent = "Wind: " + futureData[i].wind_speed + " MPH";
        var humidityText = document.createElement("p");
        humidityText.textContent = "Humidity: " + futureData[i].humidity + " %";

        dayContainer.appendChild(cityTitle);
        dayContainer.appendChild(weatherIcon);
        dayContainer.appendChild(tempText);
        dayContainer.appendChild(windText);
        dayContainer.appendChild(humidityText);

        fiveDayWeatherEl.appendChild(dayContainer);

    }

}
// function to save search to local array
var saveSearch = function (cityName, latitude, longitude) {

    var cityObj = {
        city: cityName,
        lat: latitude,
        lon: longitude,
    }
    cityInfo.push(cityObj)
    save();
}
// function to save to local storage
var save = function () {
    localStorage.setItem("weatherCity", JSON.stringify(cityInfo));
}
// function to create recent search list
var recentSearch = function (cityName, latitude, longitude) {
    var recentCity = document.createElement("button");
    recentCity.textContent = cityName;
    recentCity.classList = "p-2 bd-highlight"
    recentCity.lat = latitude;
    recentCity.lon = longitude;
    recentSearchEl.prepend(recentCity);
}
// function to retrieve weather forecast from saved city
var retrieveCity = function (event) {
    var city = event.target.textContent;
    var lat = event.target.lat;
    var lon = event.target.lon;

    cityWeather(city, lat, lon);
}
// function to load recent search list from local storage
var load = function () {
    var searchHistory = localStorage.getItem("weatherCity")
    if (!searchHistory) {
        return false;
    }
    searchHistory = JSON.parse(searchHistory);

    for (i = 0; i < searchHistory.length; i++) {
        cityInfo.push(searchHistory[i]);
        var city = searchHistory[i].city;
        var lat = searchHistory[i].lat;
        var lon = searchHistory[i].lon;

        recentSearch(city, lat, lon);
    }


}

citySearchEl.addEventListener("submit", searchCity);
recentSearchEl.addEventListener("click", retrieveCity);
load();