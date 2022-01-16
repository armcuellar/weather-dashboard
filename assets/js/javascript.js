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
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latt + "&lon=" + long + "&appid=cc93eb9259444b15987361c38b14835c";

    currentWeatherEl.textContent = "";

    fetch(weatherApi)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    var date = city.toUpperCase() + " " + moment.unix(data.current.dt).format("MMM Do, YYYY");

                    var cityTitle = document.createElement("h2");
                    cityTitle.textContent = date;

                    // Checks weather code and returns icon image
                    var weatherCode = data.current.weather[0].id;

                    if (200 <= weatherCode && weatherCode <= 232) {
                        var icon = "11d";
                    }
                    else if (300 <= weatherCode && weatherCode <= 321) {
                        var icon = "09d";
                    }
                    else if (500 <= weatherCode && weatherCode <= 504) {
                        var icon = "10d";
                    }
                    else if (weatherCode == 511) {
                        var icon = "13d";
                    }
                    else if (520 <= weatherCode && weatherCode <= 531) {
                        var icon = "09d";
                    }
                    else if (600 <= weatherCode && weatherCode <= 622) {
                        var icon = "13d";
                    }
                    else if (701 <= weatherCode && weatherCode <= 781) {
                        var icon = "50d";
                    }
                    else if (weatherCode == 800) {
                        var icon = "01d";
                    }
                    else if (weatherCode == 801) {
                        var icon = "02d";
                    }
                    else if (weatherCode == 802) {
                        var icon = "03d";
                    }
                    else if (803 <= weatherCode && weatherCode <= 804) {
                        var icon = "04d";
                    }

                    var weatherIcon = document.createElement("img");
                    weatherIcon.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                    // end of weather icon code 

                    currentWeatherEl.appendChild(cityTitle);
                    currentWeatherEl.appendChild(weatherIcon);

                    console.log(weatherCode);

                    console.log(weatherApi);
                    console.log(date);

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

citySearchEl.addEventListener("submit", searchCity);