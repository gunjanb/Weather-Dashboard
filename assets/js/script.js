const apiKey = "64bd3999714c46abd7c44d1c5bd7c5fc";

var cityNameEl = document.querySelector("#search-input");
var submitButtonEl = document.querySelector("#submit-search");
var searchHistoryButtonsEl = document.querySelector(".list-of-city");
var currentWeatherDisplayEl = document.querySelector(".current-weather");
var listOfCitiesSearched = [];

function searchSubmitHandler(event) {
  event.preventDefault();
  var cityName = cityNameEl.value.trim();
  console.log("in submit ", cityName);
  if (cityName) {
    getCityWeather(cityName);

    currentWeatherDisplayEl.textContent = "";
    cityNameEl.value = "";
  } else {
    alert("Please enter  city name");
  }
}

function getCityWeather(city) {
  //   var apiUrl = "https://api.github.com/users/" + user + "/repos";
  //The latitude of Seattle, WA, USA is 47.608013, and the longitude is -122.335167
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey +
    "&units=imperial";

  console.log("apiURL", apiUrl);
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log("data is ", data);
          // console.log("typeof", typeof data);
          displayTodaysWeather(data, city);
          addHistoryButton(city);
          return;
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to weather api");
    });
}

function buttonClickHandler(event) {
  var cityNameClicked = event.target.getAttribute("id");
  //console.log(cityNameClicked);
  getCityWeather(cityNameClicked);
}

function addHistoryButton(cityclicked) {
  var listOfCitiesSearched =
    JSON.parse(localStorage.getItem("ListOfCities")) || [];
  console.log(listOfCitiesSearched);
  if (!listOfCitiesSearched.includes(cityNameClicked)) {
    listOfCitiesSearched.push(cityNameClicked);
    console.log(listOfCitiesSearched);
    localStorage.setItem("ListOfCities", JSON.stringify(listOfCitiesSearched));
  }
}

function displayTodaysWeather(weatherData, cityname) {
  //console.log("data is" + JSON.stringify(weatherData));
  // console.log("city is ", cityname);
  // console.log(" Temperature:" + " " + weatherData.main.temp + " " + "ºF");
}
submitButtonEl.addEventListener("click", searchSubmitHandler);
searchHistoryButtonsEl.addEventListener("click", buttonClickHandler);
