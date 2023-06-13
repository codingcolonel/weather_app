// WEATHER WEBSITE USING OPEN WEATHER MAP API

// Data Arrays
let cityData = [];
let weather = [];
let searchSuggestions = [];
let recentCities = initArray('recentCities');

// Global variables
let currentUnit = 'metric';

// Get city data
fetch('./data/worldcities.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    cityData = data;
  })
  .catch(function (err) {
    console.log('error: ' + err);
  });

// HTML Elements
let searchInEl = document.getElementById('search-container');
let clearBtnEl = document.getElementById('clear-icon');
let autocomBoxEl = document.getElementById('autocom-box');
let celsiusEl = document.getElementById('celsius');
let farenheitEl = document.getElementById('farenheit');

// Event listeners
document.addEventListener('click', clearSearchSuggestions);
searchInEl.addEventListener('keyup', displaySearchSuggestions);
searchInEl.addEventListener('click', displaySearchSuggestions);
clearBtnEl.addEventListener('click', clearSearchBar);
clearBtnEl.addEventListener('click', displaySearchSuggestions);
celsiusEl.addEventListener('click', changeUnits);
farenheitEl.addEventListener('click', changeUnits);

// If geolocation is supported get user position
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(getLocation);
} else {
  console.log('Geolocation is not supported by this browser.');
}

function processLocation(position) {
  // Find the city that's closest to provided coordinates
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve(
        closestCoordinateInArray(
          position.coords.latitude,
          position.coords.longitude,
          cityData
        )
      );
    }, 1000);
  });
}

function getLocation(position) {
  // Create new promise
  const promise = processLocation(position);
  promise.then(onFulfilled);
}

function onFulfilled(city) {
  // Once promise is fulfilled, display weather at current location
  selectSearchSuggestion(city);
}

function clearSearchBar() {
  // Clear the search bar on button press
  searchInEl.value = '';
}

function changeUnits(e) {
  // If button is pressed change units and update weather
  if (e.target.id === 'celsius') {
    currentUnit = 'metric';
    celsiusEl.style.borderWidth = '4px';
    farenheitEl.style.borderWidth = '1px';
    document.getElementById('unit').innerHTML = '°C';
    document.getElementById('fl-unit').innerHTML = '°C';
    document.getElementById('wind-unit').innerHTML = 'm/s';
    selectSearchSuggestion('unit');
  } else if (e.target.id === 'farenheit') {
    currentUnit = 'imperial';
    celsiusEl.style.borderWidth = '1px';
    farenheitEl.style.borderWidth = '4px';
    document.getElementById('unit').innerHTML = '°F';
    document.getElementById('fl-unit').innerHTML = '°F';
    document.getElementById('wind-unit').innerHTML = 'mph';
    selectSearchSuggestion('unit');
  }
}

function clearSearchSuggestions(e) {
  // Clear search suggestions when clicked elsewhere
  if (e.target.id !== 'search-container' && e.target.id !== 'clear-icon')
    autocomBoxEl.innerHTML = '';
}

function displaySearchSuggestions(e) {
  // Clear suggestions before adding new ones
  autocomBoxEl.innerHTML = '';
  let searchInVal = searchInEl.value;

  // If Enter is pressed, select first suggestion
  if (e.key === 'Enter') {
    selectSearchSuggestion(e);
    return;
  } else {
    searchSuggestions = [];
  }

  // If search bar is empty, get the most recent picked locations from local storage
  if (searchInVal === '') {
    // If no recent locations exist, display top  5 from array
    if (recentCities.length === 0) {
      for (let i = 0; i < 5; i++) {
        searchSuggestions.push(cityData[i]);
      }
    } else {
      for (let i = 0; i < 5; i++) {
        if (recentCities[i] !== undefined) {
          searchSuggestions.push(recentCities[i]);
        }
      }
    }
  } else {
    // Sort exact matches first
    cityData.forEach((element) => {
      // Limit to 5 suggestions
      if (searchSuggestions.length <= 4) {
        let isAMatch = true;
        for (let i = 0; i < searchInVal.length; i++) {
          // Check if lengths are the same
          if (searchInVal.length !== element.city.length) {
            isAMatch = false;
            break;
          }

          // Check if the letters match
          if (element.city[i].toLowerCase() !== searchInVal[i].toLowerCase()) {
            isAMatch = false;
            break;
          }
        }
        // If everything matches, add to array
        if (isAMatch !== false) {
          searchSuggestions.push(element);
        }
        isAMatch = true;
      }
    });

    // If 5 Suggestions has not been reached add other suggestions until there is 5 or there is no remaining suggestions
    cityData.forEach((element) => {
      if (searchSuggestions.length <= 4) {
        let isAMatch = true;
        for (let i = 0; i < searchInVal.length; i++) {
          // Check if the letters match
          if (element.city[i] === undefined) {
            isAMatch = false;
            break;
          } else if (
            element.city[i].toLowerCase() !== searchInVal[i].toLowerCase()
          ) {
            isAMatch = false;
            break;
          }
        }

        // Make sure city hasn't already been added
        if (
          searchSuggestions.some(
            (x) =>
              x.city === element.city && x.admin_name === element.admin_name
          ) === true
        ) {
          isAMatch = false;
        }

        // If everything matches, add to array
        if (isAMatch !== false) {
          searchSuggestions.push(element);
        }
        isAMatch = true;
      }
    });
  }

  // Add HTML elements
  let newUl = document.createElement('ul');
  autocomBoxEl.appendChild(newUl);

  for (let i = 0; i < searchSuggestions.length; i++) {
    const element = searchSuggestions[i];
    let newLi = document.createElement('li');
    newLi.setAttribute('id', `${i}`);
    newLi.innerHTML = `&nbsp${element.city}, ${element.admin_name}, ${element.country}`;
    newLi.addEventListener('click', selectSearchSuggestion);
    newUl.appendChild(newLi);
  }
}

