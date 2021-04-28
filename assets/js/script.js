const apiKey = "64bd3999714c46abd7c44d1c5bd7c5fc";

var cityNameEl = document.querySelector("#search-input");
var submitButtonEl = document.querySelector("#submit-search");
//var searchHistoryButtonsEl = document.querySelector(".list-of-city");
var searchHistoryButtonsEl = document.querySelector("#button-clicked");
var currentWeatherDisplayEl = document.querySelector(".current-weather");
var searchedCityEl = document.querySelector("#city-selected");
var forecastEl = document.querySelector(".next-five-days");
var listOfCitiesSearched =
  JSON.parse(localStorage.getItem("ListOfCities")) || [];
// var searchHistoryButtonsEl = document.querySelector(".list-of-city");
// var currentWeatherDisplayEl = document.querySelector(".current-weather");
// var listOfCitiesSearched = [];

function searchSubmitHandler(event) {
  event.preventDefault();
  var cityName = cityNameEl.value.trim();
  console.log("in submit ", cityName);
  if (cityName) {
    getCityWeather(cityName);
    addToHistory(cityName);
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
  // fetch(apiUrl)
  //   .then(function (response) {
  //     if (response.ok) {
  //       response.json().then(function (data) {
  //         console.log("data is ", data);
  //         // console.log("typeof", typeof data);
  //         displayTodaysWeather(data, city);
  //         addToHistory(city);
  //         return;
  //       });
  //     } else {
  //       alert("Error: " + response.statusText);
  //     }
  //   })
  //   .catch(function (error) {
  //     alert("Unable to connect to weather api");
  //   });
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        // console.log("dtata", data);
        return response.json();
      } else {
        alert("Error: " + response.statusText);
      } // pass the data as promise to next then block
    })
    .then(function (data) {
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      console.log("lat", lat);
      console.log("lon", lon);
      console.log("data", data);

      console.log("here");

      return fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&exclude=minutely,hourly" +
          "&appid=" +
          apiKey +
          "&units=imperial"
      ); // make a 2nd request and return a promise
    })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log("data is ", data);
          // // console.log("typeof", typeof data);
          displayTodaysWeather(data, city);
          displayForecast(data, city);
          addToHistory(city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      console.log("Request failed", error);
    });
}

function buttonClickHandler(event) {
  //var cityNameClicked = event.target.getAttribute("id");
  if (searchedCityEl.value == "Searched Cities") {
    alert("Please  select an option");
  } else {
    var cityNameClicked = searchedCityEl.value;
    console.log(cityNameClicked);
    getCityWeather(cityNameClicked);
  }
}

function showSearchedHistory() {
  for (var i = 0; i < listOfCitiesSearched.length; i++) {
    var optionEl = document.createElement("option");
    optionEl.text = listOfCitiesSearched[i];
    optionEl.value = listOfCitiesSearched[i];
    searchedCityEl.append(optionEl);
  }
}

showSearchedHistory();

function addToHistory(cityclicked) {
  console.log(listOfCitiesSearched);
  console.log(listOfCitiesSearched.length);
  var cityUpperCase = cityclicked.toUpperCase();
  console.log(cityUpperCase);

  if (
    listOfCitiesSearched.length === 0 ||
    !listOfCitiesSearched.includes(cityUpperCase)
  ) {
    console.log("in null");
    listOfCitiesSearched.push(cityUpperCase);
    localStorage.setItem("ListOfCities", JSON.stringify(listOfCitiesSearched));
    showSearchedHistory();
  }
}

