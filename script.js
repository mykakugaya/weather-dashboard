//If search history was stored, retrieve
var pastSearches = localStorage.getItem("searches") ? JSON.parse(localStorage.getItem("searches")) : [];
var today = moment().format("l");

//Show search history
function showHistory() {
    for (i=0; i<pastSearches.length; i++) {
        var li = $("<li>").hasClass("searchItem list-group-item list-group-item-action");
        li.text(pastSearches[i]);
        $("#searchHistory").append(li);
    }
}

//When recent search is clicked, weather information shown
$(".searchItem").on("click", function() {
    var item = this.text();
    showResult(item);
})

//Function to show data received from API
function showResult(city) {
    //Request current weather data from API
    var APIkey = "7c39208aa3217ceafee7b802df1fe08b";
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response1) {
        console.log(response1);

        var icon = response1.weather.icon;

        //Show current weather information
        var topDiv = $("<div>").innerHTML(`<h2>${city} (${today})</h2>`);
        
        var temp = $("<p>").text("Temperature: " + ((response1.main.temp-273.15)*(9/5)+32) + "°F");
        topDiv.append(temp);
        var humidity = $("<p>").text("Humidity: " + response1.main.humidity + "%");
        topDiv.append(humidity);
        var windspd = $("<p>").text("Wind Speed: " + response1.wind.speed + "mph");
        topDiv.append(windspd);
        var uvindex = $("<p>").text("UV Index: ");
        topDiv.append(uvindex);

        $("cityResult").append(topDiv);        
    })

    //Request forecast data from API
    var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey;
    
    $.ajax({ 
        url: forecastURL,
        method: "GET"
    }).then(function(response2) {
        console.log(response2);
        var results = response2.list;

        //Show 5-day forecast information
        var botDiv = $("<div>").addClass("forecast").innerHTML("<h2>5-day Forecast:</h2>");
        for (i=0; i<5; i++) {
            //Obtain and show data for each day
            var day = results.list[i];
            var dayResult = $("<div>").addClass("forecastDay");
            var dayIcon = results.weather.icon;
            var dayTemp = results.main.temp;
            var dayHum = results.main.humidity;
        }

        $("cityResult").append(botDiv);
    })
}

//Obtain city name input from searchbar
$("#cityInput").on("keyup", function() {
    var input = this.value.trim();

    //Click search button to request API data
    $(".searchBtn").on("submit", function() {
        console.log("clicked");
        event.preventDefault();
        showResult(input);

        //Add last search to search history and update
        pastSearches.push(input);
        console.log(pastSearches);
        localStorage.setItem("searches", JSON.stringify(pastSearches));
        showHistory();
    })
})

showHistory();