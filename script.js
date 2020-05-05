//If search history was stored, retrieve
var pastSearches = localStorage.getItem("searches") ? JSON.parse(localStorage.getItem("searches")) : [];
var today = moment().format("l");
var APIkey = "7c39208aa3217ceafee7b802df1fe08b";

//Show search history
function showHistory() {
    for (i=0; i<pastSearches.length; i++) {
        var li = $("<li>").addClass("list-group-item list-group-item-action");
        li.attr("id", "pastSearch");
        li.text(pastSearches[i]);
        $("#searchHistory").prepend(li);
    }
}

//When recent search is clicked, weather information shown
$("#pastSearch").on("click", function() {
    var item = $(this).text();
    console.log(item);
    getCurrent(item);
    getForecast(item);
})

function getCurrent(city) {
    //Request current weather data from API
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(queryURL);
        console.log(response);

        // var icon = response.weather.icon;

        //Show current weather information
        var topDiv = $("<div>").addClass("current");
        topDiv.html(`<h2>${city} (${today})</h2>`);

        var temp = $("<p>").text("Temperature: " + ((response.main.temp-273.15)*(9/5)+32).toFixed(2) + "°F");
        topDiv.append(temp);
        var humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
        topDiv.append(humidity);
        var windspd = $("<p>").text("Wind Speed: " + response.wind.speed + " mph");
        topDiv.append(windspd);
        var uvindex = $("<p>").text("UV Index: ");
        topDiv.append(uvindex);

        $("#cityResult").append(topDiv);        
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
        
        //Obtain and show data for each day
        for (i=0; i<5; i++) {
            var day = results[i];
            var dayResult = $("<div>").addClass("forecastDay");
            var dayIcon = day.weather.icon;
            var dayTemp = day.main.temp;
            var dayHum = day.main.humidity;
        }

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
    pastSearches.push(city);
    localStorage.setItem("searches", JSON.stringify(pastSearches));
    showHistory();
})

showHistory();