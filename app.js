const APPID = "d457b5971c6648f53c5c25f476262517";

updateByLocation = (loc) => {
    const location = loc;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=${APPID}`;
    sendRequest(url);
};

updateByGeo = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${APPID}`;
    sendRequest(url);
};

sendRequest = (url) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => { 
        if (request.readyState == 4 && request.status == 200) {
            returnData(request)
        }     
    };
    request.open("GET", url);
    request.send();
};

returnData = (request) => {
    const data = JSON.parse(request.responseText);
    const weather = {};
    weather.location = data.name;
    weather.description = capitalizeFirstLetters(data.weather[0].description);
    weather.temp = Math.round(data.main.temp);
    weather.humidity = data.main.humidity;
    weather.wind = data.wind.speed;
    weather.direction = convertDirection(data.wind.deg);
    weather.iconCode = data.weather[0].icon;
    updateUI(weather);
};

convertDirection = (degrees) => {
    let direction;
    if (degrees >= 0 && degrees < 90) {
        direction = 'North'
    } else if (degrees >= 90 && degrees < 180) {
        direction = 'East'
    } else if (degrees >= 180 && degrees < 270) {
        direction = 'South'
    } else if (degrees >= 270 && degrees < 360) {
        direction = 'West'
    }
    return direction; 
};

updateUI = (weather) => {
    document.getElementById('temp').innerHTML = weather.temp;
    document.getElementById('location').innerHTML = weather.location;
    document.getElementById('description').innerHTML = weather.description;
    document.getElementById('humidity').innerHTML = weather.humidity;
    document.getElementById('wind').innerHTML = weather.wind;
    document.getElementById('direction').innerHTML = weather.direction;
    document.getElementById('icon').innerHTML = `<img id="weather-icon" src="https://openweathermap.org/img/w/${weather.iconCode}.png"/>`;
};

getCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        const location = window.prompt("Could not discover location. What's your city?");
        updateByLocation(location);
    };
};

showPosition = (position) => {
    updateByGeo(position.coords.latitude, position.coords.longitude);
};

capitalizeFirstLetters = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

locationSearch = (e) => {
    e.preventDefault();
    const location = document.getElementById('location-input').value;
    updateByLocation(location);
};

setupEventListeners = () => {
    document.getElementById('location-form').addEventListener('submit', locationSearch);
    document.getElementById('geo-btn').addEventListener('click', getCurrentLocation);
};

init = () => {
    getCurrentLocation();
    setupEventListeners();
};

init();