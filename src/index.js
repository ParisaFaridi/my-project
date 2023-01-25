let day = document.querySelector(".day");
let time = document.querySelector(".time");
let city = document.querySelector(".city");
let searchBtn = document.querySelector(".search-btn");
let searchInput = document.querySelector(".search-input");
let temperature = document.querySelector(".temperature");
let toCelciusBtn = document.querySelector("#celcius");
let toFahranhiteBtn = document.querySelector("#fahranhite");
let humidity = document.querySelector("#humidity");
let wind = document.querySelector("#wind");
let desc = document.querySelector("#desc");
let icon = document.querySelector(".main-icon");
let forecastDiv = document.querySelector(".forecast");
let temp = 7;
let apiKey = "62bc298785543e137bc6756e514eb1c3";
let baseURL = `https://api.openweathermap.org/data/2.5/weather?`;

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  if (searchInput.value === null || searchInput.value === "") {
    return;
  }
  searchCity(searchInput.value);
});
toCelciusBtn.addEventListener("click", function (event) {
  event.preventDefault();
  temperature.innerHTML = `${Math.round(temp)}°C`;
  toFahranhiteBtn.classList.remove("active");
  toCelciusBtn.classList.add("active");
});
toFahranhiteBtn.addEventListener("click", function (event) {
  event.preventDefault();
  temperature.innerHTML = `${Math.round(temp * 1.8 + 32)}°F`;
  toFahranhiteBtn.classList.add("active");
  toCelciusBtn.classList.remove("active");
});

function setDate() {
  let date = new Date();
  let week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  day.innerHTML = week[date.getDay()];
  time.innerHTML = `${hours}:${minutes}`;
}

function searchCity(cityIn) {
  axios
    .get(`${baseURL}q=${cityIn}&appid=${apiKey}&&units=metric`)
    .then(function (response) {
      displayTemp(response.data);
      getForecast(response.data.coord.lat, response.data.coord.lon);
    });
}
function displayTemp(data) {
  temp = data.main.temp;
  temperature.innerHTML = `${Math.round(temp)}°C`;
  city.innerHTML = data.name;
  humidity.innerHTML = data.main.humidity;
  wind.innerHTML = Math.round(data.wind.speed);
  const str = data.weather[0].description;
  const str2 = str.charAt(0).toUpperCase() + str.slice(1);
  desc.innerHTML = str2;
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  );
}
function getForecast(lat, lon) {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
    )
    .then(function (response) {
      displayForecast(response.data.daily);
    });
}
function displayForecast(forecast) {
  console.log(forecast);
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (day, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2 forecast-day">
            <div>${getWeekDay(day.dt)}</div>
            <img src="http://openweathermap.org/img/wn/${
              day.weather[0].icon
            }@2x.png" alt="weather icon" width="42" />
            <span>${Math.round(day.temp.max)}<span>°C</span></span>
      </div>
      `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastDiv.innerHTML = forecastHTML;
}
function getWeekDay(dt) {
  let date = new Date(dt * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

setDate();