function selectSearchSuggestion(e) {
  let cityObj;
  if (e.key === 'Enter') {
    // If Enter is pressed, select first suggestion
    cityObj = searchSuggestions[0];
  } else if (e.target) {
    // If suggestion was clicked, select that one
    cityObj = searchSuggestions[JSON.parse(e.target.id)];
  } else if (e.city !== undefined) {
    // If geolocation was used, select that city
    cityObj = e;
  } else if (e === 'unit') {
    // If the units were changed, select last selected city
    cityObj = recentCities[0];
  }

  // Make sure city doesn't exist in local storage
  let isInArray = false;
  for (let i = 0; i < recentCities.length; i++) {
    const element = recentCities[i];
    if (
      cityObj.city === element.city &&
      cityObj.admin_name === element.admin_name
    ) {
      // If city already exists, remove it and add it to the start of the array
      recentCities.splice(i, 1);
      recentCities.unshift(cityObj);
      saveArray('recentCities', recentCities);
      isInArray = true;
    }
  }

  if (isInArray === false) {
    // Save Selected City to Local Storage
    recentCities.unshift(cityObj);
    saveArray('recentCities', recentCities);
  }

  // API request
  let request = new XMLHttpRequest();
  request.open(
    'GET',
    `https://api.openweathermap.org/data/2.5/weather?lat=${cityObj.lat}&lon=${cityObj.lng}&exclude={part}&appid=e31d73c474dafc414b05ba01b6943b7a&units=${currentUnit}`
  );
  request.send();
  request.onload = () => {
    if (request.status === 200) {
      // If no errors, add API data to array and call Update function
      weather = JSON.parse(request.response);
      updateHTMLElements(cityObj);
    } else {
      // Output error in console
      console.log(`error ${request.status} ${request.statusText}`);
    }
  };
}

function updateHTMLElements(cityObj) {
  // Get HTML elements
  let tempEl = document.getElementById('temp');
  let imgEl = document.getElementById('weather-img');
  let feelsLikeEl = document.getElementById('feels-like-temp');
  let conditionEl = document.getElementById('weather-condition');
  let citySpanEl = document.getElementById('h1-location');
  let humidityEl = document.getElementById('humidity');
  let windSpeedEl = document.getElementById('wind-speed');
  let windDirectionEl = document.getElementById('wind-direction');

  // Update title
  citySpanEl.innerHTML = `${cityObj.city}, ${cityObj.admin_name}, ${cityObj.iso3}`;

  // Update temperature
  tempEl.innerHTML = `${Math.round(weather.main.temp)}`;
  // Update feels like temperature
  feelsLikeEl.innerHTML = `${Math.round(weather.main.temp)}`;
  // Update weather condition
  let str = weather.weather[0].description;
  conditionEl.innerHTML = `${str.charAt(0).toUpperCase() + str.slice(1)}`;
  // Update humidity
  humidityEl.innerHTML = `${weather.main.humidity}`;
  // Update wind info
  windSpeedEl.innerHTML = `${Math.round(weather.wind.speed)}`;
  windDirectionEl.innerHTML = `${convertDegreesToDirection(weather.wind.deg)}`;

  // Update image based on weather condition
  if (weather.weather[0].id < 300) {
    imgEl.setAttribute('src', 'img/thunder.png');
  } else if (weather.weather[0].id < 400) {
    imgEl.setAttribute('src', 'img/drizzle.png');
  } else if (weather.weather[0].id < 505) {
    imgEl.setAttribute('src', 'img/rain.png');
  } else if (weather.weather[0].id === 511) {
    imgEl.setAttribute('src', 'img/freezing-rain.png');
  } else if (weather.weather[0].id < 532) {
    imgEl.setAttribute('src', 'img/shower-rain.png');
  } else if (weather.weather[0].id < 623) {
    imgEl.setAttribute('src', 'img/snow.png');
  } else if (weather.weather[0].id < 782) {
    imgEl.setAttribute('src', 'img/mist.png');
  } else if (weather.weather[0].id === 800) {
    imgEl.setAttribute('src', 'img/clear.png');
  } else if (weather.weather[0].id === 801) {
    imgEl.setAttribute('src', 'img/few-clouds.png');
  } else if (weather.weather[0].id === 802) {
    imgEl.setAttribute('src', 'img/scattered-clouds.png');
  } else if (weather.weather[0].id === 803) {
    imgEl.setAttribute('src', 'img/broken-clouds.png');
  } else if (weather.weather[0].id === 804) {
    imgEl.setAttribute('src', 'img/overcast-clouds.png');
  }
}

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
//
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//
// Key: e31d73c474dafc414b05ba01b6943b7a

// https://openweathermap.org/weather-conditions

// to do
// recent locations using local storage - done
// modify algoritm - done
// add functionality to suggestions - done
// update weather using API - done
// get user location - done finally
// mystery error (ex. was) - fixed!
// Make it look nice - good enough
// Add farenheit option - done
