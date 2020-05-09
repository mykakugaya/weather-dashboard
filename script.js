//If search history was stored, retrieve
var pastSearches = localStorage.getItem("searches") ? JSON.parse(localStorage.getItem("searches")) : [];
var today = moment().format("l");
var APIkey = "7c39208aa3217ceafee7b802df1fe08b";

function showHistory() {
    $("#searchHistory").empty();

    //Show search history
    for (let i=0; i<pastSearches.length; i++) {
        var li = $("<button>").addClass("list-group-item list-group-item-action pastSearch");
        li.text(pastSearches[i]);
        $("#searchHistory").prepend(li);
    }

    $("#cityResult").empty();
    getCurrent(pastSearches[pastSearches.length-1]);
    getForecast(pastSearches[pastSearches.length-1]);


    //When a recent search is clicked, weather information shown
    $(".pastSearch").on("click", function() {
        $("#cityResult").empty();

        var item = $(this).text();
        getCurrent(item);
        getForecast(item);
    })
}

function getCurrent(city) {
    //Request current weather data from API
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(queryURL);
        console.log(response);

        //Show current weather information
        var topDiv = $("<div>").addClass("current");

        var cityDiv = $("<div>").addClass("nameDateIcon");
        var icon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
        cityDiv.html(`<h2>${city.charAt(0).toUpperCase() + city.slice(1)} (${today}) </h2>`);
        
        cityDiv.append(icon);
        topDiv.append(cityDiv);
        
        var temp = $("<p>").text("Temperature: " + ((response.main.temp-273.15)*(9/5)+32).toFixed(2) + "°F");
        topDiv.append(temp);
        var humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
        topDiv.append(humidity);
        var windspd = $("<p>").text("Wind Speed: " + response.wind.speed + " mph");
        topDiv.append(windspd);

        $("#cityResult").append(topDiv);
        
        //separate ajax call for UV data
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var UVurl = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: UVurl,
            method: "GET"
        }).then(function(UVresponse) {
            console.log(UVurl);
            console.log(UVresponse);
            var uvIndexDiv = $("<div>").html("UV index: ");
            var uvIndexVal = $("<div>").html(UVresponse.value);
            if (UVresponse.value>8) {
                uvIndexVal.addClass("UVsevere rounded");
            }
            else if (UVresponse.value>3) {
                uvIndexVal.addClass("UVmoderate rounded");
            }
            else {
                uvIndexVal.addClass("UVfavorable rounded");
            }
            uvIndexDiv.append(uvIndexVal);
            topDiv.append(uvIndexDiv);
        })
    })
}

function getForecast(city) {
    //Request forecast data from API
    var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey;
    
    $.ajax({ 
        url: forecastURL,
        method: "GET"
    }).then(function(response) {
        console.log(forecastURL);
        console.log(response);
        var results = response.list;

        // Show 5-day forecast information
        var botDiv = $("<div>").addClass("forecast");
        botDiv.html("<h2>5-day Forecast:</h2>");
        var ul = $("<ul>").addClass("list-group list-group-horizontal");
        
        //Obtain and show data for each day
        for (i=0; i<5; i++) {
            var day = results[i];
            //Each day forecast
            var dayResult = $("<li>").addClass("forecastDay list-group-item");
            var dateAhead = moment().add(i+1, "days").format("l");
            dayResult.text(dateAhead);
            ul.append(dayResult);

            var dayIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + day.weather[0].icon + ".png" );
            dayResult.append(dayIcon);

            var dayTemp = $("<p>").text("Temp: " + ((day.main.temp-273.15)*(9/5)+32).toFixed(2) + "°F");
            dayResult.append(dayTemp);

            var dayHum = $("<p>").text("Humidity: " + day.main.humidity + "%");
            dayResult.append(dayHum);
        }

        botDiv.append(ul);
        $("#cityResult").append(botDiv);
    })
}

//Click search button to request and show API data results
$("button").on("click", function() {
    event.preventDefault();
    //Empty cityResult div for new city
    $("#cityResult").empty();
    // Obtain city name input from searchbar
    var city = $("#cityInput").val();
    getCurrent(city);
    getForecast(city);

    //Add last search to search history and update
    var index = pastSearches.indexOf(city);
    if (index > -1) {
      pastSearches.splice(index, 1);
    }

    pastSearches.push(city);
    localStorage.setItem("searches", JSON.stringify(pastSearches));
    showHistory();
})

$("#clearBtn").on("click", function() {
    pastSearches = [];
    localStorage.setItem("searches", JSON.stringify(pastSearches));
    showHistory();
})

showHistory();