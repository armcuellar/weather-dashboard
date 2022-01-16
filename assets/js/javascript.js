var citySearchEl = document.querySelector(".citySearch");
var currentWeatherEl = document.querySelector(".currentWeather");
var fiveDayWeatherEl = document.querySelector(".fiveDayWeather");
var cityInputEl = document.querySelector("#city");

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

                    cityWeather(lat, lon);
                });
            }
            else {
                alert("City Not Found");
            }
        })
        .catch(function (error) {
            alert("There is an error");
        });
}
var cityWeather = function (latt, long) {
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latt + "&lon=" + long + "&appid=cc93eb9259444b15987361c38b14835c";
    console.log(weatherApi);
}

citySearchEl.addEventListener("submit", searchCity);