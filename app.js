Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOGY0ZWYyYi0zOWM5LTQ4ZGQtODdlNi05N2FhNDdlZjc0ODEiLCJpZCI6MjIwMjQ0LCJpYXQiOjE3MTc1ODA0OTh9.L47Bnq6gZ6Apj8whSxKcS6OATrIjQtP9Ti5cqHfI6lM';

var viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});

// Function to fetch weather data based on latitude and longitude
async function fetchWeather(latitude, longitude) {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=492ac9c5809a30780347397e338e8d00&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to update the info box with latitude, longitude, and weather
async function updateInfoBox(latitude, longitude) {
    document.getElementById('lat').textContent = latitude;
    document.getElementById('lon').textContent = longitude;

    const weatherData = await fetchWeather(latitude, longitude);
    if (weatherData) {
        const weatherDescription = weatherData.weather[0].description;
        const temperature = weatherData.main.temp;
        document.getElementById('weather').textContent = `${weatherDescription}, ${temperature}°C`;
    } else {
        document.getElementById('weather').textContent = 'Unable to fetch weather data';
    }
}

// Add event listener for mouse click or touch
viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
    // Get the cartesian coordinates of the clicked point
    var cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);

    if (cartesian) {
        // Convert cartesian coordinates to cartographic (latitude, longitude)
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);

        // Update the info box with the latitude, longitude, and weather
        updateInfoBox(latitude, longitude);
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

viewer.screenSpaceEventHandler.setInputAction(function onTouch(movement) {
    // Get the cartesian coordinates of the touched point
    var cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);

    if (cartesian) {
        // Convert cartesian coordinates to cartographic (latitude, longitude)
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);

        // Update the info box with the latitude, longitude, and weather
        updateInfoBox(latitude, longitude);
    }
}, Cesium.ScreenSpaceEventType.PINCH_END);