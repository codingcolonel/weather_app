// Control GUI changes

// HTML Elements
let vCurDiv = document.getElementById('current-div');
let vHourlyDiv = document.getElementById('hourly-div');
let v36HourDiv = document.getElementById('36-hour-div');
let v7DayDiv = document.getElementById('7-day-div');
let vCurLink = document.getElementById('current-link');
let vHourlyLink = document.getElementById('hourly-link');
let v36HourLink = document.getElementById('36-hour-link');
let v7DayLink = document.getElementById('7-day-link');

// Display Current Weather
vCurLink.addEventListener('click', displayCurrentWeather);

function displayCurrentWeather() {
  vCurDiv.style.display = 'block';
  vHourlyDiv.style.display = 'none';
  v36HourDiv.style.display = 'none';
  v7DayDiv.style.display = 'none';
}

// Display Hourly Weather
vHourlyLink.addEventListener('click', displayHourlyWeather);

function displayHourlyWeather() {
  vCurDiv.style.display = 'none';
  vHourlyDiv.style.display = 'block';
  v36HourDiv.style.display = 'none';
  v7DayDiv.style.display = 'none';
}

// Display 36 Hour Weather
v36HourLink.addEventListener('click', display36HourWeather);

function display36HourWeather() {
  vCurDiv.style.display = 'none';
  vHourlyDiv.style.display = 'none';
  v36HourDiv.style.display = 'block';
  v7DayDiv.style.display = 'none';
}

// Display 7 Day Weather
v7DayLink.addEventListener('click', display7DayWeather);

function display7DayWeather() {
  vCurDiv.style.display = 'none';
  vHourlyDiv.style.display = 'none';
  v36HourDiv.style.display = 'none';
  v7DayDiv.style.display = 'block';
}
