const apiKey = "64bd3999714c46abd7c44d1c5bd7c5fc";
//handlers
var cityNameEl = document.querySelector("#search-input");
var submitButtonEl = document.querySelector("#submit-search");
var searchHistoryButtonsEl = document.querySelector("#button-clicked");
var currentWeatherDisplayEl = document.querySelector(".current-weather");
var searchedCityEl = document.querySelector("#city-selected");
var forecastEl = document.querySelector(".next-five-days");
const noOfDaysToShowForecast = 5;
// search history in local storage
var listOfCitiesSearched =
  JSON.parse(localStorage.getItem("ListOfCities")) || [];

// validates if city is entered by user, if yes then calls getweather function and add city name to search history
function searchSubmitHandler(event) {
  event.preventDefault();
  var cityName = cityNameEl.value.trim();
  //console.log("in submit and city name is", cityName);
  if (cityName) {
    getCityWeather(cityName);
    addToHistory(cityName);
  } else {
    alert("Please enter  city name");
  }
}

//call weather api gets lon and lat for city and throw alert if user entered wrong city or there is any error
function getCityWeather(city) {
  //url
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        alert("Error: " + response.statusText);
        return Promise.reject(new Error(response.statusText));
      }
    })
    // .catch(alert)
    .then(function (data) {
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      // console.log("lat", lat);
      // console.log("lon", lon);
      // console.log("data", data);
      return fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`
      );
    })
    .then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        alert("Error: " + response.statusText);
        return Promise.reject(new Error(response.statusText));
      }
    })
    // .catch(alert)
    .then(function (data) {
      //if finally get data then call current ,forecast weather function and add city to search history
      //console.log("data", data);
      displayTodaysWeather(data, city);
      displayForecast(data, city);
      addToHistory(city);
    });
}

//check if user selected any searched city if yes then call weather function to display weather
function buttonClickHandler(event) {
  if (searchedCityEl.value == "Searched Cities") {
    alert("Please  select an option");
  } else {
    var cityNameClicked = searchedCityEl.value;
    //console.log(cityNameClicked);
    getCityWeather(cityNameClicked);
  }
}

//display searched cities
function showSearchedHistory() {
  for (var i = 0; i < listOfCitiesSearched.length; i++) {
    var optionEl = document.createElement("option");
    optionEl.text = listOfCitiesSearched[i];
    optionEl.value = listOfCitiesSearched[i];
    searchedCityEl.append(optionEl);
  }
}

//display searched history when page is loaded
showSearchedHistory();

//add serached cities to local storage
function addToHistory(cityclicked) {
  //store all cities in caps to avoid mismatch
  var cityUpperCase = cityclicked.toUpperCase();

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

// display todays weather
function displayTodaysWeather(weatherData, cityname) {
  //why its showing object object  here not in the fetch section console.log("data is" + weatherData);?

  //get date
  var todayDate = moment().format("MM/DD/YYYY");

  // remove content
  currentWeatherDisplayEl.textContent = "";

  //create h2
  var cityDisplayNameEl = document.createElement("h2");

  //convert city name for correct display
  var cityname =
    cityname.charAt(0).toUpperCase() + cityname.slice(1).toLowerCase();

  //create image
  var image = document.createElement("img");
  //add define url for src
  var imageUrl =
    "https://openweathermap.org/img/wn/" +
    weatherData.current.weather[0].icon +
    ".png";

  image.setAttribute("src", imageUrl);
  //add city name and make date small
  cityDisplayNameEl.innerHTML =
    cityname +
    " " +
    "<span style='font-size: 1.4rem;'>" +
    todayDate +
    "</span>" +
    "";

  // then add image to name and date
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
  //check for uv value for color
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
    "UV: " + innertext + weatherData.current.uvi + "</span>";

  //append to display current weather
  currentWeatherDisplayEl.append(cityDisplayNameEl);
  currentWeatherDisplayEl.append(tempDisplayEl);
  currentWeatherDisplayEl.append(windDisplayEl);
  currentWeatherDisplayEl.append(humidityDisplayEl);
  currentWeatherDisplayEl.append(uvDisplayEl);

  // set attributes for current weather div
  currentWeatherDisplayEl.setAttribute(
    "style",
    " padding:2rem;font-weight:bold;background-color:#9198e5;"
  );
}

//display forecast
function displayForecast(weatherData, city) {
  //remove previous content
  forecastEl.textContent = "";

  // add same set of elements in loop for each day
  for (var i = 0; i < noOfDaysToShowForecast; i++) {
    // get the date
    var nextDate = moment()
      .add(i + 1, "days")
      .format("MM/DD/YYYY");

    // create a div
    var divEl = document.createElement("div");

    //date,img
    var dateEl = document.createElement("p");
    dateEl.textContent = nextDate;

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

    // divEl?
    //   .append(dateEl)
    //   .append(image)
    //   .append(tempEl)
    //   .append(windEl)
    //   .append(humidityEl);
    //script.js:240 Uncaught (in promise) TypeError: Cannot read property 'append' of undefined
    // at displayForecast (script.js:240)
    // at script.js:92

    //set  attribute for div
    divEl.setAttribute(
      "style",
      " padding:1rem;font-weight:bold;background-color:#9198e5; border-style: solid;border-radius:5%; margin:0.1rem;"
    );
    //dif in append and appendchild?

    //add flex-fill class to div
    $(divEl).addClass("flex-fill");

    //append to forecast
    divEl.append(dateEl);
    divEl.append(image);
    divEl.append(tempEl);
    divEl.append(windEl);
    divEl.append(humidityEl);
    forecastEl.append(divEl);
  }
}

// add listener on search button
submitButtonEl.addEventListener("click", searchSubmitHandler);
//add listner on searched history button
searchHistoryButtonsEl.addEventListener("click", buttonClickHandler);

//display seattle weather by default
getCityWeather("seattle");