function displayTodaysWeather(weatherData, cityname) {
  //why its showinh object object not here in the fetch section console.log("data is" + weatherData);
  console.log("city is ", cityname);
  var todayDate = moment().format("MM/DD/YYYY");
  console.log(todayDate);
  //name of city , date
  currentWeatherDisplayEl.textContent = "";
  console.log(weatherData.current.temp);
  var cityDisplayNameEl = document.createElement("h2");

  var cityname =
    cityname.charAt(0).toUpperCase() + cityname.slice(1).toLowerCase();

  var image = document.createElement("img");
  var imageUrl =
    "https://openweathermap.org/img/wn/" +
    weatherData.current.weather[0].icon +
    ".png";

  image.setAttribute("src", imageUrl);
  cityDisplayNameEl.innerHTML =
    cityname +
    " " +
    "<span style='font-size: 1.4rem;'>" +
    todayDate +
    "</span>" +
    "";

  cityDisplayNameEl.append(image);
  //temp
  var tempDisplayEl = document.createElement("p");
  tempDisplayEl.textContent = "Temp: " + weatherData.current.temp + " ºF";
  //wind
  var windDisplayEl = document.createElement("p");
  windDisplayEl.textContent =
    "Wind: " + weatherData.current.wind_speed + " MPH";
  //humidity
  var humidityDisplayEl = document.createElement("p");
  humidityDisplayEl.textContent =
    "Humidity: " + weatherData.current.humidity + " %";
  //uv index 1-2 low green,3-5 moderate yellow orange, 6-7high orange,8-9-10 very high red, 11+ extreme  purple
  var uvDisplayEl = document.createElement("p");
  if (weatherData.current.uvi < 3) {
    var innertext =
      "<span style='background-color:green; border-radius:25%; padding:0.25rem'>";
  } else if (weatherData.current.uvi < 7) {
    var innertext =
      "<span style='background-color:orange; border-radius:25%; padding:0.25rem'>";
  } else if (weatherData.current.uvi > 7) {
    var innertext =
      "<span style='background-color:red; border-radius:25%; padding:0.25rem'>";
  }
  uvDisplayEl.innerHTML =
    "UV: " +
    // "<span style='background-color:green; border-radius:25%; padding:0.25rem'>" +
    innertext +
    weatherData.current.uvi +
    "</span>";
  //span.setAttribute("style","color:white;background-color:red;");
  currentWeatherDisplayEl.append(cityDisplayNameEl);
  currentWeatherDisplayEl.append(tempDisplayEl);
  currentWeatherDisplayEl.append(windDisplayEl);
  currentWeatherDisplayEl.append(humidityDisplayEl);
  currentWeatherDisplayEl.append(uvDisplayEl);
  currentWeatherDisplayEl.setAttribute(
    "style",
    " padding:2rem;font-weight:bold;background-color:#9198e5;"
  );

  // console.log(" Temperature:" + " " + weatherData.current.temp + " " + "ºF");
}

// displayTodaysWeather();
// displayForecast();
function displayForecast(weatherData, city) {
  forecastEl.textContent = "";
  for (var i = 0; i < 5; i++) {
    var nextDate = moment()
      .add(i + 1, "days")
      .format("MM/DD/YYYY");
    //console.log(dueDate);
    //genetrate a card

    var divEl = document.createElement("div");
    //date,img
    var dateEl = document.createElement("p");
    dateEl.textContent = nextDate;

    console.log(weatherData.daily[i].weather[0].icon);
    //image
    var image = document.createElement("img");
    var imageUrl =
      "https://openweathermap.org/img/w/" +
      weatherData.daily[i].weather[0].icon +
      ".png";

    image.setAttribute("src", imageUrl);

    //temp
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + weatherData.daily[i].temp.day + " ºF";
    //wind
    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + weatherData.daily[i].wind_speed + " MPH";
    //humidity
    var humidityEl = document.createElement("p");
    humidityEl.textContent =
      "Humidity: " + weatherData.daily[i].humidity + " %";

    // divEl
    //   .append(dateEl)
    //   .append(image)
    //   .append(tempEl)
    //   .append(windEl)
    //   .append(humidityEl);
    //script.js:240 Uncaught (in promise) TypeError: Cannot read property 'append' of undefined
    // at displayForecast (script.js:240)
    // at script.js:92
    divEl.setAttribute(
      "style",
      " padding:1rem;font-weight:bold;background-color:#9198e5; border-style: solid;border-radius:5%; margin:0.1rem;"
    );
    //dif in append and appendchild
    $(divEl).addClass("flex-fill");
    divEl.append(dateEl);
    divEl.append(image);
    divEl.append(tempEl);
    divEl.append(windEl);
    divEl.append(humidityEl);
    forecastEl.append(divEl);
  }
}
submitButtonEl.addEventListener("click", searchSubmitHandler);
searchHistoryButtonsEl.addEventListener("click", buttonClickHandler);

getCityWeather("seattle");
