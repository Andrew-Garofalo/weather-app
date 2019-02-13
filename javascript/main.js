
//pull in and read longitude and latitude from zipcode
function getLongLat(lonLat) {
    let file = 'https://open.mapquestapi.com/geocoding/v1/address?key=GRaJazt7puDJbHGA2GfNkGmLnGHXoeKK&location=' + lonLat;
    return $.ajax({
        url: file,
        type: 'get',
        dataType: 'json',
        async: true,
        success: function(data) {
            lonLat = data.results[0].locations;

            //get the latitude and longitude for the US location
            for(let i=0; i<lonLat.length; i++){
                if(lonLat[i].adminArea1 == "US") {
                    lonLat = data.results[0].locations[i].displayLatLng;
                    break;
                }
            }
            lonLat = Object.values(lonLat);

            getForecastZone(lonLat.toString());
        } 
    });
}

//retrieve the forecast zone from latitude and longitude
function getForecastZone(lonLat) {
    let file = 'https://api.weather.gov/points/' + lonLat;
    return $.ajax({
        url: file,
        type: 'get',
        dataType: 'json',
        async: true,
        success: function(data) {
            //get the url needed to retrieve weather data for the location
            weatherURL = data.properties.forecastGridData;
            
            getWeather(weatherURL);
        } 
    });
}

//retrieve all the various weather data and populate webpage
function getWeather(weatherURL) {
    let file = weatherURL;
    return $.ajax({
        url: file,
        type: 'get',
        dataType: 'json',
        async: true,
        success: function(data) {
            //get the high temp
            highTemps= data.properties.maxTemperature;
            //get the low temp
            lowTemps= data.properties.minTemperature;
            //get the current temp
            currtemp = data.properties.temperature.values;
            //get the humidity data
            humidity = data.properties.relativeHumidity;
            //get the chance of precipitation
            precipitationProbability = data.properties.probabilityOfPrecipitation;
            //get the wind speed
            wind = data.properties.windSpeed;
            //get cloud cover
            skyCover = data.properties.skyCover;

            $(".currtemp").html((currtemp[0].value * (9.0/5.0) + 32).toFixed(0));
            $(".hi1").html((highTemps.values[0].value * (9.0/5.0) + 32).toFixed(0) + "&deg;");
            $(".lo1").html((lowTemps.values[0].value * (9.0/5.0) + 32).toFixed(0) + "&deg;");
            $(".precip").html("Precipitation: " + (precipitationProbability.values[0].value).toFixed(0) + "%");
            $(".wind").html("Wind: " + (wind.values[0].value * 1.151).toFixed(0) + " MPH");
            $(".humid").html("Humidity: " + (humidity.values[0].value).toFixed(0) + "%");

            makeCards();
        } 
    });
}



function makeCards() {
    hi = $(".hi");
    lo = $(".lo");
    wDay = $(".wday");

    //Get current day of the week
    date = new Date();
    var weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    for(let i=0; i<7; i++) {
        //increment the day of the week to populate the week's weather information
        weekDay = weekday[(date.getDay() + i) % 7];
        wDay[i].innerHTML = weekDay;

        //populate the high and low temps
        hi[i].innerHTML = (highTemps.values[i].value * (9.0/5.0) + 32).toFixed(0) + "&deg;";
        lo[i].innerHTML = (lowTemps.values[i].value * (9.0/5.0) + 32).toFixed(0) + "&deg;";
    }

}

$(document).ready(
    function () {
        getLongLat("90001");

        $('.carousel').carousel( {
            dist: 0,
            noWrap: true
        });

        $(".zipcode").on('keypress',function(e) {
            if(e.which == 13) {
                getLongLat(this.value);
            }
        });
    
    });