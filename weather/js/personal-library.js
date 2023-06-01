// LOCAL STORAGE
// Initiate array to local storage values
function initArray(array) {
  let jsonArray = localStorage.getItem(array);
  return JSON.parse(jsonArray) ?? [];
}

// Save array values to local storage
function saveArray(reference, array) {
  localStorage.setItem(reference, JSON.stringify(array));
}

// ARRAY OBJECTS
// Return first index of a specific value in an array of objects
function getindexOfArrayObject(attribute, value, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][`${attribute}`] == value) {
      return i;
    }
  }
  return -1;
}

// Return closest value in an array
function closestValue(num, arr) {
  var curr = arr[0];
  var diff = Math.abs(num - curr);
  for (var i = 0; i < arr.length; i++) {
    var newdiff = Math.abs(num - arr[i]);
    if (newdiff < diff) {
      diff = newdiff;
      curr = arr[i];
    }
  }
  return curr;
}

// Return closest value in an property
function closestPropertyValue(num, arr, attribute) {
  var curr = arr[0];
  var diff = Math.abs(num - curr);
  for (var i = 0; i < arr.length; i++) {
    var newdiff = Math.abs(num - arr[i].JSON.parse(attribute));
    if (newdiff < diff) {
      diff = newdiff;
      curr = arr[i].JSON.parse(attribute);
    }
  }
  return curr;
}

// Return closest coordinate in an array
function closestCoordinateInArray(lat, lng, arr) {
  let minDistance = 10000;
  let closestPoint;
  for (let i = 0; i < arr.length; i++) {
    distance = Math.sqrt(
      (lat - arr[i].lat) * (lat - arr[i].lat) +
        (lng - arr[i].lng) * (lng - arr[i].lng)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = arr[i];
    }
  }
  return closestPoint;
}

// Return closest compass direction to provided degrees
function convertDegreesToDirection(degrees) {
  // Define array of directions
  directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  // Split into the 8 directions
  degrees = (degrees * 8) / 360;

  // round to nearest integer.
  degrees = Math.round(degrees, 0);

  // Ensure it's within 0-7
  degrees = (degrees + 8) % 8;

  return directions[degrees];
}

// RANDOM LIBRARY
// Return a random decimbal b/t low (inclusive) and high (exclusive)
function randomDec(low, high) {
  return Math.random() * (high - low) + low;
}

// Return a random integer b/t low (inclusive) and high (exclusive)
function randomInt(low, high) {
  return Math.floor(randomDec(low, high));
}

// Return a random rgb color- 'rgb(__, __, __)'
function randomRGB() {
  return `rgb(${randomInt(0, 256)}, ${randomInt(0, 256)}, ${randomInt(
    0,
    256
  )})`;
}
